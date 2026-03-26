# Full-Stack Interview Preparation Guide (2025-2026)

_Tailored for Purbayan Pramanik. TypeScript, React 19, Next.js 15, Rust, Go, C, systems programming, Zustand, Tailwind, Supabase/PostgreSQL._

---

## How Modern Interviews Work (2025-2026)

The interview landscape has shifted. Companies no longer reward memorized trivia or whiteboard gymnastics performed in silence. What they want now: **judgment under pressure**.

### The New Reality

AI tools like Copilot, Claude, and ChatGPT are expected in your workflow. Interviewers aren't testing whether you can write a binary search from memory. They're testing whether you can:

- **Guide AI output** toward correct solutions and catch when it hallucinates
- **Explain tradeoffs** in plain language, not jargon soup
- **Spot errors** in generated code (security holes, performance traps, incorrect assumptions)
- **Measure first**, then optimize. The "measure first" mindset for debugging is non-negotiable.

### Typical Interview Pipeline

1. **Phone Screen** (30-45 min) — Behavioral + light technical. "Walk me through your most complex project." This is where your systems programming background shines.
2. **Coding Round** (45-60 min) — Live coding, often with shared IDE. You can use AI tools at some companies, but you must explain every line.
3. **System Design** (45-60 min) — Design a distributed system. Interviewers want to see you navigate ambiguity, ask clarifying questions, and make explicit tradeoff decisions.
4. **Behavioral** (30-45 min) — STAR method. Real stories from real projects. Generic answers get filtered out instantly.
5. **Take-home** (optional, 2-4 hours) — Some companies still do these. Ship clean, tested code. README matters.

### What Interviewers Actually Look For

They're not scoring you on a rubric of correct answers. They're evaluating:

- Can you explain a complex concept to a non-expert?
- When you hit a wall, do you freeze or do you reason through it?
- Do you ask clarifying questions before diving in?
- Can you articulate _why_ you chose approach A over approach B?
- Do you test your assumptions?

> **Purbayan's Angle:** Your mechanical engineering background is a feature, not a bug. Engineers think in systems, constraints, and tradeoffs. That's exactly what interviewers want. Lead with "I approach software the way I approach engineering problems: define constraints, prototype, measure, iterate."

---

## JavaScript & TypeScript Deep Theory

### Event Loop

The event loop is JavaScript's concurrency model. Single-threaded, but non-blocking. Understanding it separates people who write JS from people who _understand_ JS.

**How it works:**

The call stack executes synchronous code. When an async operation completes, its callback goes into a queue. There are two queues that matter:

- **Microtask queue** — `Promise.then()`, `queueMicrotask()`, `MutationObserver`. Drained completely after each macrotask.
- **Macrotask queue** — `setTimeout`, `setInterval`, I/O callbacks, `setImmediate` (Node). One macrotask runs per tick.

The order: current call stack empties → all microtasks drain → one macrotask runs → repeat.

```javascript
console.log("A") // sync — runs first
setTimeout(() => console.log("B"), 0) // macrotask queue
Promise.resolve().then(() => console.log("C")) // microtask queue
console.log("D") // sync — runs second

// Output: A, D, C, B
```

Why `A, D, C, B`? Synchronous code (`A`, `D`) runs first because it's on the call stack. Then the microtask queue drains (`C` from the resolved Promise). Then the macrotask queue runs (`B` from setTimeout, even though the delay is 0).

> 🎯 **Interview Tip:** Always trace through async code execution step by step. Interviewers want to see you reason about timing, not memorize output.

**Interview Question: "What's the output of this code and why?"**

```javascript
async function foo() {
  console.log("1")
  await Promise.resolve()
  console.log("2")
}

console.log("3")
foo()
console.log("4")

// Output: 3, 1, 4, 2
```

`console.log('3')` runs first. Then `foo()` is called. Inside `foo`, `console.log('1')` runs synchronously. The `await` pauses `foo` and schedules the rest as a microtask. Control returns to the caller, so `console.log('4')` runs. Then the microtask queue drains: `console.log('2')`.

> **Purbayan's Angle:** Connect this to your TCP server work in 4at. "I built a TCP chat server in Rust where I had to think about event-driven I/O at the OS level. JavaScript's event loop is a higher-level abstraction of the same concept: non-blocking I/O with an event queue."

---

### Closures

A closure is a function that remembers the variables from its lexical scope, even after that scope has finished executing.

```javascript
function createCounter() {
  let count = 0
  return {
    increment: () => ++count,
    getCount: () => count,
  }
}

const counter = createCounter()
counter.increment()
counter.increment()
console.log(counter.getCount()) // 2
// `count` is not accessible directly — it's enclosed
```

**Why closures matter in practice:**

1. **Encapsulation** — private variables without classes
2. **Function factories** — `createLogger('DEBUG')` returns a function pre-configured with a log level
3. **Callbacks and event handlers** — every `addEventListener` callback that references outer variables is a closure

**The stale closure trap in React:**

```javascript
function Timer() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      // BUG: `count` is captured at 0, never updates
      console.log(count)
      setCount(count + 1) // always sets to 1
    }, 1000)
    return () => clearInterval(id)
  }, []) // empty deps = closure captures initial count
}
```

Fix: use the functional updater `setCount(prev => prev + 1)` or add `count` to the dependency array (but then the interval resets every second).

> ⚠️ **Watch Out:** Stale closures are the #1 React debugging nightmare. Always check dependency arrays in useEffect and useCallback.

**Interview Question: "How do closures cause memory leaks?"**

If a closure holds a reference to a large object and the closure itself is long-lived (stored in a global, an event listener that's never removed, a timer that's never cleared), the garbage collector can't reclaim that object. The fix: clean up event listeners, clear timers, and use `WeakRef` when appropriate.

> **Purbayan's Angle:** "I ran into stale closures when working with tldraw at fiddle. The canvas editor instance was captured in a useEffect closure, and when the component re-rendered with a new editor reference, the old closure still pointed to the stale one. Understanding closure semantics was critical for debugging that."

---

### Prototypal Inheritance

JavaScript doesn't have classical inheritance. It has prototypal inheritance: objects delegate to other objects through the prototype chain.

```javascript
const animal = {
  speak() {
    return `${this.name} makes a sound`
  },
}

const dog = Object.create(animal)
dog.name = "Rex"
dog.bark = function () {
  return `${this.name} barks`
}

dog.speak() // "Rex makes a sound" — delegated to animal
dog.bark() // "Rex barks" — own method
```

**The prototype chain:** When you access a property on an object, JS looks at the object itself first. If not found, it follows `__proto__` to the prototype, then the prototype's prototype, all the way up to `Object.prototype`, then `null`.

**ES6 classes are syntactic sugar:**

```javascript
class Animal {
  constructor(name) {
    this.name = name
  }
  speak() {
    return `${this.name} makes a sound`
  }
}

// Under the hood, this creates:
// - A constructor function `Animal`
// - `Animal.prototype.speak = function() { ... }`
// - `new Animal('Rex')` creates an object with __proto__ = Animal.prototype
```

**Interview Question: "What's the difference between `Object.create()` and the `new` keyword?"**

`Object.create(proto)` creates a new object with `proto` as its prototype. No constructor is called. `new Constructor()` creates a new object, sets its prototype to `Constructor.prototype`, calls the constructor with `this` bound to the new object, and returns it (unless the constructor explicitly returns an object).

---

### Temporal Dead Zone (TDZ)

`let` and `const` are hoisted, but they're not initialized until the declaration is reached. The gap between the start of the scope and the declaration is the Temporal Dead Zone.

```javascript
console.log(x) // ReferenceError: Cannot access 'x' before initialization
let x = 5

console.log(y) // undefined (var is hoisted AND initialized to undefined)
var y = 5
```

**Why TDZ exists:** Bug prevention. With `var`, you could accidentally use a variable before it was assigned and get `undefined` silently. TDZ makes this a loud error.

**Interview Question: "When can AI refactoring tools break code with TDZ issues?"**

When an AI tool refactors `var` to `let`/`const` (a common "modernization" suggestion), it can introduce TDZ errors if the original code relied on `var`'s hoisting behavior. Example:

```javascript
// Original — works because var hoists
function init() {
  setup(config)
  var config = getConfig()
}

// AI "fix" — breaks because of TDZ
function init() {
  setup(config) // ReferenceError!
  const config = getConfig()
}
```

Always review AI refactoring suggestions. Mechanical transformations miss semantic context.

---

### The `this` Keyword

`this` in JavaScript is determined by _how a function is called_, not where it's defined. Four binding rules, in order of precedence:

1. **`new` binding** — `new Foo()` creates a new object, `this` = that object
2. **Explicit binding** — `call()`, `apply()`, `bind()` set `this` explicitly
3. **Implicit binding** — `obj.method()` sets `this` = `obj`
4. **Default binding** — standalone function call, `this` = `undefined` (strict mode) or `globalThis`

**Arrow functions are different.** They don't have their own `this`. They inherit `this` from the enclosing lexical scope.

```javascript
const obj = {
  name: "Purbayan",
  greet: function () {
    return this.name
  }, // implicit binding: this = obj
  greetArrow: () => this.name, // lexical: this = outer scope (module/global)
  greetDelayed: function () {
    setTimeout(() => {
      console.log(this.name) // arrow inherits this from greetDelayed
    }, 100)
  },
}

obj.greet() // "Purbayan"
obj.greetArrow() // undefined (or global name)
obj.greetDelayed() // "Purbayan" — arrow captures the right `this`
```

**Interview Question: "Why do class methods lose `this` when passed as callbacks?"**

```javascript
class Button {
  label = "Click me"
  handleClick() {
    console.log(this.label)
  }
}

const btn = new Button()
document.addEventListener("click", btn.handleClick) // `this` is the DOM element, not btn
```

Fixes: arrow function in class field (`handleClick = () => { ... }`), or `bind` in the constructor, or wrap in an arrow function at the call site.

---

### Promises & async/await

A Promise represents a value that may not exist yet. Three states: **pending**, **fulfilled**, **rejected**. Once settled, it can't change.

**Error handling patterns:**

```javascript
// Promise chain — .catch() handles any error in the chain
fetchUser(id)
  .then((user) => fetchPosts(user.id))
  .then((posts) => render(posts))
  .catch((err) => showError(err)) // catches errors from any step

// async/await — try/catch
async function loadUserPosts(id) {
  try {
    const user = await fetchUser(id)
    const posts = await fetchPosts(user.id)
    return posts
  } catch (err) {
    showError(err)
  }
}
```

**Promise combinators:**

| Method               | Behavior                              | Use Case                                |
| -------------------- | ------------------------------------- | --------------------------------------- |
| `Promise.all`        | Rejects if ANY rejects                | Fetch multiple resources, all required  |
| `Promise.allSettled` | Never rejects, returns status of each | Fetch multiple, handle partial failures |
| `Promise.race`       | Settles with first to settle          | Timeout pattern                         |
| `Promise.any`        | Resolves with first to resolve        | Fastest mirror/CDN                      |

**Interview Question: "Implement a timeout wrapper for any promise."**

```javascript
function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), ms))
  return Promise.race([promise, timeout])
}

// Usage
const data = await withTimeout(fetch("/api/data"), 5000)
```

> **Purbayan's Angle:** "In my fiddle work, I dealt with race conditions between React Query cache invalidation and tldraw's async initialization. Understanding Promise semantics was essential for sequencing the canvas load correctly."

---

### TypeScript Specifics

**Generics** constrain types without losing type information:

```typescript
// Without generics — loses type info
function first(arr: any[]): any {
  return arr[0]
}

// With generics — preserves type
function first<T>(arr: T[]): T {
  return arr[0]
}
const n = first([1, 2, 3]) // type: number
const s = first(["a", "b"]) // type: string
```

**Discriminated Unions** are the TypeScript pattern for handling variants:

```typescript
type Result<T> = { status: "success"; data: T } | { status: "error"; error: Error }

function handle<T>(result: Result<T>) {
  if (result.status === "success") {
    // TypeScript knows result.data exists here
    console.log(result.data)
  } else {
    // TypeScript knows result.error exists here
    console.error(result.error.message)
  }
}
```

**Conditional Types:**

```typescript
type IsString<T> = T extends string ? true : false
type A = IsString<"hello"> // true
type B = IsString<42> // false

// Practical: extract return type of async functions
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T
type Data = UnwrapPromise<Promise<string>> // string
```

**Mapped Types and Utility Types:**

```typescript
// Make all properties optional
type Partial<T> = { [K in keyof T]?: T[K] }

// Pick specific properties
type Pick<T, K extends keyof T> = { [P in K]: T[P] }

// Real-world: API response where some fields are optional on update
type UserUpdate = Partial<Pick<User, "name" | "email" | "avatar">>
```

**Interview Question: "Write a type-safe event emitter."**

```typescript
type EventMap = {
  click: { x: number; y: number }
  keypress: { key: string }
}

class TypedEmitter<T extends Record<string, unknown>> {
  private listeners = new Map<keyof T, Set<(data: any) => void>>()

  on<K extends keyof T>(event: K, handler: (data: T[K]) => void) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set())
    this.listeners.get(event)!.add(handler)
  }

  emit<K extends keyof T>(event: K, data: T[K]) {
    this.listeners.get(event)?.forEach((fn) => fn(data))
  }
}

const emitter = new TypedEmitter<EventMap>()
emitter.on("click", ({ x, y }) => {
  /* x and y are typed as number */
})
emitter.emit("keypress", { key: "Enter" }) // type-checked
```

> **Purbayan's Angle:** "I use TypeScript extensively with Zustand stores and Next.js server actions. Discriminated unions are my go-to for modeling API response states, and I use generics heavily in reusable form components."

---

### Modules (ESM vs CommonJS)

**CommonJS** (`require`/`module.exports`) — synchronous, Node.js default (historically). Loads modules at runtime.

**ESM** (`import`/`export`) — asynchronous, static analysis possible. The standard going forward.

Key difference: ESM imports are **live bindings** (they reflect the current value of the export), while CommonJS copies the value at require time.

```javascript
// ESM — live binding
// counter.mjs
export let count = 0
export function increment() {
  count++
}

// main.mjs
import { count, increment } from "./counter.mjs"
console.log(count) // 0
increment()
console.log(count) // 1 — live binding reflects the change

// CommonJS — copied value
// counter.cjs
let count = 0
module.exports = {
  count,
  increment: () => {
    count++
  },
}

// main.cjs
const { count, increment } = require("./counter.cjs")
console.log(count) // 0
increment()
console.log(count) // 0 — still 0, it's a copy
```

**Tree shaking** works with ESM because imports are statically analyzable. Bundlers can determine at build time which exports are unused and remove them. CommonJS `require()` can be dynamic (`require(someVariable)`), making static analysis impossible.

**Circular dependencies:** ESM handles them better because of live bindings. CommonJS can return partially initialized modules.

---

### WeakMap / WeakSet

Keys in a `WeakMap` must be objects, and they're held _weakly_. If nothing else references the key object, it gets garbage collected along with its associated value.

```javascript
// Private data pattern
const privateData = new WeakMap()

class User {
  constructor(name, ssn) {
    this.name = name
    privateData.set(this, { ssn }) // truly private
  }
  getSSN() {
    return privateData.get(this).ssn
  }
}

const user = new User("Purbayan", "123-45-6789")
user.getSSN() // works
// When `user` is garbage collected, the WeakMap entry is too
```

**Use cases:** DOM node metadata, caching computed results for objects without preventing GC, associating data with third-party objects you don't control.

---

### Proxy / Reflect

`Proxy` wraps an object and intercepts operations (get, set, delete, function calls, etc.). `Reflect` provides the default behavior for each trap.

```javascript
const handler = {
  get(target, prop, receiver) {
    console.log(`Accessing ${String(prop)}`)
    return Reflect.get(target, prop, receiver)
  },
  set(target, prop, value, receiver) {
    if (typeof value !== "string") throw new TypeError("Only strings allowed")
    return Reflect.set(target, prop, value, receiver)
  },
}

const obj = new Proxy({}, handler)
obj.name = "Purbayan" // logs: Accessing name (on next get)
obj.age = 25 // throws TypeError
```

**Interview Question: "How do reactive frameworks like Vue use Proxy?"**

Vue 3's reactivity system wraps data objects in Proxies. The `get` trap tracks which components depend on which properties (dependency tracking). The `set` trap triggers re-renders for dependent components when a property changes. This is more performant and complete than Vue 2's `Object.defineProperty` approach, which couldn't detect property additions or array index mutations.

---

## React 19 + Next.js 15 (Frontend Deep Dive)

### React Server Components (RSC)

Server Components run on the server and send rendered HTML + a serialized component tree to the client. They never ship JavaScript to the browser.

**RSC vs SSR:**

- **SSR** renders components to HTML on the server, then ships the full JS bundle to the client for hydration. The component code runs on both server and client.
- **RSC** components _only_ run on the server. Their JS never reaches the client. They can directly access databases, file systems, and secrets.

```tsx
// Server Component (default in Next.js App Router)
// This code NEVER ships to the browser
async function UserProfile({ userId }: { userId: string }) {
  const user = await db.query("SELECT * FROM users WHERE id = $1", [userId])
  return <div>{user.name}</div>
}

// Client Component — needs 'use client' directive
;("use client")
import { useState } from "react"

function LikeButton() {
  const [liked, setLiked] = useState(false)
  return <button onClick={() => setLiked(!liked)}>{liked ? "Liked" : "Like"}</button>
}
```

**When to use which:**

- Server Component: data fetching, accessing backend resources, large dependencies (markdown renderers, syntax highlighters)
- Client Component: interactivity (onClick, onChange), browser APIs, state, effects

> 💡 **Key Insight:** Server Components are NOT SSR. SSR ships JS for hydration. Server Components ship zero JS. This distinction matters in interviews.

**The 'use server' directive** marks functions as Server Actions, callable from client components:

```tsx
// actions.ts
"use server"

export async function createPost(formData: FormData) {
  const title = formData.get("title") as string
  await db.insert("posts", { title })
  revalidatePath("/posts")
}
```

> **Purbayan's Angle:** "At fiddle, I worked with a component preview system where server components were perfect for rendering component metadata and documentation, while the actual interactive preview needed client components. Understanding the RSC boundary was critical for keeping the bundle size small."

---

### React 19 New Features

**`useActionState`** (replaces `useFormState`):

```tsx
"use client"
import { useActionState } from "react"
import { submitForm } from "./actions"

function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitForm, null)

  return (
    <form action={formAction}>
      <input name="email" type="email" />
      <button disabled={isPending}>{isPending ? "Sending..." : "Submit"}</button>
      {state?.error && <p className="text-red-500">{state.error}</p>}
    </form>
  )
}
```

**`useOptimistic`** for instant UI feedback:

```tsx
"use client"
import { useOptimistic } from "react"

function Messages({ messages }: { messages: Message[] }) {
  const [optimisticMessages, addOptimistic] = useOptimistic(
    messages,
    (state, newMessage: string) => [
      ...state,
      { id: crypto.randomUUID(), text: newMessage, sending: true },
    ],
  )

  async function sendMessage(formData: FormData) {
    const text = formData.get("text") as string
    addOptimistic(text) // instant UI update
    await submitMessage(text) // actual server call
  }

  return (
    <div>
      {optimisticMessages.map((msg) => (
        <p key={msg.id} style={{ opacity: msg.sending ? 0.5 : 1 }}>
          {msg.text}
        </p>
      ))}
      <form action={sendMessage}>
        <input name="text" />
        <button>Send</button>
      </form>
    </div>
  )
}
```

**React Compiler** (React Forget): Automatically memoizes components and values. Makes manual `useMemo`, `useCallback`, and `React.memo` largely unnecessary. The compiler analyzes your code at build time and inserts memoization where beneficial.

**`useFormStatus`** reads the status of a parent form:

```tsx
"use client"
import { useFormStatus } from "react-dom"

function SubmitButton() {
  const { pending } = useFormStatus()
  return <button disabled={pending}>{pending ? "Saving..." : "Save"}</button>
}
```

---

### Virtual DOM & Reconciliation

React maintains a virtual representation of the UI in memory. When state changes, React creates a new virtual tree, diffs it against the previous one, and applies the minimal set of DOM mutations.

**Fiber Architecture** (React 16+): The reconciler was rewritten to be incremental. Instead of recursively diffing the entire tree synchronously (blocking the main thread), Fiber breaks work into units that can be paused, resumed, and prioritized.

**Concurrent Rendering** (React 18+): Fiber enables concurrent features. React can prepare multiple versions of the UI simultaneously, interrupt low-priority renders for high-priority updates (like user input), and show intermediate states with Suspense.

**Key diffing rules:**

1. Elements of different types produce different trees (full remount)
2. Elements of the same type are updated in place (attributes diffed)
3. `key` prop helps React identify which items in a list changed, moved, or were removed

**Interview Question: "Why shouldn't you use array index as a key?"**

If items are reordered, inserted, or deleted, index-based keys cause React to update the wrong elements. A todo list where you delete the first item: with index keys, React thinks item 0 changed content, item 1 changed content, and the last item was removed. With stable IDs as keys, React correctly identifies that item 0 was removed.

---

### State Management

**When to use what:**

| Tool                             | Use Case                                                                  |
| -------------------------------- | ------------------------------------------------------------------------- |
| `useState`                       | Local component state, simple values                                      |
| `useReducer`                     | Complex state logic, multiple related values, state machines              |
| Context API                      | Infrequently changing global state (theme, locale, auth)                  |
| Zustand                          | Frequently changing shared state, when Context causes too many re-renders |
| Server state (React Query / SWR) | Remote data, caching, synchronization                                     |

**Why Zustand over Context for frequent updates:**

Context triggers re-renders for _every_ consumer when the value changes, even if a consumer only uses a slice of the state. Zustand uses external stores with selectors, so components only re-render when their selected slice changes.

```typescript
// Zustand store
import { create } from 'zustand';

interface EditorStore {
  selectedTool: string;
  zoom: number;
  setTool: (tool: string) => void;
  setZoom: (zoom: number) => void;
}

const useEditorStore = create<EditorStore>((set) => ({
  selectedTool: 'select',
  zoom: 1,
  setTool: (tool) => set({ selectedTool: tool }),
  setZoom: (zoom) => set({ zoom }),
}));

// Component only re-renders when `zoom` changes
function ZoomIndicator() {
  const zoom = useEditorStore((state) => state.zoom);
  return <span>{Math.round(zoom * 100)}%</span>;
}
```

> **Purbayan's Angle:** "I use Zustand for editor state in canvas-heavy applications. At fiddle, the component preview system had complex state (selected component, viewport size, theme, zoom level) that needed to be shared across the toolbar, canvas, and sidebar without causing cascade re-renders. Zustand's selector pattern was perfect."

---

### useMemo / useCallback / React.memo

**`useMemo`** caches a computed value between renders:

```tsx
const sortedItems = useMemo(() => items.sort((a, b) => a.name.localeCompare(b.name)), [items])
```

**`useCallback`** caches a function reference:

```tsx
const handleClick = useCallback((id: string) => {
  setSelected(id)
}, [])
```

**`React.memo`** prevents re-renders if props haven't changed (shallow comparison).

**When they hurt:** Every memoization has a cost (memory for cached values, comparison overhead). If the computation is cheap or the component is simple, memoization adds complexity without benefit.

**React Compiler changes everything:** With React 19's compiler, manual memoization becomes largely unnecessary. The compiler automatically determines what needs memoization. Write straightforward code and let the compiler optimize.

**Interview Question: "When would you still manually memoize even with React Compiler?"**

Edge cases: expensive computations that the compiler can't statically analyze (dynamic dependencies), third-party library integration where you need referential stability for external subscriptions, and performance-critical paths where you want explicit control.

---

### Rendering Strategies

| Strategy | When HTML is Generated      | JS Shipped                | Use Case                                        |
| -------- | --------------------------- | ------------------------- | ----------------------------------------------- |
| **CSR**  | In browser                  | Full bundle               | SPAs, dashboards behind auth                    |
| **SSR**  | Per request on server       | Full bundle for hydration | Dynamic, personalized pages                     |
| **SSG**  | At build time               | Minimal                   | Blog posts, docs, marketing                     |
| **ISR**  | At build time + revalidated | Minimal                   | E-commerce products, frequently updated content |

**Next.js 15 App Router** defaults to Server Components (SSR/SSG depending on data). Pages are static by default unless they use dynamic functions (`cookies()`, `headers()`, `searchParams`).

**Partial Prerendering (PPR):** Next.js 15's experimental feature. A page can be partially static and partially dynamic. The static shell loads instantly, and dynamic parts stream in with Suspense boundaries.

```tsx
export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <div>
      {/* Static shell — rendered at build time */}
      <Header />
      <ProductInfo id={params.id} />

      {/* Dynamic — streams in */}
      <Suspense fallback={<Skeleton />}>
        <Reviews productId={params.id} />
      </Suspense>

      <Suspense fallback={<Skeleton />}>
        <Recommendations productId={params.id} />
      </Suspense>
    </div>
  )
}
```

---

### Hydration

Hydration is the process where React attaches event listeners and state to server-rendered HTML. The server sends static HTML (fast initial paint), then React "hydrates" it by making it interactive.

**Hydration mismatch errors** happen when the server-rendered HTML doesn't match what React expects on the client. Common causes:

- Using `Date.now()` or `Math.random()` during render
- Browser-only APIs (`window.innerWidth`)
- Extensions modifying the DOM

**Streaming SSR** sends HTML in chunks as components resolve. Combined with Suspense, the server can send the shell immediately and stream in data-dependent sections as they become ready.

**Selective Hydration** (React 18+): React can hydrate different parts of the page independently. If a user clicks on a section that hasn't hydrated yet, React prioritizes hydrating that section.

---

### Next.js Routing (App Router)

**Parallel Routes** render multiple pages in the same layout simultaneously:

```
app/
  @dashboard/
    page.tsx
  @analytics/
    page.tsx
  layout.tsx    ← receives both as props: { dashboard, analytics }
```

**Intercepting Routes** show a route in a modal while keeping the background page:

```
app/
  feed/
    page.tsx
    (..)photo/[id]/   ← intercepts /photo/[id] when navigating from feed
      page.tsx
  photo/[id]/
    page.tsx          ← direct URL access shows full page
```

**Route Handlers** replace API routes:

```typescript
// app/api/users/route.ts
export async function GET(request: Request) {
  const users = await db.query("SELECT * FROM users")
  return Response.json(users)
}

export async function POST(request: Request) {
  const body = await request.json()
  const user = await db.insert("users", body)
  return Response.json(user, { status: 201 })
}
```

---

### Performance

**Core Web Vitals:**

- **LCP (Largest Contentful Paint)** — how fast the main content loads. Target: < 2.5s
- **INP (Interaction to Next Paint)** — replaces FID. How fast the page responds to interactions. Target: < 200ms
- **CLS (Cumulative Layout Shift)** — visual stability. Target: < 0.1

> ⚠️ **Watch Out:** Never lazy-load above-the-fold content. It hurts LCP. Only lazy-load what's below the viewport.

**Optimization techniques:**

1. **Code splitting** — `dynamic()` in Next.js, `React.lazy()` for client components
2. **Image optimization** — `next/image` with automatic sizing, format conversion, lazy loading
3. **Font optimization** — `next/font` for zero-layout-shift font loading
4. **Bundle analysis** — `@next/bundle-analyzer` to find bloated dependencies
5. **React Profiler** — identify unnecessary re-renders in dev tools

**Interview Question: "A page has poor LCP. How do you diagnose and fix it?"**

1. Open Chrome DevTools Performance panel, run a Lighthouse audit
2. Identify the LCP element (usually a hero image or heading)
3. Check: Is the image lazy-loaded? (It shouldn't be if it's above the fold.) Is the font blocking render? Are there render-blocking scripts?
4. Fix: preload the LCP image, use `next/font`, defer non-critical JS, check server response time
5. Measure again. Compare before/after.

---

### Forms and Mutations (Server Actions)

Server Actions are async functions that run on the server, callable directly from client components. They replace the need for API routes for mutations.

```tsx
// app/actions.ts
"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createProject(formData: FormData) {
  const name = formData.get("name") as string

  // Validate
  if (!name || name.length < 3) {
    return { error: "Name must be at least 3 characters" }
  }

  // Mutate
  await db.insert("projects", { name, createdAt: new Date() })

  // Revalidate cached data
  revalidatePath("/projects")

  // Redirect
  redirect("/projects")
}
```

**Optimistic updates pattern:**

```tsx
"use client"

import { useOptimistic, useTransition } from "react"
import { toggleLike } from "./actions"

function LikeButton({ postId, initialLiked }: { postId: string; initialLiked: boolean }) {
  const [optimisticLiked, setOptimisticLiked] = useOptimistic(initialLiked)
  const [isPending, startTransition] = useTransition()

  return (
    <button
      onClick={() => {
        startTransition(async () => {
          setOptimisticLiked(!optimisticLiked)
          await toggleLike(postId)
        })
      }}
    >
      {optimisticLiked ? "Unlike" : "Like"}
    </button>
  )
}
```

> **Purbayan's Angle:** "At fiddle, I implemented server actions for component CRUD operations. The pattern of optimistic updates with revalidation was essential for making the UI feel responsive while keeping the server as the source of truth."

---

## Systems Programming (Purbayan's Unique Edge)

This section is your differentiator. Most frontend candidates can't talk about TCP internals, FFT implementations, or memory management. You can.

### TCP/IP Networking

**How TCP works:**

1. **Three-way handshake:** Client sends SYN, server responds SYN-ACK, client sends ACK. Connection established.
2. **Data transfer:** Segments are sent with sequence numbers. Receiver acknowledges with ACK. Lost segments are retransmitted.
3. **Flow control:** Receiver advertises a window size (how much data it can buffer). Sender doesn't exceed this.
4. **Congestion control:** Slow start, congestion avoidance, fast retransmit. The sender probes network capacity and backs off when it detects congestion.

**Interview Question: "You built a TCP chat server (4at). Walk me through the architecture."**

"4at is a TCP chat server written in Rust. Each client connection spawns an async task using Tokio. Messages are broadcast to all connected clients through a shared channel (`tokio::sync::broadcast`). I implemented rate limiting per client to prevent spam. The key challenge was managing shared state (the list of connected clients) safely across concurrent tasks. Rust's ownership system, combined with `Arc<Mutex<>>`, made data races a compile-time error rather than a runtime bug."

> **Purbayan's Angle:** Lead with this in system design rounds. "I didn't just use WebSockets through a library. I built a TCP server from scratch, handling connection lifecycle, message framing, and concurrent client management. That gives me a deep understanding of what's happening under the abstraction."

---

### Concurrency Models

**OS Threads:**

- Managed by the kernel, preemptively scheduled
- Heavy (1-8 MB stack per thread), expensive context switches
- Good for CPU-bound work, limited scalability for I/O

**Green Threads / Async Tasks (Rust's Tokio, Go's goroutines):**

- Managed by the runtime, cooperatively scheduled
- Lightweight (few KB per task), cheap to spawn thousands
- Perfect for I/O-bound work (servers, network clients)

**Rust's approach:** `async/await` with Tokio. No garbage collector. Ownership + `Arc<Mutex<T>>` for shared state. The compiler prevents data races at compile time.

```rust
use tokio::sync::Mutex;
use std::sync::Arc;

let shared_state = Arc::new(Mutex::new(Vec::new()));

let state = shared_state.clone();
tokio::spawn(async move {
    let mut data = state.lock().await;
    data.push("hello");
});
```

**Go's approach:** Goroutines + channels. "Don't communicate by sharing memory; share memory by communicating."

```go
ch := make(chan string)

go func() {
    ch <- "hello" // send
}()

msg := <-ch // receive
```

**Interview Question: "When would you choose Rust over Go for a concurrent system?"**

Rust when you need: zero-cost abstractions, no GC pauses, compile-time safety guarantees, maximum performance (game servers, embedded systems, real-time audio). Go when you need: fast development, simpler concurrency model, large standard library, quick prototyping of network services.

---

### FFT & DSP Basics

**What FFT does:** Transforms a signal from the time domain to the frequency domain. Given audio samples over time, FFT tells you which frequencies are present and their amplitudes.

**The math (simplified):** The Discrete Fourier Transform (DFT) computes N frequency bins from N time samples. Naive DFT is O(N^2). The Fast Fourier Transform (Cooley-Tukey algorithm) exploits symmetry in the computation using "butterfly operations" to achieve O(N log N).

**Butterfly operation:** At each stage, pairs of values are combined using complex multiplication and addition/subtraction. The "twiddle factors" (complex roots of unity) rotate the values in the complex plane.

**Interview Question: "Tell me about your musializer project."**

"Musializer is a music visualizer I built from scratch. I implemented the FFT algorithm in C, not using a library. The program reads audio samples, applies a windowing function (Hann window to reduce spectral leakage), runs FFT to get frequency magnitudes, and renders them as a real-time visualization. The key insight was understanding that FFT output bins map to frequency ranges: bin k corresponds to frequency k \* sampleRate / N. I used logarithmic scaling for the display because human hearing is logarithmic."

> **Purbayan's Angle:** This project demonstrates you can go from mathematical theory to working implementation. Very few candidates can say "I implemented FFT from the math." Use it to show depth.

---

### Search Algorithms (TF-IDF & Inverted Index)

**TF-IDF (Term Frequency - Inverse Document Frequency):**

- **TF:** How often a term appears in a document. More occurrences = more relevant.
- **IDF:** How rare a term is across all documents. Rare terms are more discriminating than common ones.
- **TF-IDF = TF \* IDF.** A term that appears frequently in one document but rarely across the corpus gets a high score.

**Inverted Index:** Maps each term to the list of documents containing it. Instead of scanning every document for a query term, you look up the term and instantly get all matching documents.

```
"rust"    → [doc3, doc7, doc15]
"async"   → [doc3, doc7, doc22, doc41]
"tokio"   → [doc7, doc15]

Query "rust async" → intersection of [doc3, doc7, doc15] and [doc3, doc7, doc22, doc41] → [doc3, doc7]
```

**Tokenization:** Breaking text into searchable terms. Involves lowercasing, removing punctuation, stemming ("running" -> "run"), and removing stop words ("the", "is", "at").

**Interview Question: "Walk me through your seroost search engine."**

"Seroost is a local search engine I built from scratch. It indexes files on disk by tokenizing their content, building an inverted index, and computing TF-IDF scores. When you search, it looks up each query term in the inverted index, computes relevance scores, and returns ranked results. I built it to understand how search actually works under the hood, not just how to call Elasticsearch."

---

### Memory Management

**Stack vs Heap:**

|            | Stack                          | Heap                                        |
| ---------- | ------------------------------ | ------------------------------------------- |
| Allocation | Automatic, LIFO                | Manual or GC-managed                        |
| Speed      | Very fast (pointer bump)       | Slower (fragmentation, allocation strategy) |
| Size       | Fixed per thread (1-8 MB)      | Limited by system memory                    |
| Lifetime   | Tied to function scope         | Arbitrary                                   |
| Data       | Local variables, function args | Dynamic data, objects, strings              |

**Rust's ownership model:**

```rust
fn main() {
    let s1 = String::from("hello"); // s1 owns the String
    let s2 = s1;                     // ownership MOVES to s2, s1 is invalid
    // println!("{}", s1);           // compile error: s1 was moved

    let s3 = s2.clone();            // explicit deep copy
    println!("{} {}", s2, s3);      // both valid
}
```

**Borrowing:** References that don't take ownership. Rules: you can have either one mutable reference OR any number of immutable references, but not both simultaneously.

```rust
fn calculate_length(s: &String) -> usize {  // borrows, doesn't own
    s.len()
}  // s goes out of scope, but since it doesn't own the String, nothing is dropped
```

**Lifetimes:** Tell the compiler how long references are valid. Prevent dangling references at compile time.

```rust
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}
// The returned reference lives at least as long as the shorter of x and y
```

**C's manual management:** `malloc`/`free`. Full control, full responsibility. Use-after-free, double-free, and memory leaks are your problem.

**Go's garbage collection:** Concurrent, tri-color mark-and-sweep. Low-latency pauses (sub-millisecond in Go 1.22+). You don't manage memory, but you pay for GC pauses.

> **Purbayan's Angle:** "I've worked across the memory management spectrum. C for musializer (manual malloc/free), Rust for 4at (ownership/borrowing), Go for DSA practice (GC). Each model has tradeoffs. Rust's ownership is the sweet spot for systems programming: zero-cost safety."

---

### Concurrency Safety

**Race condition:** Two threads access shared data, at least one writes, and there's no synchronization. The result depends on timing.

**Deadlock:** Thread A holds lock 1 and waits for lock 2. Thread B holds lock 2 and waits for lock 1. Neither can proceed.

**Rust's compile-time prevention:**

```rust
use std::sync::{Arc, Mutex, RwLock};

// Mutex — exclusive access
let data = Arc::new(Mutex::new(vec![1, 2, 3]));
{
    let mut guard = data.lock().unwrap();
    guard.push(4); // only one thread can access at a time
} // lock released when guard is dropped

// RwLock — multiple readers OR one writer
let data = Arc::new(RwLock::new(vec![1, 2, 3]));
{
    let read_guard = data.read().unwrap(); // multiple readers OK
    println!("{:?}", *read_guard);
}
{
    let mut write_guard = data.write().unwrap(); // exclusive write
    write_guard.push(4);
}
```

Rust's type system ensures you can't accidentally share mutable data across threads. `Send` and `Sync` traits are automatically derived (or not) based on the type's contents. If a type isn't `Send`, you literally can't send it to another thread.

---

## Databases & Backend

### SQL vs NoSQL

**SQL (PostgreSQL, MySQL):**

- Structured data with relationships
- ACID transactions
- Complex queries with JOINs
- Schema enforced at the database level
- Best for: financial data, user accounts, anything with relationships

**NoSQL (MongoDB, Redis, DynamoDB):**

- Flexible schema, document/key-value/graph models
- Horizontal scaling is more natural
- Eventually consistent (by default, though many offer strong consistency options)
- Best for: high-write throughput, unstructured data, caching, real-time analytics

**Interview Question: "When would you choose NoSQL over SQL?"**

When your data is naturally document-shaped (CMS content, user profiles with varying fields), when you need massive horizontal scale with simple access patterns, or when schema flexibility is more important than relational integrity. But don't reach for NoSQL just because "it scales." PostgreSQL with proper indexing handles millions of rows without breaking a sweat.

> **Purbayan's Angle:** "I use PostgreSQL through Supabase for most projects because relational data with Row Level Security covers 90% of use cases. I've also used MongoDB when the data was genuinely document-shaped. The choice should be driven by data access patterns, not hype."

---

### ACID Properties

- **Atomicity:** A transaction either fully completes or fully rolls back. No partial updates.
- **Consistency:** A transaction brings the database from one valid state to another. Constraints are always satisfied.
- **Isolation:** Concurrent transactions don't interfere with each other. Isolation levels control the tradeoff between correctness and performance.
- **Durability:** Once committed, data survives crashes (written to disk/WAL).

**Transaction Isolation Levels:**

| Level            | Dirty Read | Non-repeatable Read | Phantom Read |
| ---------------- | ---------- | ------------------- | ------------ |
| Read Uncommitted | Possible   | Possible            | Possible     |
| Read Committed   | No         | Possible            | Possible     |
| Repeatable Read  | No         | No                  | Possible     |
| Serializable     | No         | No                  | No           |

PostgreSQL defaults to Read Committed. Serializable is safest but slowest.

---

### Indexing

**B-tree index** (default in PostgreSQL): Balanced tree structure. O(log N) lookups. Good for equality and range queries. Supports ordering.

**Hash index:** O(1) lookups for equality only. No range queries, no ordering.

**Composite index:** Index on multiple columns. Column order matters. An index on `(last_name, first_name)` helps queries filtering by `last_name` alone or `last_name + first_name`, but NOT `first_name` alone.

**When indexes hurt:**

- Write-heavy tables (every INSERT/UPDATE/DELETE must update the index)
- Low-cardinality columns (boolean, status with 3 values)
- Small tables (sequential scan is faster than index lookup)

**EXPLAIN ANALYZE:**

```sql
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'purbayan@example.com';

-- Look for:
-- Seq Scan (bad for large tables — missing index)
-- Index Scan (good — using the index)
-- Actual time vs estimated time
-- Rows removed by filter (high number = bad selectivity)
```

---

### PostgreSQL + Supabase Specifics

**Row Level Security (RLS):**

```sql
-- Enable RLS on a table
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Users can only see their own posts
CREATE POLICY "Users see own posts" ON posts
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only insert posts as themselves
CREATE POLICY "Users insert own posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

**Real-time subscriptions:**

```typescript
const channel = supabase
  .channel("posts")
  .on(
    "postgres_changes",
    {
      event: "INSERT",
      schema: "public",
      table: "posts",
    },
    (payload) => {
      console.log("New post:", payload.new)
    },
  )
  .subscribe()
```

**Edge Functions:** Deno-based serverless functions deployed to Supabase's edge network. Good for webhooks, custom auth logic, and third-party API integration.

---

### REST vs GraphQL

**REST:**

- Resource-based URLs (`/users/123/posts`)
- Multiple endpoints, each returns a fixed shape
- Over-fetching (get all user fields when you only need name) and under-fetching (need user + posts = 2 requests)
- Simple, cacheable (HTTP caching works naturally)

**GraphQL:**

- Single endpoint, client specifies exactly what data it needs
- No over-fetching or under-fetching
- More complex server implementation, harder to cache
- N+1 query problem without DataLoader

**Interview Question: "When would you choose REST over GraphQL?"**

REST when: simple CRUD, public APIs (easier for consumers), strong caching needs, team is small. GraphQL when: complex data relationships, mobile clients with bandwidth constraints, multiple frontend clients needing different data shapes.

---

### Authentication

**JWT (JSON Web Tokens):**

- Stateless: server doesn't store session data
- Token contains claims (user ID, roles, expiry)
- Signed (HMAC or RSA), optionally encrypted
- Risk: can't revoke individual tokens without a blocklist

**Session-based:**

- Server stores session data, client gets a session ID cookie
- Easy to revoke (delete server-side session)
- Requires server-side storage (Redis, database)

**PKCE (Proof Key for Code Exchange):**

Used in OAuth 2.0 for public clients (SPAs, mobile apps) where you can't safely store a client secret.

1. Client generates a random `code_verifier` and its SHA-256 hash (`code_challenge`)
2. Client sends `code_challenge` with the authorization request
3. Auth server returns an authorization code
4. Client exchanges the code + original `code_verifier` for tokens
5. Auth server verifies the verifier matches the challenge

> **Purbayan's Angle:** "I implemented PKCE-based authentication at fiddle using Better Auth. Understanding the flow at the protocol level, not just calling a library function, helped me debug token refresh issues and implement proper session management."

---

### API Design

**Rate Limiting:**

```
Token bucket algorithm:
- Bucket holds N tokens, refills at rate R per second
- Each request consumes one token
- If bucket is empty, request is rejected (429 Too Many Requests)
```

**Pagination patterns:**

- **Offset-based:** `?page=3&limit=20`. Simple but slow for large offsets (DB must skip rows).
- **Cursor-based:** `?cursor=abc123&limit=20`. Uses an opaque cursor (usually encoded ID or timestamp). Consistent performance regardless of position.

**Caching strategies:**

- **Cache-Aside:** App checks cache first, falls back to DB, populates cache on miss
- **Write-Through:** App writes to cache and DB simultaneously
- **Write-Behind:** App writes to cache, cache asynchronously writes to DB (risky but fast)
- **TTL (Time-To-Live):** Cache entries expire after a set duration

> **Purbayan's Angle:** "I built rate limiting into 4at's TCP server to prevent message spam. The token bucket algorithm was a natural fit because it allows bursts while enforcing an average rate."

---

## System Design (Interview Round Prep)

### The Framework

> 🎯 **Interview Tip:** When asked about system design, start with requirements clarification before jumping to architecture. Spend 2-3 minutes here.

Every system design answer should follow this structure:

1. **Clarify requirements** (2-3 min)
   - Functional: What does the system do?
   - Non-functional: Scale, latency, availability, consistency
   - Ask: "How many users? Read-heavy or write-heavy? What's the acceptable latency?"

2. **Estimate scale** (2-3 min)
   - Users, requests/second, storage needs
   - Back-of-envelope math: 1M users, 10% daily active, 5 requests/user = 500K requests/day = ~6 req/sec average, ~60 req/sec peak

3. **High-level design** (10 min)
   - Draw the main components: clients, load balancer, app servers, database, cache, message queue
   - Show data flow for the primary use case

4. **Deep dive** (15-20 min)
   - Pick 2-3 components and go deep
   - Database schema, API design, caching strategy, real-time updates

5. **Tradeoffs and alternatives** (5 min)
   - What breaks at 10x scale? 100x?
   - What would you change if consistency mattered more than availability (or vice versa)?

---

### Design a Real-Time Collaborative Drawing Tool

_Connect to: Canvas Kit + fiddle experience with tldraw_

**Requirements:**

- Multiple users draw on the same canvas simultaneously
- Changes appear in real-time (< 100ms latency)
- Support undo/redo per user
- Handle offline mode and reconnection

**High-level architecture:**

- **Client:** Canvas rendering (tldraw/fabric.js), local state, operation queue
- **WebSocket server:** Broadcasts operations to all connected clients
- **CRDT or OT engine:** Conflict resolution for concurrent edits
- **Persistence layer:** Store document state, operation log

**Key decisions:**

- **CRDTs vs Operational Transform:** CRDTs (Conflict-free Replicated Data Types) are simpler for distributed systems. Each operation is commutative and idempotent. No central server needed for conflict resolution. OT requires a central server to transform operations but is more established (Google Docs uses it).
- **Operation granularity:** Send individual strokes? Or batch operations? Batching reduces network traffic but increases latency.
- **State persistence:** Store the full canvas state periodically (snapshots) + operation log for replay. Compact the log periodically.

> **Purbayan's Angle:** "I worked with tldraw at fiddle for component previews. I understand the canvas rendering pipeline, the shape model, and how tldraw handles collaborative editing internally. I'd build on that experience."

---

### Design a Chat System

_Connect to: 4at TCP server_

**Requirements:**

- 1:1 and group messaging
- Message delivery guarantees (at-least-once)
- Online/offline status
- Message history and search

**Architecture:**

- **Connection layer:** WebSocket servers behind a load balancer. Each server maintains connections for a subset of users.
- **Message routing:** When User A sends a message to User B, the system must find which WebSocket server User B is connected to. Use a presence service (Redis) mapping user IDs to server IDs.
- **Message queue:** Kafka or similar for durability. Messages are persisted before delivery confirmation.
- **Storage:** Messages in PostgreSQL (or Cassandra for massive scale). Indexed by conversation ID + timestamp.
- **Push notifications:** For offline users, queue messages and send push notifications.

**Scaling considerations:**

- At 4at scale (dozens of users): single server, in-memory state, broadcast channel
- At WhatsApp scale (billions of messages/day): sharded message storage, multiple WebSocket server clusters, regional deployment

> **Purbayan's Angle:** "I built 4at as a TCP chat server in Rust. Scaling it up means replacing the single-server broadcast with a distributed pub/sub system, adding message persistence, and handling the connection routing problem. The core concepts (message framing, connection lifecycle, concurrent client handling) are the same."

---

### Design a Local Search Engine

_Connect to: seroost_

**Requirements:**

- Index local files (code, documents, notes)
- Sub-second search results
- Ranked by relevance
- Incremental indexing (don't re-index everything on file change)

**Architecture:**

- **Crawler:** File system watcher (inotify on Linux, FSEvents on macOS) detects changes. New/modified files are queued for indexing.
- **Tokenizer:** Language-aware tokenization. Code files need different tokenization than prose (preserve camelCase splitting, handle imports).
- **Inverted index:** Term -> list of (document ID, positions, TF-IDF score). Stored on disk with memory-mapped I/O for fast access.
- **Query engine:** Parse query, look up terms in inverted index, compute relevance scores, rank results.

**Making it distributed (interview extension):**

- Shard the index by document ID range
- Each shard handles a subset of documents
- Query coordinator fans out to all shards, merges results
- This is essentially how Elasticsearch works

> **Purbayan's Angle:** "Seroost is my local search engine built from scratch. I implemented TF-IDF scoring, inverted indexing, and tokenization. To make it distributed, I'd shard the index across nodes and add a query coordinator, similar to how Elasticsearch distributes its Lucene shards."

---

### Design a Component Preview System

_Connect to: fiddle_

**Requirements:**

- Render React components in isolated sandboxes
- Generate screenshots for component catalogs
- Support different viewport sizes and themes
- Handle component dependencies and imports

**Architecture:**

- **Sandbox runtime:** Each component renders in an iframe or a headless browser instance. Isolation prevents components from affecting each other.
- **Build pipeline:** On component upload/change, bundle the component with its dependencies (esbuild for speed). Cache bundles aggressively.
- **Screenshot service:** Headless Chromium (Puppeteer/Playwright) renders the component and captures screenshots at specified viewports.
- **Storage:** Component source in Git/database, screenshots in object storage (S3), metadata in PostgreSQL.
- **Real-time preview:** WebSocket connection pushes updates when component source changes. Hot module replacement in the sandbox.

---

### Design a URL Shortener

**Requirements:**

- Generate short URLs from long URLs
- Redirect short URL to original
- Analytics (click count, referrer, geography)
- High availability, low latency redirects

**Architecture:**

- **ID generation:** Base62 encoding of an auto-incrementing ID or a hash. 7 characters of base62 = 62^7 = 3.5 trillion unique URLs.
- **Storage:** Key-value store (Redis for hot data, PostgreSQL for persistence). Short code -> long URL mapping.
- **Redirect flow:** DNS -> Load Balancer -> App Server -> Cache lookup (Redis) -> 301/302 redirect. Cache hit rate should be > 99%.
- **Analytics:** Log clicks to Kafka, process asynchronously. Don't slow down the redirect path.

**Key decision: 301 vs 302 redirect?**

- 301 (permanent): Browser caches the redirect. Faster for users, but you lose analytics on repeat visits.
- 302 (temporary): Browser always hits your server. Slower, but you capture every click.

---

### Design a Real-Time Notification System

**Requirements:**

- Push notifications to web and mobile clients
- Support different notification types (mention, like, system alert)
- User preferences (mute, digest mode)
- Delivery guarantees

**Architecture:**

- **Event producers:** Services emit events (user mentioned, post liked) to a message queue (Kafka).
- **Notification service:** Consumes events, applies user preferences (is this notification type enabled? is the user in "do not disturb"?), and routes to delivery channels.
- **Delivery channels:** WebSocket for real-time web, FCM/APNs for mobile push, email for digest.
- **Storage:** Notification inbox in PostgreSQL. Read/unread status. Paginated retrieval.
- **Fan-out:** For events affecting many users (system announcement), use fan-out-on-write (pre-compute each user's notification) for small audiences, fan-out-on-read (compute at read time) for large audiences.

---

## AI Integration & Modern Development

### How to Use AI in Development

AI is a coding partner, not a replacement. The best developers in 2026 use AI to:

- **Scaffold boilerplate** — "Generate a Zustand store for managing editor state with these actions..."
- **Explore unfamiliar APIs** — "How does tldraw's `createShapeId` work? Show me examples."
- **Debug** — "Here's the error and the relevant code. What's wrong?"
- **Write tests** — "Generate test cases for this function, including edge cases."
- **Refactor** — "Simplify this function while preserving behavior."

What AI is NOT good at:

- Architectural decisions (it doesn't know your constraints)
- Performance optimization (it can't profile your app)
- Security review (it misses context-dependent vulnerabilities)
- Understanding your business domain

---

### How to Verify AI Output

1. **Read every line.** Don't copy-paste blindly. Understand what the code does.
2. **Run the tests.** If there are no tests, write them first.
3. **Check for hallucinated APIs.** AI invents function signatures that don't exist.
4. **Profile performance.** AI-generated code often works but isn't optimal.
5. **Review security.** Check for SQL injection, XSS, exposed secrets, improper auth checks.

---

### LLM API Integration

```typescript
// Streaming response from Claude API
import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic()

async function streamResponse(prompt: string) {
  const stream = await client.messages.stream({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  })

  for await (const event of stream) {
    if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
      process.stdout.write(event.delta.text)
    }
  }
}
```

**Key considerations:**

- **Streaming** for better UX (show tokens as they arrive)
- **Prompt engineering:** Be specific, provide examples, set constraints
- **Error handling:** Rate limits, timeouts, malformed responses
- **Cost management:** Token counting, caching repeated queries, choosing the right model size

> **Purbayan's Angle:** "At fiddle, I worked with Claude API health checks and monitoring. I understand the operational side of LLM integration: latency budgets, error rates, fallback strategies."

---

### When AI Fails

**Hallucinations:** AI confidently generates code using APIs that don't exist, or cites documentation that was never written. Always verify against official docs.

**Security blind spots:** AI-generated code might:

- Use `eval()` or `dangerouslySetInnerHTML` without sanitization
- Store secrets in client-side code
- Skip input validation
- Use deprecated, vulnerable dependencies

**Over-reliance trap:** If you can't write the code without AI, you can't debug it when AI gets it wrong. Maintain your fundamentals.

---

### Interview Question: "How do you use AI tools in your workflow?"

**Model answer for Purbayan:**

"I use AI as an accelerator, not a crutch. For scaffolding, I'll describe the component structure I want and let AI generate the boilerplate, then I review and adjust. For debugging, I'll paste the error with context and use AI to narrow down the cause, but I always verify the fix myself.

Where I draw the line: I don't let AI make architectural decisions. When I built seroost, I implemented TF-IDF from the math, not from an AI-generated snippet, because I needed to understand the algorithm deeply enough to optimize it. Same with the FFT in musializer.

The skill isn't using AI. Everyone can do that. The skill is knowing when AI output is wrong, knowing when to go deeper than what AI suggests, and maintaining the fundamentals so you can work without it when needed."

---

## Behavioral Questions (STAR Method)

For each question: **Situation**, **Task**, **Action**, **Result**.

### "Tell me about a challenging bug you fixed."

**Situation:** At fiddle, the canvas component (built with tldraw) would intermittently fail to load. Users would see a blank white area instead of the component preview.

**Task:** Identify and fix the root cause. The bug was intermittent, which made it harder to reproduce.

**Action:** I traced the issue to a race condition between tldraw's lifecycle initialization and React Query's cache invalidation. When the component mounted, tldraw needed the editor instance to be fully initialized before receiving shape data. But React Query would sometimes return cached data before tldraw was ready, and other times it would fetch fresh data (slower), giving tldraw time to initialize. The fix was sequencing the initialization: wait for tldraw's `onMount` callback before feeding it data from React Query.

**Result:** The canvas loading became 100% reliable. I also added a loading skeleton so users saw feedback during initialization instead of a blank area.

---

### "Describe a time you had to learn something quickly."

**Situation:** At fiddle, the team decided to migrate the component preview canvas from react-flow to tldraw. I had no experience with tldraw.

**Task:** Get up to speed on tldraw's API, data model, and rendering pipeline quickly enough to implement the migration.

**Action:** I read tldraw's source code (it's open source), built small prototypes to understand the shape system and camera controls, and documented the key differences from react-flow. Within a week, I had a working prototype of the component preview using tldraw's custom shape API.

**Result:** The migration shipped successfully. The tldraw-based canvas was more performant and gave us features (infinite canvas, built-in collaboration support) that react-flow couldn't provide.

---

### "How do you handle working with unfamiliar codebases?"

**Situation:** When I joined fiddle-factory, I had to understand six interconnected repositories: the main app, the component library, the canvas engine, the API layer, the CLI tool, and the documentation site.

**Task:** Become productive without slowing down the team with constant questions.

**Action:** I started by reading the README and architecture docs (where they existed). Then I traced the data flow for one complete user journey: "user creates a component" from the UI click through the API to the database and back. I took notes on each repo's responsibility and the interfaces between them. I asked targeted questions only after I'd done my own investigation.

**Result:** Within two weeks, I was shipping PRs across multiple repos. The approach of tracing a single user journey end-to-end gave me a mental model of the whole system faster than trying to understand each repo in isolation.

---

### "Tell me about a project you're proud of."

**Option A: musializer**

"I built a music visualizer in C where I implemented the Fast Fourier Transform from the mathematical definition. Not from a library, not from a tutorial. I read the math, understood the butterfly operations, and wrote the code. The program reads audio samples, applies windowing, runs FFT, and renders a real-time frequency visualization. I'm proud of it because it proves I can go from theory to implementation, which is rare in web development."

**Option B: seroost**

"I built a local search engine from scratch. TF-IDF scoring, inverted indexing, tokenization. All implemented by hand. It indexes files on your machine and returns ranked search results in milliseconds. I'm proud of it because search is one of those things everyone uses but few people understand at the implementation level."

---

### "How do you prioritize between competing tasks?"

**Situation:** At fiddle, I often had multiple PRs in review, new feature requests, and bug reports landing simultaneously.

**Task:** Ship the most impactful work without letting anything fall through the cracks.

**Action:** I prioritized by impact and urgency. Production bugs first (users are affected now). Then PR reviews (unblocking teammates). Then feature work (important but not urgent). I communicated my priorities in standup so the team knew what to expect. When I couldn't do everything, I said so explicitly rather than silently dropping tasks.

**Result:** Consistent delivery without burnout. The team could predict my output, which made planning easier.

---

### "Describe how you handle disagreements in code review."

**Situation:** I contributed to Apache ECharts (open source charting library). My PR changed the tooltip positioning logic, and a maintainer disagreed with my approach.

**Task:** Resolve the disagreement constructively and get the PR merged.

**Action:** I re-read their feedback carefully. They had a valid point about edge cases I hadn't considered. Instead of defending my original approach, I acknowledged the gap, proposed a revised solution that addressed their concern, and explained my reasoning with code examples. I also added test cases for the edge cases they identified.

**Result:** The PR was merged after the revision. The maintainer thanked me for being receptive to feedback. Open source taught me that code review disagreements are about the code, not about ego.

---

### "Why are you switching from Mechanical Engineering to Software?"

"I'm not switching away from engineering. I'm switching to a different kind of engineering. The curiosity that drove me to study mechanical systems is the same curiosity that drives me to build software.

The difference is that in software, I can go from idea to working prototype in hours, not months. I can build things that people actually use. And the depth is unlimited. I've built a TCP server, implemented FFT from math, created a search engine from scratch, and shipped production features at a startup. None of that required a CS degree. It required curiosity and the willingness to go deep.

My engineering background isn't a weakness. It's why I think in systems, why I measure before optimizing, and why I approach problems with rigor instead of guesswork."

---

## Coding Round Prep Strategy

### Approach

Purbayan has a Go DSA repository with fundamental implementations. The goal isn't to memorize solutions but to recognize patterns.

### Focus Areas (by frequency in interviews)

1. **Arrays & Strings** — Two pointers, sliding window, prefix sums, hash maps
2. **Trees & Graphs** — BFS, DFS, binary search trees, topological sort
3. **Dynamic Programming** — Memoization, tabulation, common patterns (knapsack, LCS, coin change)
4. **Sliding Window** — Fixed and variable size, with hash maps for character counting
5. **Stack & Queue** — Monotonic stack, BFS with queue, parentheses matching

### Language Choice

- **TypeScript** for web-focused roles. Interviewers expect it. Type annotations show rigor.
- **Go** for backend/infrastructure roles. Clean syntax, fast execution, good standard library.
- **Rust** only if specifically asked or if the role is systems-focused. The borrow checker can slow you down in a timed interview.

### Time Management (45-minute round)

| Phase      | Time     | What to Do                                                                                            |
| ---------- | -------- | ----------------------------------------------------------------------------------------------------- |
| Understand | 5 min    | Read the problem. Ask clarifying questions. Confirm input/output with examples.                       |
| Approach   | 5 min    | Think out loud. Describe your approach before coding. Mention time/space complexity.                  |
| Code       | 20 min   | Write clean code. Use meaningful variable names. Handle edge cases.                                   |
| Test       | 5 min    | Trace through your code with the examples. Test edge cases (empty input, single element, duplicates). |
| Optimize   | 5-10 min | If time permits, discuss optimizations. Can you reduce space? Time?                                   |

### Communication During Coding

This is as important as the code itself:

- **Think out loud.** "I'm considering a hash map here because we need O(1) lookups..."
- **Explain tradeoffs.** "I could sort first for O(n log n) or use a hash map for O(n) with O(n) space."
- **Acknowledge when you're stuck.** "I'm not sure about this edge case. Let me think about what happens when the array is empty."
- **Ask for hints gracefully.** "I'm considering two approaches. Could you point me toward which direction you'd prefer?"

### Common Patterns to Internalize

**Two Pointers:**

```typescript
function twoSum(nums: number[], target: number): [number, number] {
  // Assumes sorted array
  let left = 0,
    right = nums.length - 1
  while (left < right) {
    const sum = nums[left] + nums[right]
    if (sum === target) return [left, right]
    if (sum < target) left++
    else right--
  }
  return [-1, -1]
}
```

**Sliding Window:**

```typescript
function maxSubarraySum(nums: number[], k: number): number {
  let windowSum = 0
  for (let i = 0; i < k; i++) windowSum += nums[i]

  let maxSum = windowSum
  for (let i = k; i < nums.length; i++) {
    windowSum += nums[i] - nums[i - k] // slide the window
    maxSum = Math.max(maxSum, windowSum)
  }
  return maxSum
}
```

**BFS (Graph/Tree):**

```typescript
function bfs(graph: Map<string, string[]>, start: string): string[] {
  const visited = new Set<string>()
  const queue: string[] = [start]
  const result: string[] = []

  visited.add(start)
  while (queue.length > 0) {
    const node = queue.shift()!
    result.push(node)
    for (const neighbor of graph.get(node) || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor)
        queue.push(neighbor)
      }
    }
  }
  return result
}
```

**Dynamic Programming (Memoization):**

```typescript
function climbStairs(n: number, memo: Map<number, number> = new Map()): number {
  if (n <= 2) return n
  if (memo.has(n)) return memo.get(n)!

  const result = climbStairs(n - 1, memo) + climbStairs(n - 2, memo)
  memo.set(n, result)
  return result
}
```

---

_Last updated: February 2026. Review and update quarterly as the landscape evolves._
