/**
 * Zed-like Rust syntax highlighter — zero dependencies.
 * Produces an array of tokens with Tailwind class names mapped to Tokyo Night colors.
 */

export interface Token {
  text: string
  className: string
}

const KEYWORDS = new Set([
  "fn",
  "let",
  "mut",
  "pub",
  "const",
  "struct",
  "enum",
  "impl",
  "trait",
  "use",
  "mod",
  "if",
  "else",
  "match",
  "for",
  "while",
  "loop",
  "return",
  "async",
  "await",
  "where",
  "type",
  "static",
  "unsafe",
  "extern",
  "crate",
  "super",
  "dyn",
  "ref",
  "move",
  "as",
  "in",
  "break",
  "continue",
])

const BUILTIN_TYPES = new Set([
  "String",
  "Vec",
  "Option",
  "Result",
  "Box",
  "Rc",
  "Arc",
  "HashMap",
  "HashSet",
  "BTreeMap",
  "BTreeSet",
  "VecDeque",
  "Cow",
  "Cell",
  "RefCell",
  "Mutex",
  "RwLock",
  "Pin",
  "Future",
  "Stream",
  "Iterator",
  "PhantomData",
  "NonNull",
  "MaybeUninit",
  "i8",
  "i16",
  "i32",
  "i64",
  "i128",
  "isize",
  "u8",
  "u16",
  "u32",
  "u64",
  "u128",
  "usize",
  "f32",
  "f64",
  "bool",
  "char",
  "str",
])

const NUMBER_SUFFIX = /^(i8|i16|i32|i64|i128|isize|u8|u16|u32|u64|u128|usize|f32|f64)$/

function isAlpha(c: string): boolean {
  return (c >= "a" && c <= "z") || (c >= "A" && c <= "Z") || c === "_"
}

function isAlphaNum(c: string): boolean {
  return isAlpha(c) || (c >= "0" && c <= "9")
}

function isDigit(c: string): boolean {
  return c >= "0" && c <= "9"
}

/**
 * Tokenize Rust source code into highlighted spans.
 * Handles: keywords, types, functions, strings (regular + raw), numbers,
 * comments (line + nested block), macros, lifetimes, attributes, operators.
 */
export function tokenizeRust(code: string): Token[] {
  const tokens: Token[] = []
  let pos = 0
  const len = code.length
  let prevKeyword = ""

  function push(text: string, className: string) {
    tokens.push({ text, className })
  }

  // Try to parse a raw string starting at `pos` (which should be 'r').
  // Returns the end position if successful, or -1 if not a raw string.
  function tryParseRawString(startPos: number): number {
    let p = startPos + 1 // skip 'r'
    let hashCount = 0
    while (p < len && code[p] === "#") {
      hashCount++
      p++
    }
    if (p >= len || code[p] !== '"') return -1
    p++ // skip opening "
    const closing = '"' + "#".repeat(hashCount)
    const closeIdx = code.indexOf(closing, p)
    if (closeIdx !== -1) {
      return closeIdx + closing.length
    }
    return len // unterminated raw string, consume rest
  }

  while (pos < len) {
    const c = code[pos]

    // ── Whitespace ──
    if (c === " " || c === "\t" || c === "\n" || c === "\r") {
      const start = pos
      while (
        pos < len &&
        (code[pos] === " " || code[pos] === "\t" || code[pos] === "\n" || code[pos] === "\r")
      ) {
        pos++
      }
      push(code.slice(start, pos), "")
      continue
    }

    // ── Line comment ──
    if (c === "/" && pos + 1 < len && code[pos + 1] === "/") {
      const start = pos
      while (pos < len && code[pos] !== "\n") pos++
      push(code.slice(start, pos), "text-muted-foreground italic")
      continue
    }

    // ── Block comment (nested) ──
    if (c === "/" && pos + 1 < len && code[pos + 1] === "*") {
      const start = pos
      pos += 2
      let depth = 1
      while (pos < len && depth > 0) {
        if (code[pos] === "/" && pos + 1 < len && code[pos + 1] === "*") {
          depth++
          pos += 2
        } else if (code[pos] === "*" && pos + 1 < len && code[pos + 1] === "/") {
          depth--
          pos += 2
        } else {
          pos++
        }
      }
      push(code.slice(start, pos), "text-muted-foreground italic")
      continue
    }

    // ── Attributes: #[...] or #![...] ──
    if (
      c === "#" &&
      pos + 1 < len &&
      (code[pos + 1] === "[" || (code[pos + 1] === "!" && pos + 2 < len && code[pos + 2] === "["))
    ) {
      const start = pos
      pos++ // skip #
      if (code[pos] === "!") pos++ // skip !
      pos++ // skip [
      let depth = 1
      while (pos < len && depth > 0) {
        if (code[pos] === "[") depth++
        else if (code[pos] === "]") depth--
        pos++
      }
      push(code.slice(start, pos), "text-muted-foreground")
      continue
    }

    // ── Byte string: b"..." ──
    if (c === "b" && pos + 1 < len && code[pos + 1] === '"') {
      const start = pos
      pos += 2 // skip b"
      while (pos < len && code[pos] !== '"') {
        if (code[pos] === "\\") pos++ // skip escape
        pos++
      }
      if (pos < len) pos++ // skip closing "
      push(code.slice(start, pos), "text-tokyo-green")
      continue
    }

    // ── Byte char: b'x' ──
    if (c === "b" && pos + 1 < len && code[pos + 1] === "'") {
      const start = pos
      pos += 2 // skip b'
      if (pos < len && code[pos] === "\\") {
        pos++ // skip backslash
        pos++ // skip escaped char
      } else if (pos < len) {
        pos++ // skip char
      }
      if (pos < len && code[pos] === "'") pos++ // skip closing '
      push(code.slice(start, pos), "text-tokyo-green")
      continue
    }

    // ── Raw string: r"...", r#"..."#, etc. ──
    if (c === "r" && pos + 1 < len && (code[pos + 1] === '"' || code[pos + 1] === "#")) {
      const endPos = tryParseRawString(pos)
      if (endPos !== -1) {
        push(code.slice(pos, endPos), "text-tokyo-green")
        pos = endPos
        continue
      }
      // Not a raw string — fall through to identifier
    }

    // ── String literal ──
    if (c === '"') {
      const start = pos
      pos++ // skip opening "
      while (pos < len && code[pos] !== '"') {
        if (code[pos] === "\\") pos++ // skip escape
        pos++
      }
      if (pos < len) pos++ // skip closing "
      push(code.slice(start, pos), "text-tokyo-green")
      continue
    }

    // ── Character literal / Lifetime ──
    if (c === "'") {
      // Escaped char: '\n', '\x41', '\u{1F600}'
      if (pos + 1 < len && code[pos + 1] === "\\") {
        const start = pos
        pos += 2 // skip ' and \
        // Handle multi-char escapes
        if (pos < len && code[pos] === "u" && pos + 1 < len && code[pos + 1] === "{") {
          pos++ // skip u
          while (pos < len && code[pos] !== "}") pos++
          if (pos < len) pos++ // skip }
        } else if (pos < len) {
          pos++ // skip single escaped char
        }
        if (pos < len && code[pos] === "'") pos++ // skip closing '
        push(code.slice(start, pos), "text-tokyo-green")
        continue
      }

      // Simple char literal: 'x'
      if (pos + 2 < len && code[pos + 2] === "'") {
        push(code.slice(pos, pos + 3), "text-tokyo-green")
        pos += 3
        continue
      }

      // Lifetime: 'a, 'static
      if (pos + 1 < len && isAlpha(code[pos + 1])) {
        const start = pos
        pos++ // skip '
        while (pos < len && isAlphaNum(code[pos])) pos++
        push(code.slice(start, pos), "text-tokyo-red")
        continue
      }

      // Standalone quote
      push(c, "text-secondary-foreground")
      pos++
      continue
    }

    // ── Numbers ──
    if (isDigit(c)) {
      const start = pos
      if (c === "0" && pos + 1 < len) {
        const next = code[pos + 1]
        if (next === "x" || next === "X") {
          pos += 2
          while (pos < len && /[0-9a-fA-F_]/.test(code[pos])) pos++
        } else if (next === "b" || next === "B") {
          pos += 2
          while (pos < len && /[01_]/.test(code[pos])) pos++
        } else if (next === "o" || next === "O") {
          pos += 2
          while (pos < len && /[0-7_]/.test(code[pos])) pos++
        } else {
          // Decimal (may start with 0)
          while (pos < len && (isDigit(code[pos]) || code[pos] === "_")) pos++
          if (pos < len && code[pos] === "." && pos + 1 < len && isDigit(code[pos + 1])) {
            pos++
            while (pos < len && (isDigit(code[pos]) || code[pos] === "_")) pos++
          }
          if (pos < len && (code[pos] === "e" || code[pos] === "E")) {
            pos++
            if (pos < len && (code[pos] === "+" || code[pos] === "-")) pos++
            while (pos < len && (isDigit(code[pos]) || code[pos] === "_")) pos++
          }
        }
      } else {
        // Non-zero decimal
        while (pos < len && (isDigit(code[pos]) || code[pos] === "_")) pos++
        if (pos < len && code[pos] === "." && pos + 1 < len && isDigit(code[pos + 1])) {
          pos++
          while (pos < len && (isDigit(code[pos]) || code[pos] === "_")) pos++
        }
        if (pos < len && (code[pos] === "e" || code[pos] === "E")) {
          pos++
          if (pos < len && (code[pos] === "+" || code[pos] === "-")) pos++
          while (pos < len && (isDigit(code[pos]) || code[pos] === "_")) pos++
        }
      }
      // Type suffix: i32, u64, f64, usize, etc.
      if (pos < len && (code[pos] === "i" || code[pos] === "u" || code[pos] === "f")) {
        const suffixStart = pos
        while (pos < len && isAlphaNum(code[pos])) pos++
        if (!NUMBER_SUFFIX.test(code.slice(suffixStart, pos))) {
          pos = suffixStart // not a valid numeric suffix — rollback
        }
      }
      push(code.slice(start, pos), "text-tokyo-orange")
      continue
    }

    // ── Identifiers, keywords, macros, types, functions ──
    if (isAlpha(c)) {
      const start = pos
      while (pos < len && isAlphaNum(code[pos])) pos++
      const word = code.slice(start, pos)

      // Macro: identifier! (but not !=)
      if (pos < len && code[pos] === "!" && (pos + 1 >= len || code[pos + 1] !== "=")) {
        pos++ // include the !
        push(code.slice(start, pos), "text-tokyo-yellow")
        prevKeyword = ""
        continue
      }

      // self / Self → red
      if (word === "self" || word === "Self") {
        push(word, "text-tokyo-red")
        prevKeyword = ""
        continue
      }

      // Boolean literals → orange
      if (word === "true" || word === "false") {
        push(word, "text-tokyo-orange")
        prevKeyword = ""
        continue
      }

      // Keywords → magenta
      if (KEYWORDS.has(word)) {
        push(word, "text-tokyo-magenta")
        prevKeyword = word
        continue
      }

      // Function name after `fn` keyword
      if (prevKeyword === "fn") {
        push(word, "text-primary")
        prevKeyword = ""
        continue
      }

      // Type name after struct/enum/trait/type keyword
      if (
        prevKeyword === "struct" ||
        prevKeyword === "enum" ||
        prevKeyword === "trait" ||
        prevKeyword === "type"
      ) {
        push(word, "text-tokyo-cyan")
        prevKeyword = ""
        continue
      }

      // Known built-in types → cyan
      if (BUILTIN_TYPES.has(word)) {
        push(word, "text-tokyo-cyan")
        prevKeyword = ""
        continue
      }

      // Function call: identifier followed by (
      let la = pos
      while (la < len && code[la] === " ") la++
      if (la < len && code[la] === "(") {
        push(word, "text-primary")
        prevKeyword = ""
        continue
      }

      // PascalCase → likely a type
      if (word[0] >= "A" && word[0] <= "Z") {
        push(word, "text-tokyo-cyan")
        prevKeyword = ""
        continue
      }

      // Plain identifier
      push(word, "")
      prevKeyword = ""
      continue
    }

    // ── Three-character operators ──
    if (pos + 2 < len) {
      const three = code.slice(pos, pos + 3)
      if (three === "..=" || three === "<<=" || three === ">>=") {
        push(three, "text-secondary-foreground")
        pos += 3
        continue
      }
    }

    // ── Two-character operators ──
    if (pos + 1 < len) {
      const two = code.slice(pos, pos + 2)
      if (
        two === "::" ||
        two === "->" ||
        two === "=>" ||
        two === ".." ||
        two === "&&" ||
        two === "||" ||
        two === "==" ||
        two === "!=" ||
        two === "<=" ||
        two === ">=" ||
        two === "+=" ||
        two === "-=" ||
        two === "*=" ||
        two === "/=" ||
        two === "%=" ||
        two === "&=" ||
        two === "|=" ||
        two === "^=" ||
        two === "<<" ||
        two === ">>"
      ) {
        push(two, "text-secondary-foreground")
        pos += 2
        continue
      }
    }

    // ── Single-character operators & punctuation ──
    if ("(){}[]<>;,.:=+-*/%&|^!?@~".includes(c)) {
      push(c, "text-secondary-foreground")
      pos++
      continue
    }

    // ── Fallback ──
    push(c, "")
    pos++
  }

  return tokens
}

// ── TOML date/time pattern: 2024-01-15, 14:30:00, 2024-01-15T14:30:00Z ──
const TOML_DATETIME = /^\d{4}-\d{2}-\d{2}([T ]\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})?)?$/
const TOML_LOCAL_TIME = /^\d{2}:\d{2}(:\d{2}(\.\d+)?)?$/

function isTomlBareKeyChar(c: string): boolean {
  return isAlphaNum(c) || c === "-"
}

function looksLikeDatetime(code: string, pos: number): boolean {
  // Must start with 4 digits followed by '-': YYYY-
  if (pos + 4 >= code.length) return false
  for (let i = 0; i < 4; i++) {
    if (!isDigit(code[pos + i])) return false
  }
  return code[pos + 4] === "-"
}

function looksLikeLocalTime(code: string, pos: number): boolean {
  // HH:MM pattern
  if (pos + 4 >= code.length) return false
  return (
    isDigit(code[pos]) && isDigit(code[pos + 1]) && code[pos + 2] === ":" && isDigit(code[pos + 3])
  )
}

export function tokenizeToml(code: string): Token[] {
  const tokens: Token[] = []
  let pos = 0
  const len = code.length
  let lineStart = true
  let expectValue = false

  function push(text: string, className: string) {
    tokens.push({ text, className })
  }

  function consumeWhitespaceInline(): boolean {
    if (pos < len && (code[pos] === " " || code[pos] === "\t")) {
      const start = pos
      while (pos < len && (code[pos] === " " || code[pos] === "\t")) pos++
      push(code.slice(start, pos), "")
      return true
    }
    return false
  }

  function parseMultilineString(delimiter: string, className: string) {
    const start = pos
    pos += 3 // skip opening """ or '''
    const isBasic = delimiter === '"'
    while (pos < len) {
      if (
        code[pos] === delimiter &&
        pos + 2 < len &&
        code[pos + 1] === delimiter &&
        code[pos + 2] === delimiter
      ) {
        pos += 3
        break
      }
      if (isBasic && code[pos] === "\\") pos++ // skip escape in basic strings
      pos++
    }
    push(code.slice(start, pos), className)
  }

  function parseString(quote: string, className: string) {
    const start = pos
    pos++ // skip opening quote
    const isBasic = quote === '"'
    while (pos < len && code[pos] !== quote && code[pos] !== "\n") {
      if (isBasic && code[pos] === "\\") pos++ // skip escape
      pos++
    }
    if (pos < len && code[pos] === quote) pos++ // skip closing quote
    push(code.slice(start, pos), className)
  }

  function parseDatetimeOrNumber() {
    // Try datetime first: YYYY-MM-DD...
    if (looksLikeDatetime(code, pos)) {
      const start = pos
      // Consume: digits, '-', 'T', ' ', ':', '.', '+', 'Z'
      while (pos < len && /[0-9T Zt:.\-+]/.test(code[pos])) pos++
      const text = code.slice(start, pos)
      if (TOML_DATETIME.test(text)) {
        push(text, "text-tokyo-yellow")
        return
      }
      // Rollback — not a valid datetime
      pos = start
    }

    // Try local time: HH:MM:SS
    if (looksLikeLocalTime(code, pos)) {
      const start = pos
      while (pos < len && /[0-9:.]/.test(code[pos])) pos++
      const text = code.slice(start, pos)
      if (TOML_LOCAL_TIME.test(text)) {
        push(text, "text-tokyo-yellow")
        return
      }
      pos = start
    }

    // Number: hex, octal, binary, float, integer
    const start = pos
    if (code[pos] === "+" || code[pos] === "-") pos++
    if (pos < len && code[pos] === "0" && pos + 1 < len) {
      const next = code[pos + 1]
      if (next === "x" || next === "X") {
        pos += 2
        while (pos < len && /[0-9a-fA-F_]/.test(code[pos])) pos++
        push(code.slice(start, pos), "text-tokyo-orange")
        return
      }
      if (next === "o" || next === "O") {
        pos += 2
        while (pos < len && /[0-7_]/.test(code[pos])) pos++
        push(code.slice(start, pos), "text-tokyo-orange")
        return
      }
      if (next === "b" || next === "B") {
        pos += 2
        while (pos < len && /[01_]/.test(code[pos])) pos++
        push(code.slice(start, pos), "text-tokyo-orange")
        return
      }
    }
    // Decimal integer or float
    while (pos < len && (isDigit(code[pos]) || code[pos] === "_")) pos++
    if (pos < len && code[pos] === "." && pos + 1 < len && isDigit(code[pos + 1])) {
      pos++
      while (pos < len && (isDigit(code[pos]) || code[pos] === "_")) pos++
    }
    if (pos < len && (code[pos] === "e" || code[pos] === "E")) {
      pos++
      if (pos < len && (code[pos] === "+" || code[pos] === "-")) pos++
      while (pos < len && (isDigit(code[pos]) || code[pos] === "_")) pos++
    }
    push(code.slice(start, pos), "text-tokyo-orange")
  }

  function parseValue() {
    consumeWhitespaceInline()
    if (pos >= len) return

    const c = code[pos]

    // Multiline strings
    if (c === '"' && pos + 2 < len && code[pos + 1] === '"' && code[pos + 2] === '"') {
      parseMultilineString('"', "text-tokyo-green")
      return
    }
    if (c === "'" && pos + 2 < len && code[pos + 1] === "'" && code[pos + 2] === "'") {
      parseMultilineString("'", "text-tokyo-green")
      return
    }

    // Basic / literal strings
    if (c === '"') {
      parseString('"', "text-tokyo-green")
      return
    }
    if (c === "'") {
      parseString("'", "text-tokyo-green")
      return
    }

    // Booleans
    if (code.startsWith("true", pos) && (pos + 4 >= len || !isAlphaNum(code[pos + 4]))) {
      push("true", "text-tokyo-orange")
      pos += 4
      return
    }
    if (code.startsWith("false", pos) && (pos + 5 >= len || !isAlphaNum(code[pos + 5]))) {
      push("false", "text-tokyo-orange")
      pos += 5
      return
    }

    // inf / nan
    const signedStart = pos
    if (c === "+" || c === "-") {
      const rest = code.slice(pos + 1)
      if (rest.startsWith("inf") && (pos + 4 >= len || !isAlphaNum(code[pos + 4]))) {
        push(code.slice(pos, pos + 4), "text-tokyo-orange")
        pos += 4
        return
      }
      if (rest.startsWith("nan") && (pos + 4 >= len || !isAlphaNum(code[pos + 4]))) {
        push(code.slice(pos, pos + 4), "text-tokyo-orange")
        pos += 4
        return
      }
    }
    if (code.startsWith("inf", pos) && (pos + 3 >= len || !isAlphaNum(code[pos + 3]))) {
      push("inf", "text-tokyo-orange")
      pos += 3
      return
    }
    if (code.startsWith("nan", pos) && (pos + 3 >= len || !isAlphaNum(code[pos + 3]))) {
      push("nan", "text-tokyo-orange")
      pos += 3
      return
    }

    // Inline table
    if (c === "{") {
      push("{", "text-secondary-foreground")
      pos++
      expectValue = false
      return
    }

    // Array
    if (c === "[") {
      push("[", "text-secondary-foreground")
      pos++
      expectValue = true
      return
    }

    // Datetime or number (both start with digit or +/-)
    if (isDigit(c) || ((c === "+" || c === "-") && pos + 1 < len && isDigit(code[pos + 1]))) {
      parseDatetimeOrNumber()
      return
    }

    // If nothing matched, consume as plain text until newline/comma/bracket
    pos = signedStart
  }

  while (pos < len) {
    const c = code[pos]

    // ── Newlines ──
    if (c === "\n" || c === "\r") {
      const start = pos
      if (c === "\r" && pos + 1 < len && code[pos + 1] === "\n") pos += 2
      else pos++
      push(code.slice(start, pos), "")
      lineStart = true
      expectValue = false
      continue
    }

    // ── Whitespace ──
    if (c === " " || c === "\t") {
      consumeWhitespaceInline()
      continue
    }

    // ── Comment ──
    if (c === "#") {
      const start = pos
      while (pos < len && code[pos] !== "\n") pos++
      push(code.slice(start, pos), "text-muted-foreground italic")
      continue
    }

    // ── Array of tables: [[...]] ──
    if (lineStart && c === "[" && pos + 1 < len && code[pos + 1] === "[") {
      push("[[", "text-secondary-foreground")
      pos += 2
      consumeWhitespaceInline()
      // Table path
      const keyStart = pos
      while (pos < len && code[pos] !== "]" && code[pos] !== "\n") pos++
      if (pos > keyStart) push(code.slice(keyStart, pos), "text-tokyo-magenta")
      consumeWhitespaceInline()
      if (pos + 1 < len && code[pos] === "]" && code[pos + 1] === "]") {
        push("]]", "text-secondary-foreground")
        pos += 2
      }
      lineStart = false
      expectValue = false
      continue
    }

    // ── Table header: [...] ──
    if (lineStart && c === "[") {
      push("[", "text-secondary-foreground")
      pos++
      consumeWhitespaceInline()
      const keyStart = pos
      while (pos < len && code[pos] !== "]" && code[pos] !== "\n") pos++
      if (pos > keyStart) push(code.slice(keyStart, pos), "text-tokyo-magenta")
      consumeWhitespaceInline()
      if (pos < len && code[pos] === "]") {
        push("]", "text-secondary-foreground")
        pos++
      }
      lineStart = false
      expectValue = false
      continue
    }

    // ── In value context ──
    if (expectValue) {
      // Closing brackets
      if (c === "]") {
        push("]", "text-secondary-foreground")
        pos++
        continue
      }
      if (c === "}") {
        push("}", "text-secondary-foreground")
        pos++
        expectValue = false
        continue
      }

      // Comma separator
      if (c === ",") {
        push(",", "text-secondary-foreground")
        pos++
        continue
      }

      // Equals inside inline table
      if (c === "=") {
        push("=", "text-secondary-foreground")
        pos++
        expectValue = true
        continue
      }

      // Dot in inline table keys
      if (c === ".") {
        push(".", "text-secondary-foreground")
        pos++
        continue
      }

      // Key inside inline table (bare key before =)
      if (isAlphaNum(c) || c === "-") {
        // Peek ahead: is this a key (followed by = or .) or a value?
        let la = pos
        while (la < len && isTomlBareKeyChar(code[la])) la++
        let lb = la
        while (lb < len && (code[lb] === " " || code[lb] === "\t")) lb++
        if (lb < len && (code[lb] === "=" || code[lb] === ".")) {
          // It's a key
          push(code.slice(pos, la), "text-tokyo-cyan")
          pos = la
          continue
        }
        // It's a value — delegate
        parseValue()
        continue
      }

      // Quoted key inside inline table
      if ((c === '"' || c === "'") && expectValue) {
        let la = pos + 1
        const q = c
        while (la < len && code[la] !== q && code[la] !== "\n") {
          if (q === '"' && code[la] === "\\") la++
          la++
        }
        if (la < len) la++ // closing quote
        let lb = la
        while (lb < len && (code[lb] === " " || code[lb] === "\t")) lb++
        if (lb < len && (code[lb] === "=" || code[lb] === ".")) {
          // Quoted key
          push(code.slice(pos, la), "text-tokyo-cyan")
          pos = la
          continue
        }
      }

      parseValue()
      continue
    }

    // ── Key at line start (bare or quoted) ──
    lineStart = false

    // Quoted key
    if (c === '"' || c === "'") {
      parseString(c, "text-tokyo-cyan")
      continue
    }

    // Bare key
    if (isAlphaNum(c) || c === "-") {
      const start = pos
      while (pos < len && isTomlBareKeyChar(code[pos])) pos++
      push(code.slice(start, pos), "text-tokyo-cyan")
      continue
    }

    // Dot in dotted keys
    if (c === ".") {
      push(".", "text-secondary-foreground")
      pos++
      continue
    }

    // Equals sign — switch to value context
    if (c === "=") {
      push("=", "text-secondary-foreground")
      pos++
      expectValue = true
      continue
    }

    // Brackets (array/inline table values)
    if (c === "[" || c === "]" || c === "{" || c === "}") {
      push(c, "text-secondary-foreground")
      pos++
      continue
    }

    // Comma
    if (c === ",") {
      push(",", "text-secondary-foreground")
      pos++
      continue
    }

    // ── Fallback ──
    push(c, "")
    pos++
  }

  return tokens
}
