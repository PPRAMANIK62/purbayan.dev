# Shopflo Frontend Interview Preparation

_Tailored for Purbayan Pramanik. React, TypeScript, Next.js, Vite, performance optimization, browser internals. Targeting Shopflo's frontend engineering role._

---

## About Shopflo: Company Intel

Shopflo is a checkout optimization platform for D2C e-commerce brands in India. Founded in 2021, based in Bengaluru, team of 11-50 people. Their core thesis: checkout is where revenue lives or dies, and most D2C brands have terrible checkout experiences.

### Products

| Product         | What It Does                                           |
| --------------- | ------------------------------------------------------ |
| Checkout        | One-click optimized checkout flow for D2C stores       |
| Cart            | Smart cart with upsells, cross-sells, gamification     |
| Shop Pass       | 100M+ consumer identity network for instant checkout   |
| Identity        | Passwordless login, OTP, saved addresses               |
| Analytics       | Funnel analytics, drop-off tracking, A/B testing       |
| Payments        | Multi-gateway orchestration, COD to prepaid conversion |
| Discount Engine | Stackable coupons, BOGO, tiered discounts              |
| Upsell          | Post-purchase and in-cart upsell widgets               |
| Design Elements | Brand-customizable UI components for checkout          |

### Who Uses It

Trusted by 1000+ D2C brands: Dot & Key, Traya Health, The Sleep Company, Sleepy Owl, Vahdam, YogaBar, BlissClub. The product serves 50M+ annual users across these brands.

### Tech Stack (from employee LinkedIn profiles and job listings)

| Layer           | Technologies                                                     |
| --------------- | ---------------------------------------------------------------- |
| Frontend        | React 18, TypeScript, Next.js 14, Vite                           |
| Architecture    | Module Federation (microfrontends)                               |
| Build           | Migrated from Webpack to Vite                                    |
| Performance     | LCP optimized from 2.5s to 1.5s, bundle size from 247KB to 100KB |
| Testing         | Jest, Mocha                                                      |
| Version Control | Git                                                              |

### What Their Job Listing Says

- 2+ years React experience
- Deep JavaScript, CSS, HTML knowledge
- Browser internals understanding
- Network stack understanding
- Next.js experience
- Jest/Mocha testing
- Key responsibility: "Own and build next-generation web applications with efficient, reusable front-end abstractions"

### Why This Matters for Your Prep

Shopflo is a performance company. They don't just build UIs. They obsess over milliseconds because every 100ms of checkout latency costs their brands real revenue. Their engineers think about LCP, bundle sizes, asset fetch times, and critical rendering paths daily. Your prep should reflect that.

> **Purbayan's Angle:** Small team (11-50) means high ownership and direct impact on revenue. This maps well to your fiddle-factory experience where you owned features end-to-end across 6 repos. At Shopflo, you'd likely own entire product surfaces, not just tickets.

---

## Round 1: JavaScript Basics + Coding Functions

This round tests whether you actually understand JavaScript or just use it. Shopflo's job listing explicitly calls out "deep JS knowledge" and "browser internals." They mean it.

---

### Tier 1: Must Know (Asked in Almost Every Interview)

---

#### 1. Closures

A closure is a function that remembers the variables from its lexical scope, even after that scope has finished executing. The inner function "closes over" the outer variables.

```javascript
function createCounter() {
  let count = 0
  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count,
  }
}

const counter = createCounter()
counter.increment()
counter.increment()
counter.increment()
counter.decrement()
console.log(counter.getCount()) // 2
// `count` is private — no way to access it directly
```

**Why closures matter in practice:**

1. **Encapsulation** — private state without classes. The `count` variable above can't be accessed or mutated except through the returned methods.
2. **Function factories** — `createLogger('DEBUG')` returns a function pre-configured with a log level.
3. **Callbacks and event handlers** — every `addEventListener` callback that references outer variables is a closure.
4. **Partial application** — pre-filling arguments for later use.

**The stale closure trap in React:**

```javascript
function Timer() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      // BUG: `count` is captured at 0, never updates
      console.log(count) // always logs 0
      setCount(count + 1) // always sets to 1
    }, 1000)
    return () => clearInterval(id)
  }, []) // empty deps = closure captures initial count
}
```

The `setInterval` callback closes over the initial `count` value (0). Since the dependency array is empty, the effect never re-runs, so the closure never gets a fresh `count`. The fix:

```javascript
// Fix 1: functional updater (preferred)
setCount((prev) => prev + 1)

// Fix 2: add count to deps (but interval resets every second)
useEffect(() => {
  const id = setInterval(() => {
    setCount(count + 1)
  }, 1000)
  return () => clearInterval(id)
}, [count])

// Fix 3: useRef to hold mutable value
const countRef = useRef(0)
useEffect(() => {
  const id = setInterval(() => {
    countRef.current += 1
    setCount(countRef.current)
  }, 1000)
  return () => clearInterval(id)
}, [])
```

> ⚠️ **Watch Out:** Stale closures are the #1 React debugging nightmare. Always check dependency arrays in useEffect and useCallback. If a value changes but your effect doesn't re-run, you have a stale closure.

**Interview Question: "How do closures cause memory leaks?"**

If a closure holds a reference to a large object and the closure itself is long-lived (stored in a global, an event listener that's never removed, a timer that's never cleared), the garbage collector can't reclaim that object. The fix: clean up event listeners, clear timers, and nullify references when done. Use `WeakRef` when you need a reference that doesn't prevent garbage collection.

> **Purbayan's Angle:** "I ran into stale closures when working with tldraw at fiddle. The canvas editor instance was captured in a useEffect closure, and when the component re-rendered with a new editor reference, the old closure still pointed to the stale one. Understanding closure semantics was critical for debugging that."

---

#### 2. Event Loop

The event loop is JavaScript's concurrency model. Single-threaded, but non-blocking. Understanding it separates people who write JS from people who _understand_ JS.

**How it works:**

The call stack executes synchronous code. When an async operation completes, its callback goes into a queue. Two queues matter:

- **Microtask queue** — `Promise.then()`, `queueMicrotask()`, `MutationObserver`, `await` continuations. Drained completely after each macrotask.
- **Macrotask queue** — `setTimeout`, `setInterval`, I/O callbacks, `setImmediate` (Node). One macrotask runs per tick.

The order: current call stack empties -> all microtasks drain -> one macrotask runs -> repeat.

```javascript
console.log("A") // sync — runs first
setTimeout(() => console.log("B"), 0) // macrotask queue
Promise.resolve().then(() => console.log("C")) // microtask queue
console.log("D") // sync — runs second

// Output: A, D, C, B
```

Why `A, D, C, B`? Synchronous code (`A`, `D`) runs first because it's on the call stack. Then the microtask queue drains (`C` from the resolved Promise). Then the macrotask queue runs (`B` from setTimeout, even though the delay is 0).

**Predict-the-output: nested async**

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

**Predict-the-output: microtask chaining**

```javascript
Promise.resolve()
  .then(() => {
    console.log("1")
    return Promise.resolve()
  })
  .then(() => console.log("2"))

Promise.resolve()
  .then(() => console.log("3"))
  .then(() => console.log("4"))

// Output: 1, 3, 2, 4
```

Both promise chains start in the same microtask tick. First `.then` of chain 1 logs "1" and returns a new Promise. First `.then` of chain 2 logs "3". Now the second `.then` of chain 1 logs "2" (the returned Promise resolved). Then chain 2's second `.then` logs "4".

> 🎯 **Interview Tip:** Always trace through async code execution step by step. Draw the call stack, microtask queue, and macrotask queue on paper. Interviewers want to see you reason about timing, not memorize output.

> **Purbayan's Angle:** "I built a TCP chat server in Rust (4at) where I had to think about event-driven I/O at the OS level with epoll/kqueue. JavaScript's event loop is a higher-level abstraction of the same concept: non-blocking I/O with an event queue. The mental model transfers directly."

---

#### 3. The `this` Keyword

`this` in JavaScript is determined by _how a function is called_, not where it's defined. Four binding rules, in order of precedence:

1. **`new` binding** — `new Foo()` creates a new object, `this` = that object
2. **Explicit binding** — `call()`, `apply()`, `bind()` set `this` explicitly
3. **Implicit binding** — `obj.method()` sets `this` = `obj`
4. **Default binding** — standalone function call, `this` = `undefined` (strict mode) or `globalThis`

**Arrow functions are different.** They don't have their own `this`. They inherit `this` from the enclosing lexical scope. They also don't have `arguments`, can't be used with `new`, and don't have a `prototype` property.

```javascript
const obj = {
  name: "Purbayan",
  greet: function () {
    return this.name
  },
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

**Class methods losing `this` when passed as callbacks:**

```javascript
class Button {
  label = "Click me"
  handleClick() {
    console.log(this.label)
  }
}

const btn = new Button()
document.addEventListener("click", btn.handleClick)
// `this` is the DOM element, not btn!
```

Three fixes:

```javascript
// Fix 1: arrow function in class field (most common in React)
class Button {
  label = "Click me"
  handleClick = () => {
    console.log(this.label) // always correct
  }
}

// Fix 2: bind in constructor
class Button {
  constructor() {
    this.handleClick = this.handleClick.bind(this)
  }
}

// Fix 3: wrap in arrow at call site
document.addEventListener("click", () => btn.handleClick())
```

> 🎯 **Interview Tip:** If asked "what is `this`?", always ask back: "How is the function being called?" The call site determines `this`, not the definition site.

---

#### 4. Promises & async/await

A Promise represents a value that may not exist yet. Three states: **pending**, **fulfilled**, **rejected**. Once settled (fulfilled or rejected), it can't change state.

**Error handling patterns:**

```javascript
// Promise chain — .catch() handles any error in the chain
fetchUser(id)
  .then((user) => fetchPosts(user.id))
  .then((posts) => render(posts))
  .catch((err) => showError(err))

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

**Implement a timeout wrapper:**

```javascript
function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), ms))
  return Promise.race([promise, timeout])
}

// Usage
const data = await withTimeout(fetch("/api/checkout"), 5000)
```

**Implement a retry wrapper:**

```javascript
async function retry(fn, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn()
    } catch (err) {
      if (i === retries - 1) throw err
      await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)))
    }
  }
}

// Usage — relevant for Shopflo's payment processing
const result = await retry(() => processPayment(orderId), 3, 2000)
```

> **Purbayan's Angle:** "At fiddle, I dealt with race conditions between React Query cache invalidation and tldraw's async initialization. The canvas loading bug for new users was fundamentally a Promise sequencing problem: tldraw's onMount fired before the data Promise resolved. Understanding Promise semantics was essential for fixing it."

---

#### 5. Debounce & Throttle

Both control how often a function fires. Critical for Shopflo's checkout UX where you don't want to fire API calls on every keystroke.

**Debounce:** Wait until the user stops doing something, then fire once.

```javascript
function debounce(fn, delay) {
  let timeoutId
  return function (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      fn.apply(this, args) // preserve `this` context
    }, delay)
  }
}

// Usage: search input in a product catalog
const searchInput = document.getElementById("search")
searchInput.addEventListener(
  "input",
  debounce(function (e) {
    // `this` is the input element because of .apply()
    fetchProducts(e.target.value)
  }, 300),
)
```

**Throttle:** Fire at most once every N milliseconds, even if the user keeps triggering.

```javascript
function throttle(fn, limit) {
  let inThrottle = false
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

// Usage: scroll handler for infinite product grid
window.addEventListener(
  "scroll",
  throttle(() => {
    checkIfNearBottom()
  }, 200),
)
```

**Why `.apply(this, args)` matters:** Without it, the `this` context inside the original function would be wrong. If the debounced function is used as an event handler, `this` should be the element. `.apply()` forwards both `this` and arguments correctly.

> 💡 **Key Insight:** Debounce is for "wait until they're done" (search input, resize handler). Throttle is for "don't fire more than X times per second" (scroll, mousemove). Shopflo likely uses both: debounce for coupon code input, throttle for scroll-based product loading.

---

#### 6. Array Polyfills

Implementing these from scratch proves you understand how JavaScript's built-in methods actually work.

**Array.prototype.map:**

```javascript
Array.prototype.myMap = function (callback, thisArg) {
  const result = []
  for (let i = 0; i < this.length; i++) {
    if (i in this) {
      // skip holes in sparse arrays
      result.push(callback.call(thisArg, this[i], i, this))
    }
  }
  return result
}

// Test
;[1, 2, 3].myMap((x) => x * 2) // [2, 4, 6]
```

**Array.prototype.filter:**

```javascript
Array.prototype.myFilter = function (callback, thisArg) {
  const result = []
  for (let i = 0; i < this.length; i++) {
    if (i in this && callback.call(thisArg, this[i], i, this)) {
      result.push(this[i])
    }
  }
  return result
}

// Test
;[1, 2, 3, 4, 5].myFilter((x) => x % 2 === 0) // [2, 4]
```

**Array.prototype.reduce:**

```javascript
Array.prototype.myReduce = function (callback, initialValue) {
  let accumulator
  let startIndex

  if (initialValue !== undefined) {
    accumulator = initialValue
    startIndex = 0
  } else {
    if (this.length === 0) throw new TypeError("Reduce of empty array with no initial value")
    accumulator = this[0]
    startIndex = 1
  }

  for (let i = startIndex; i < this.length; i++) {
    if (i in this) {
      accumulator = callback(accumulator, this[i], i, this)
    }
  }
  return accumulator
}

// Test
;[1, 2, 3, 4].myReduce((acc, val) => acc + val, 0) // 10
```

**Function.prototype.bind:**

```javascript
Function.prototype.myBind = function (context, ...boundArgs) {
  const fn = this
  return function (...callArgs) {
    return fn.apply(context, [...boundArgs, ...callArgs])
  }
}

// Test
const greet = function (greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`
}
const boundGreet = greet.myBind({ name: "Purbayan" }, "Hello")
boundGreet("!") // "Hello, Purbayan!"
```

> 🎯 **Interview Tip:** When implementing polyfills, don't forget: (1) `callback.call(thisArg, ...)` for proper `this` binding, (2) `i in this` to handle sparse arrays, (3) edge cases like empty arrays for reduce.

---

### Tier 2: Frequently Asked

---

#### Prototypal Inheritance

JavaScript doesn't have classical inheritance. Objects delegate to other objects through the prototype chain.

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

**`Object.create` vs `new`:** `Object.create(proto)` creates a new object with `proto` as its prototype. No constructor is called. `new Constructor()` creates a new object, sets its prototype to `Constructor.prototype`, calls the constructor with `this` bound to the new object, and returns it.

---

#### Destructuring & Spread

```javascript
// Nested destructuring
const {
  user: {
    name,
    address: { city },
  },
} = response

// Rest params
const { id, ...rest } = product // rest has everything except id

// Shallow copy (spread only copies one level deep)
const copy = { ...original }
copy.nested.value = "changed" // ALSO changes original.nested.value!

// Deep copy options
const deep1 = structuredClone(original) // modern, handles most types
const deep2 = JSON.parse(JSON.stringify(original)) // old way, loses functions/undefined/Date/RegExp
```

> ⚠️ **Watch Out:** Spread creates a shallow copy. For a checkout object with nested address data, `{ ...order }` won't deep-copy the address. Mutating the copy's address mutates the original. Use `structuredClone()` for deep copies.

---

#### Deep Clone

```javascript
function deepClone(obj, seen = new WeakMap()) {
  if (obj === null || typeof obj !== "object") return obj
  if (obj instanceof Date) return new Date(obj)
  if (obj instanceof RegExp) return new RegExp(obj)
  if (seen.has(obj)) return seen.get(obj) // handle circular refs

  const clone = Array.isArray(obj) ? [] : {}
  seen.set(obj, clone)

  for (const key of Object.keys(obj)) {
    clone[key] = deepClone(obj[key], seen)
  }
  return clone
}
```

Three approaches compared:

| Method                         | Circular Refs | Functions    | Date/RegExp | Performance          |
| ------------------------------ | ------------- | ------------ | ----------- | -------------------- |
| `JSON.parse(JSON.stringify())` | Throws        | Lost         | Broken      | Fast for simple data |
| `structuredClone()`            | Handles       | Throws       | Preserves   | Native, fast         |
| Recursive (above)              | Handles       | Can preserve | Preserves   | Flexible, slower     |

---

#### Event Delegation

Instead of attaching listeners to every child element, attach one listener to the parent and use `e.target` to determine which child was clicked. Essential for dynamic lists (like a product grid where items are added/removed).

```javascript
// Bad: listener on every product card
document.querySelectorAll(".product-card").forEach((card) => {
  card.addEventListener("click", handleClick)
})

// Good: one listener on the container
document.getElementById("product-grid").addEventListener("click", (e) => {
  const card = e.target.closest(".product-card")
  if (!card) return // clicked outside any card
  const productId = card.dataset.productId
  addToCart(productId)
})
```

**Why `closest()` over `matches()`:** `e.target` might be a child element inside the card (an image, a price span). `closest('.product-card')` walks up the DOM tree to find the nearest matching ancestor. `matches()` only checks the target itself.

> **Purbayan's Angle:** "At Shopflo, the product grid and cart items are dynamic. Event delegation is how you handle click handlers on elements that don't exist yet when the page loads. One listener on the container, check the target. Scales to any number of items."

---

#### Hoisting

```javascript
console.log(a) // undefined (var is hoisted AND initialized to undefined)
var a = 5

console.log(b) // ReferenceError: Cannot access 'b' before initialization
let b = 5

console.log(c) // ReferenceError
const c = 5
```

`var` declarations are hoisted to the top of their function scope and initialized to `undefined`. `let` and `const` are hoisted to the top of their block scope but NOT initialized. The gap between the start of the scope and the declaration is the **Temporal Dead Zone (TDZ)**.

---

#### == vs === (Type Coercion)

```javascript
0 == "" // true (both coerce to 0)
0 == "0" // true
"" == "0" // false (string comparison, no coercion needed)
false == "0" // true (false -> 0, "0" -> 0)
null == undefined // true (special rule)
null === undefined // false
NaN == NaN // false (NaN is not equal to anything, including itself)
```

**Rule:** Always use `===` unless you specifically want type coercion. The only acceptable use of `==` is `value == null` which checks for both `null` and `undefined` in one expression.

---

#### var / let / const

| Feature         | `var`                           | `let`        | `const`      |
| --------------- | ------------------------------- | ------------ | ------------ |
| Scope           | Function                        | Block        | Block        |
| Hoisting        | Yes, initialized to `undefined` | Yes, but TDZ | Yes, but TDZ |
| Re-declaration  | Allowed                         | Not allowed  | Not allowed  |
| Re-assignment   | Allowed                         | Allowed      | Not allowed  |
| Global property | Yes (`window.x`)                | No           | No           |

**Classic interview trap:**

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100)
}
// Output: 3, 3, 3 (var is function-scoped, all closures share the same i)

for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100)
}
// Output: 0, 1, 2 (let creates a new binding per iteration)
```

---

#### Currying

Transform a function that takes multiple arguments into a sequence of functions that each take one argument.

```javascript
// Generic curry implementation
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args)
    }
    return function (...nextArgs) {
      return curried.apply(this, [...args, ...nextArgs])
    }
  }
}

// Usage
const add = (a, b, c) => a + b + c
const curriedAdd = curry(add)
curriedAdd(1)(2)(3) // 6
curriedAdd(1, 2)(3) // 6
curriedAdd(1)(2, 3) // 6
```

---

#### Memoization

Cache the results of expensive function calls and return the cached result when the same inputs occur again.

```javascript
function memoize(fn) {
  const cache = new Map()
  return function (...args) {
    const key = JSON.stringify(args)
    if (cache.has(key)) return cache.get(key)
    const result = fn.apply(this, args)
    cache.set(key, result)
    return result
  }
}

// Usage — memoize expensive product filtering
const filterProducts = memoize((products, category, priceRange) => {
  return products
    .filter((p) => p.category === category)
    .filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])
    .sort((a, b) => b.rating - a.rating)
})
```

> 💡 **Key Insight:** `JSON.stringify` as a cache key works for primitives and simple objects but fails for functions, circular references, and objects where key order matters. For production code, consider a more robust hashing strategy.

---

### Tier 3: Good to Know

---

#### WeakMap / WeakSet

Keys must be objects. Keys are held weakly, meaning they don't prevent garbage collection. Perfect for associating metadata with DOM elements or objects without causing memory leaks.

```javascript
const metadata = new WeakMap()

function trackElement(element) {
  metadata.set(element, { clicks: 0, lastSeen: Date.now() })
}

// When the element is removed from the DOM and no other references exist,
// the WeakMap entry is automatically garbage collected.
```

#### Proxy / Reflect

Proxy lets you intercept and customize operations on objects. Useful for validation, logging, reactive systems.

```javascript
const validator = new Proxy(
  {},
  {
    set(target, prop, value) {
      if (prop === "price" && (typeof value !== "number" || value < 0)) {
        throw new Error("Price must be a non-negative number")
      }
      return Reflect.set(target, prop, value)
    },
  },
)

validator.price = 29.99 // works
validator.price = -5 // throws Error
```

#### Generators & Iterators

```javascript
function* paginate(items, pageSize) {
  for (let i = 0; i < items.length; i += pageSize) {
    yield items.slice(i, i + pageSize)
  }
}

const pages = paginate(allProducts, 20)
pages.next().value // first 20 products
pages.next().value // next 20 products
```

#### Symbol

Unique, immutable identifiers. Used for "hidden" object properties and well-known symbols like `Symbol.iterator`.

```javascript
const DISCOUNT_TYPE = Symbol("discountType")
const coupon = {
  code: "SAVE20",
  [DISCOUNT_TYPE]: "percentage", // won't collide with any string key
}
```

#### Object.freeze vs Object.seal

| Method          | Add props | Remove props | Modify existing | Nested objects       |
| --------------- | --------- | ------------ | --------------- | -------------------- |
| `Object.freeze` | No        | No           | No              | NOT frozen (shallow) |
| `Object.seal`   | No        | No           | Yes             | NOT sealed (shallow) |

---

### Shopflo-Specific Extra Topics

These aren't generic JS topics. Shopflo's job listing explicitly asks for browser internals and network stack knowledge. Their engineers optimize LCP and bundle sizes daily.

---

#### Performance Optimization (Critical for Shopflo)

**Core Web Vitals that Shopflo cares about:**

| Metric                          | What It Measures                        | Shopflo's Achievement         |
| ------------------------------- | --------------------------------------- | ----------------------------- |
| LCP (Largest Contentful Paint)  | When the main content is visible        | Optimized from 2.5s to 1.5s   |
| FID (First Input Delay)         | Time until page responds to interaction | Critical for checkout buttons |
| CLS (Cumulative Layout Shift)   | Visual stability                        | Checkout forms must not shift |
| INP (Interaction to Next Paint) | Responsiveness to all interactions      | Replaced FID in 2024          |

**Techniques Shopflo likely uses:**

```javascript
// 1. Code splitting — load checkout code only when needed
const CheckoutForm = React.lazy(() => import("./CheckoutForm"))

// 2. Image optimization — product images are the biggest LCP culprit
<img
  src={product.image}
  loading="lazy"           // defer offscreen images
  decoding="async"         // don't block main thread
  fetchpriority="high"     // for above-the-fold hero image
  width={300} height={300} // prevent CLS
/>

// 3. Preconnect to critical origins
<link rel="preconnect" href="https://api.shopflo.com" />
<link rel="preconnect" href="https://cdn.shopflo.com" />
<link rel="dns-prefetch" href="https://analytics.shopflo.com" />

// 4. Bundle analysis — they reduced 247KB to 100KB
// Tree shaking, dynamic imports, removing unused dependencies
```

---

#### Browser Internals & Critical Rendering Path

The browser turns HTML into pixels through this pipeline:

1. **Parse HTML** -> DOM tree
2. **Parse CSS** -> CSSOM tree
3. **Combine** -> Render tree (only visible elements)
4. **Layout** -> Calculate positions and sizes
5. **Paint** -> Fill in pixels
6. **Composite** -> Layer composition on GPU

**What blocks rendering:**

- CSS is render-blocking (browser won't paint until CSSOM is ready)
- Synchronous `<script>` tags block HTML parsing
- `<script defer>` downloads in parallel, executes after parsing
- `<script async>` downloads in parallel, executes immediately when ready

```html
<!-- Bad: blocks parsing -->
<script src="analytics.js"></script>

<!-- Good: doesn't block parsing, runs after DOM is ready -->
<script defer src="analytics.js"></script>

<!-- Good for independent scripts: downloads and runs ASAP -->
<script async src="analytics.js"></script>
```

**Reflow vs Repaint:**

- **Reflow** (layout): triggered by changing geometry (width, height, position, font-size). Expensive. Cascades through children.
- **Repaint**: triggered by changing appearance (color, background, visibility). Cheaper. No geometry recalculation.

```javascript
// Bad: triggers reflow on every iteration
for (const item of items) {
  element.style.width = item.width + "px" // reflow
  element.style.height = item.height + "px" // reflow again
}

// Good: batch DOM reads and writes
const fragment = document.createDocumentFragment()
for (const item of items) {
  const el = document.createElement("div")
  el.style.cssText = `width: ${item.width}px; height: ${item.height}px`
  fragment.appendChild(el)
}
container.appendChild(fragment) // single reflow
```

> **Purbayan's Angle:** "At fiddle, I worked with Canvas rendering where I had to think about compositing layers and offscreen buffers. The browser's rendering pipeline is conceptually similar: you build a tree, calculate layout, paint to buffers, then composite. My Canvas Kit project uses the same offscreen-buffer-then-composite pattern that browsers use internally."

---

#### Network Stack

**HTTP caching headers:**

| Header          | Purpose                | Example                         |
| --------------- | ---------------------- | ------------------------------- |
| `Cache-Control` | How long to cache      | `max-age=31536000, immutable`   |
| `ETag`          | Content fingerprint    | `"abc123"`                      |
| `Last-Modified` | When content changed   | `Wed, 01 Jan 2025 00:00:00 GMT` |
| `Vary`          | Cache varies by header | `Vary: Accept-Encoding`         |

**Resource hints:**

```html
<!-- DNS lookup only -->
<link rel="dns-prefetch" href="https://api.shopflo.com" />

<!-- DNS + TCP + TLS handshake -->
<link rel="preconnect" href="https://cdn.shopflo.com" />

<!-- Download this resource, I'll need it soon -->
<link rel="preload" href="/fonts/inter.woff2" as="font" crossorigin />

<!-- Download this page/resource, user will likely navigate here -->
<link rel="prefetch" href="/checkout" />
```

**CDN behavior:** Static assets (JS bundles, CSS, images) are served from edge nodes closest to the user. Content-hashed filenames (`main.a1b2c3.js`) allow aggressive caching (`max-age=31536000, immutable`). When you deploy a new version, the filename changes, so users get the new file without cache busting.

---

#### Module Systems (ESM vs CJS)

Shopflo migrated from Webpack to Vite. Understanding why matters.

| Feature         | CommonJS (CJS)                 | ES Modules (ESM)           |
| --------------- | ------------------------------ | -------------------------- |
| Syntax          | `require()` / `module.exports` | `import` / `export`        |
| Loading         | Synchronous                    | Asynchronous               |
| Tree shaking    | Not possible (dynamic)         | Possible (static analysis) |
| Top-level await | No                             | Yes                        |
| Default in      | Node.js                        | Browsers, modern Node      |

**Why Vite over Webpack:** Vite uses native ESM in development. No bundling step. The browser requests modules directly, and Vite transforms them on the fly with esbuild. This makes dev server startup nearly instant regardless of project size. Webpack bundles everything before serving, which gets slower as the project grows.

**Tree shaking:** Static `import` statements let bundlers analyze which exports are actually used and remove dead code. `require()` is dynamic (can be inside `if` blocks), so bundlers can't safely remove unused code.

```javascript
// This can be tree-shaken — bundler knows exactly what's imported
import { Button } from "./components"

// This CANNOT be tree-shaken — bundler can't analyze dynamic require
const { Button } = require("./components")
```

> 💡 **Key Insight:** Shopflo's bundle reduction from 247KB to 100KB was likely achieved through: (1) Vite migration enabling better tree shaking, (2) code splitting with dynamic imports, (3) replacing heavy libraries with lighter alternatives, (4) analyzing the bundle with tools like `rollup-plugin-visualizer`.

---

#### React 18 Specifics (Shopflo uses React 18)

**Concurrent features:**

```tsx
import { useTransition, useDeferredValue, Suspense } from "react"

function ProductSearch() {
  const [query, setQuery] = useState("")
  const [isPending, startTransition] = useTransition()
  const deferredQuery = useDeferredValue(query)

  return (
    <>
      <input
        value={query}
        onChange={(e) => {
          // Urgent: update the input immediately
          setQuery(e.target.value)
        }}
      />
      {isPending && <Spinner />}
      {/* Non-urgent: filter products with deferred value */}
      <Suspense fallback={<ProductSkeleton />}>
        <ProductList query={deferredQuery} />
      </Suspense>
    </>
  )
}
```

**`useTransition`** marks a state update as non-urgent. The UI stays responsive while the transition processes. Perfect for filtering large product lists without blocking the input.

**`useDeferredValue`** defers re-rendering with a new value until the browser is idle. Similar to debouncing but integrated with React's scheduler.

**Automatic batching in React 18:** In React 17, state updates inside `setTimeout`, `fetch.then`, and native event handlers were NOT batched. React 18 batches all state updates by default, reducing re-renders.

```javascript
// React 17: two re-renders
setTimeout(() => {
  setCount(1) // re-render
  setFlag(true) // re-render
}, 0)

// React 18: one re-render (automatic batching)
setTimeout(() => {
  setCount(1)
  setFlag(true) // batched into single re-render
}, 0)
```

---

### Practice Exercises Checklist

Code each of these from scratch without looking at references. Time yourself. If you can't write it in under 10 minutes, you need more practice.

| #   | Function                    | Key Concept                                   | Difficulty |
| --- | --------------------------- | --------------------------------------------- | ---------- |
| 1   | `debounce(fn, delay)`       | Closures, setTimeout, `this` binding          | Medium     |
| 2   | `throttle(fn, limit)`       | Closures, timing control                      | Medium     |
| 3   | `deepClone(obj)`            | Recursion, type checking, circular refs       | Hard       |
| 4   | `Array.prototype.myMap`     | Prototype, callback invocation, sparse arrays | Easy       |
| 5   | `Array.prototype.myFilter`  | Same as map with conditional push             | Easy       |
| 6   | `Array.prototype.myReduce`  | Accumulator pattern, initial value edge case  | Medium     |
| 7   | `Function.prototype.myBind` | `this` binding, partial application           | Medium     |
| 8   | `curry(fn)`                 | Recursion, `fn.length`, argument accumulation | Medium     |
| 9   | `memoize(fn)`               | Caching, key serialization                    | Medium     |
| 10  | `flatten(arr, depth)`       | Recursion, `Array.isArray`                    | Easy       |
| 11  | `pipe(...fns)`              | Function composition, reduce                  | Easy       |
| 12  | `compose(...fns)`           | Same as pipe, reversed                        | Easy       |
| 13  | `promisify(fn)`             | Callbacks to Promises                         | Medium     |
| 14  | `retry(fn, retries, delay)` | Async loops, error handling                   | Medium     |
| 15  | `EventEmitter`              | Pub/sub pattern, Map of listeners             | Hard       |
| 16  | `Promise.myAll(promises)`   | Counter pattern, error short-circuit          | Hard       |
| 17  | `Promise.myRace(promises)`  | First-to-settle pattern                       | Medium     |

---

## Round 2: JavaScript Machine Coding Round

Machine coding rounds don't test algorithms. They test whether you can build a working product feature under time pressure. The interviewer wants to see: clean component decomposition, state management, edge case handling, and the ability to ship something that works.

---

### What Machine Coding Rounds Actually Test

| They're Testing                                 | They're NOT Testing                  |
| ----------------------------------------------- | ------------------------------------ |
| Can you decompose a UI into components?         | Can you write a sorting algorithm?   |
| Do you handle loading, error, and empty states? | Do you know obscure data structures? |
| Is your state management clean?                 | Can you optimize to O(log n)?        |
| Do you think about edge cases?                  | Can you solve LeetCode hards?        |
| Can you ship something working in 45 min?       | Can you write perfect code?          |
| Do you communicate while coding?                | Can you code in silence?             |

---

### The 5 Patterns That Cover 90% of Questions

#### Pattern 1: Typeahead / Autocomplete

Tests: debouncing, API cancellation, caching, keyboard navigation, accessibility.

_Interviewer's Note: I ask this because it tests 5 concepts at once. The basic version takes 10 minutes. The production version reveals how much you know about real-world frontend engineering._

#### Pattern 2: Infinite Scroll / Pagination

Tests: IntersectionObserver, deduplication, loading states, scroll position restoration.

_Interviewer's Note: This tests whether you understand browser APIs beyond React. IntersectionObserver is the right answer. Scroll event listeners with getBoundingClientRect is the wrong answer._

#### Pattern 3: Timer / Countdown

Tests: setInterval cleanup, pause/resume, tab visibility (Page Visibility API), accurate timing.

_Interviewer's Note: The basic timer is easy. I'm watching for: do they clean up the interval? Do they handle tab switching? Do they account for setInterval drift?_

#### Pattern 4: Multi-step Form / Cart

Tests: state across steps, validation, navigation (back/forward), persistence.

_Interviewer's Note: This is the most Shopflo-relevant pattern. Their entire product is a checkout form. I want to see clean state management across steps._

#### Pattern 5: Grid / Board / Interactive Component

Tests: state management, rendering optimization, keyboard interaction, drag-and-drop.

_Interviewer's Note: This tests whether you can manage complex state without it becoming spaghetti. React.memo, useMemo, and useCallback should appear naturally._

---

### Shopflo-Specific Most Likely Problems

Given that Shopflo builds checkout optimization software, these are the problems most likely to appear:

| #   | Problem                        | Why Shopflo Would Ask This                                                                  |
| --- | ------------------------------ | ------------------------------------------------------------------------------------------- |
| 1   | Shopping Cart                  | This IS their product. Add/remove items, quantity, total calculation, coupon application.   |
| 2   | Checkout Form (Multi-step)     | Their core flow. Address -> Payment -> Confirmation with validation at each step.           |
| 3   | Product Card Grid with Filters | Their brands display product catalogs. Filter by category, price, rating. Sort options.     |
| 4   | Search with Autocomplete       | Product search across 1000+ brand catalogs. Debounce, highlight matches, keyboard nav.      |
| 5   | Countdown Timer                | Gamified checkout: "Complete purchase in 10:00 for 10% off." Pause on tab switch.           |
| 6   | Coupon/Discount Application UI | Their Discount Engine product. Validate codes, show savings, handle stacking rules.         |
| 7   | Accordion                      | Order summary pattern. Expand/collapse sections: items, shipping, payment, total.           |
| 8   | Modal/Popup                    | Coupon popup, exit-intent popup, upsell modal. Focus trap, escape to close, backdrop click. |
| 9   | Todo App                       | Classic CRUD. Tests basic state management, list rendering, filtering.                      |
| 10  | Tabs Component                 | Product details: Description, Reviews, Specifications. Lazy loading tab content.            |

---

### Full Example: Typeahead (Good vs Great)

**Basic version (just works):**

```tsx
function Typeahead() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    if (!value.trim()) {
      setResults([])
      return
    }
    const res = await fetch(`/api/search?q=${value}`)
    const data = await res.json()
    setResults(data)
  }

  return (
    <div>
      <input value={query} onChange={handleChange} placeholder="Search products..." />
      <ul>
        {results.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  )
}
```

Problems with this: fires API call on every keystroke, no request cancellation (stale results can overwrite fresh ones), no loading state, no error handling, no keyboard navigation, no accessibility, no caching.

**Production version (what gets you hired):**

```tsx
function Typeahead() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeIndex, setActiveIndex] = useState(-1)
  const abortRef = useRef<AbortController | null>(null)
  const cacheRef = useRef<Map<string, Product[]>>(new Map())
  const listRef = useRef<HTMLUListElement>(null)

  const debouncedSearch = useMemo(
    () =>
      debounce(async (searchQuery: string) => {
        if (!searchQuery.trim()) {
          setResults([])
          setIsLoading(false)
          return
        }

        // Check cache first
        if (cacheRef.current.has(searchQuery)) {
          setResults(cacheRef.current.get(searchQuery)!)
          setIsLoading(false)
          return
        }

        // Cancel previous request
        abortRef.current?.abort()
        abortRef.current = new AbortController()

        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`, {
            signal: abortRef.current.signal,
          })
          if (!res.ok) throw new Error(`Search failed: ${res.status}`)
          const data = await res.json()
          cacheRef.current.set(searchQuery, data)
          setResults(data)
          setError(null)
        } catch (err) {
          if (err instanceof DOMException && err.name === "AbortError") return
          setError("Search failed. Please try again.")
          setResults([])
        } finally {
          setIsLoading(false)
        }
      }, 300),
    [],
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setIsLoading(true)
    setActiveIndex(-1)
    debouncedSearch(value)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setActiveIndex((prev) => Math.min(prev + 1, results.length - 1))
        break
      case "ArrowUp":
        e.preventDefault()
        setActiveIndex((prev) => Math.max(prev - 1, -1))
        break
      case "Enter":
        if (activeIndex >= 0 && results[activeIndex]) {
          selectProduct(results[activeIndex])
        }
        break
      case "Escape":
        setResults([])
        setActiveIndex(-1)
        break
    }
  }

  const selectProduct = (product: Product) => {
    setQuery(product.name)
    setResults([])
    setActiveIndex(-1)
    // navigate or callback
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort()
    }
  }, [])

  return (
    <div className="relative">
      <input
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Search products..."
        role="combobox"
        aria-expanded={results.length > 0}
        aria-activedescendant={activeIndex >= 0 ? `result-${activeIndex}` : undefined}
        aria-autocomplete="list"
        aria-controls="search-results"
      />

      {isLoading && <Spinner />}
      {error && (
        <p role="alert" className="text-red-500">
          {error}
        </p>
      )}

      {results.length > 0 && (
        <ul id="search-results" ref={listRef} role="listbox">
          {results.map((item, index) => (
            <li
              key={item.id}
              id={`result-${index}`}
              role="option"
              aria-selected={index === activeIndex}
              className={index === activeIndex ? "bg-blue-100" : ""}
              onClick={() => selectProduct(item)}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <HighlightMatch text={item.name} query={query} />
              <span className="text-gray-500">{item.category}</span>
            </li>
          ))}
        </ul>
      )}

      {query && !isLoading && results.length === 0 && !error && (
        <p className="text-gray-500">No products found for "{query}"</p>
      )}
    </div>
  )
}
```

**What makes the production version great:**

1. **Debouncing** — 300ms delay, doesn't fire on every keystroke
2. **AbortController** — cancels in-flight requests when a new one starts
3. **Caching** — `Map` stores previous results, instant for repeated queries
4. **Keyboard navigation** — Arrow keys, Enter to select, Escape to close
5. **Accessibility** — `role="combobox"`, `aria-expanded`, `aria-activedescendant`, `role="listbox"`, `role="option"`
6. **Error handling** — catches fetch errors, shows user-friendly message, ignores abort errors
7. **Loading state** — spinner while fetching
8. **Empty state** — "No products found" message
9. **Cleanup** — aborts pending request on unmount
10. **URL encoding** — `encodeURIComponent` prevents injection

---

### Time Management (45-Minute Round)

| Time      | Activity                    | What to Do                                                                                                                                                                              |
| --------- | --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0-3 min   | Read requirements           | Read twice. Ask 3-5 clarifying questions: "Should I handle error states? Is keyboard navigation expected? Should it persist across page refreshes?"                                     |
| 3-8 min   | Plan approach out loud      | "I'll break this into three components: Container, Input, ResultsList. State will live in the container. I'll use useState for the query and results, useRef for the abort controller." |
| 8-33 min  | Code the MVP                | Get the core functionality working first. Don't optimize prematurely. Ship something that works.                                                                                        |
| 33-40 min | Error handling + edge cases | Add loading states, error boundaries, empty states, input validation. Handle the "what if the API is slow" case.                                                                        |
| 40-45 min | Test and walk through       | Walk the interviewer through your code. Explain your component structure. Mention what you'd add with more time (tests, animations, virtualization for long lists).                     |

---

### Pass vs Fail Behaviors

| Pass                                       | Fail                                                         |
| ------------------------------------------ | ------------------------------------------------------------ |
| Asks clarifying questions before coding    | Starts coding immediately without understanding requirements |
| Plans component structure out loud         | Writes one giant component                                   |
| Handles loading, error, and empty states   | Only handles the happy path                                  |
| Cleans up side effects (abort, timers)     | Leaves memory leaks                                          |
| Uses semantic HTML and basic accessibility | Uses divs for everything                                     |
| Explains tradeoffs while coding            | Codes in silence                                             |
| Gets MVP working, then enhances            | Tries to build the perfect solution and runs out of time     |
| Names variables and functions clearly      | Uses `x`, `temp`, `data1`                                    |
| Decomposes into small, focused components  | Puts everything in one file                                  |

---

### Tips for Standing Out

1. **Use TypeScript** — even if they don't ask for it. Type annotations show you think about contracts and interfaces.
2. **Use `useMemo` and `useCallback` where appropriate** — but explain WHY, not just "for performance." "I'm memoizing this filtered list because the filter is O(n) and the parent re-renders on every keystroke."
3. **Add accessibility from the start** — `role`, `aria-label`, keyboard handlers. Most candidates skip this entirely.
4. **Clean decomposition** — extract custom hooks (`useDebounce`, `useIntersectionObserver`). Extract sub-components. Keep the main component readable.
5. **Mention what you'd add with more time** — "With another 30 minutes, I'd add virtualization for the results list, optimistic updates for the cart, and integration tests with React Testing Library."

> **Purbayan's Angle:** "At fiddle, I built the component preview system where generated code runs in an e2b sandbox with live preview. That's essentially a machine coding problem at production scale: manage async state (sandbox lifecycle), handle errors (sandbox timeouts), clean up resources (abort in-flight operations), and keep the UI responsive. The patterns are identical."

---

## Round 3: Behavioral Round

Behavioral rounds filter out people who can code but can't collaborate, communicate, or own outcomes. At a small company like Shopflo (11-50 people), culture fit and ownership matter as much as technical skill.

---

### The STAR Framework

**Situation** — Set the scene. 1-2 sentences. Where were you? What was the context?
**Task** — What needed to happen? What was your responsibility?
**Action** — What did YOU specifically do? Not the team. You.
**Result** — What was the measurable outcome? What did you learn?

**Example using fiddle-factory:**

> **Situation:** "At fiddle-factory, new users were seeing broken canvas states on their first visit. The canvas would load blank or with corrupted data."
>
> **Task:** "I needed to figure out why the canvas was breaking only for first-time users, not returning ones."
>
> **Action:** "I traced the issue to tldraw's onMount callback firing before projectData had loaded. First-time users had a cold React Query cache, so the data wasn't there yet. Returning users had cached data, so it worked. I deferred canvas hydration until React Query confirmed data readiness, and added a loading gate that prevents tldraw from initializing until the data is available."
>
> **Result:** "Fixed the bug for all new users. Activation rates improved because the first experience actually worked. I also learned to always test the cold-cache path, not just the warm one."

> 🎯 **Interview Tip:** Keep Situation and Task to 20% of your answer. Action should be 60%. Result should be 20%. Most candidates spend too long setting the scene and rush through what they actually did.

---

### 7 Must-Have Stories

Prepare these before the interview. Write them out. Practice saying them out loud. Time yourself (each should be under 2 minutes).

| Story Type                       | Your Story                                                                                                          | Key Project    |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------- | -------------- |
| Difficult technical problem      | Canvas loading bug for new users (cold cache + tldraw onMount timing)                                               | fiddle-factory |
| Conflict or disagreement         | Advocating for tldraw over react-flow when the team was hesitant about migration risk                               | fiddle-factory |
| Failure and what you learned     | First attempt at sandbox migration broke session persistence; had to redesign the session management approach       | fiddle-factory |
| Mentoring or helping others      | Setting up Storybook across 4 repos so the team could visually browse and test all 56 components                    | fiddle-factory |
| Tight deadline                   | Migrating from react-flow to tldraw while the product was actively being used by customers                          | fiddle-factory |
| Receiving and acting on feedback | PR review feedback on the canvas layer system led to a cleaner offscreen buffer architecture                        | Canvas Kit     |
| Product thinking                 | Identifying that the non-blocking message send (PR #227) would dramatically improve perceived performance for users | fiddle-factory |

---

### Shopflo-Specific Behavioral Themes

Shopflo is a small, fast-moving startup. They care about specific traits:

**Ownership:** "Tell me about a time you owned something end-to-end."
Your angle: You owned the Storybook setup across 4 repos, the canvas migration, the sandbox timeout fix. Nobody assigned these. You identified the need and executed.

**Ambiguity:** "How do you handle unclear requirements?"
Your angle: At fiddle, requirements were often a Slack message or a brief conversation. You learned to ask clarifying questions, build an MVP, get feedback, iterate. The sandbox migration started with "we need to move off StackBlitz" and you figured out the rest.

**Speed vs Quality:** "How do you balance shipping fast with shipping well?"
Your angle: The non-blocking message send (PR #227) was a speed optimization that also improved code quality. You shipped the optimistic update first (fast), then added error handling and retry logic (quality). Not either/or.

**Collaboration:** "How do you work with designers/PMs/other engineers?"
Your angle: At fiddle, you worked across 6 repos with different stakeholders. The Storybook setup was specifically to improve collaboration: designers could see components, PMs could verify features, engineers could test in isolation.

**Learning:** "Tell me about something you learned recently."
Your angle: You're always building things to learn. 4at (TCP from sockets), seroost (search engine from scratch), musializer (FFT from math). You don't just read docs. You build.

---

### "Why Shopflo?" Answer Template

Don't give a generic answer. Reference their actual product and tech.

> "Three reasons. First, the problem space. Checkout optimization is one of those rare areas where engineering directly drives revenue. Every millisecond you shave off LCP, every friction point you remove from the form, translates to real money for real brands. I want my work to have that kind of measurable impact.
>
> Second, the technical challenges. You're serving 50M+ annual users across 1000+ brands, each with their own customization needs. You've built a microfrontend architecture with Module Federation, migrated from Webpack to Vite, and optimized LCP from 2.5s to 1.5s. These aren't trivial problems. They're the kind of performance and architecture challenges I find genuinely interesting.
>
> Third, the team size. At 11-50 people, I'd own real product surfaces, not just tickets in a backlog. At fiddle-factory, I thrived in a small team where I could own features end-to-end across multiple repos. Shopflo's size means that same kind of ownership and direct impact."

---

### 6 Smart Questions to Ask Them

These show you've done your homework. Reference their actual tech and products.

1. **"You migrated from Webpack to Vite. What was the biggest unexpected challenge in that migration, and how did it affect your development workflow?"**
   _Shows you know their tech stack and understand that migrations are never clean._

2. **"With Module Federation powering your microfrontend architecture, how do you handle shared state and design consistency across micro-apps?"**
   _Shows you understand microfrontend tradeoffs: independence vs consistency._

3. **"You serve 50M+ annual users across 1000+ brands. How do you handle brand-specific customization at that scale without the codebase becoming unmanageable?"**
   _Shows you think about scalability beyond just performance._

4. **"What does your A/B testing infrastructure look like for checkout flows? How do you measure the impact of UI changes on conversion?"**
   _Shows you think about product impact, not just code._

5. **"How does the team approach performance budgets? Is there a CI check that blocks deploys if bundle size or LCP regresses?"**
   _Shows you think about performance as a process, not a one-time fix._

6. **"What's the biggest technical challenge the frontend team is facing right now that I'd get to work on?"**
   _Shows you're thinking about contribution from day one._

---

### Mock Q&A

---

**Q: "Tell me about yourself."**

> "I'm a full-stack developer finishing my B.Tech at NIT Durgapur. For the past 8 months, I've been working at fiddle-factory, shipping features across their canvas editor, component libraries, and build infrastructure. 48+ PRs across 6 repos.
>
> I taught myself programming through curiosity about how things work at every layer. That curiosity took me from building TCP servers from raw sockets in Rust and Go, to writing an FFT audio visualizer in C, to building a search engine from scratch in Rust, to contributing to Apache ECharts (65k stars).
>
> I'm looking for a frontend role where performance and user experience are the product, not an afterthought. Shopflo's checkout optimization work is exactly that."

---

**Q: "Why Shopflo?"**

Use the template from above. Hit three points: problem space (checkout = revenue), technical challenges (performance, microfrontends, scale), team size (ownership).

---

**Q: "Tell me about a performance optimization you've done."**

> "At fiddle, the chat's message-send flow was blocking. When a user sent a message, the UI waited for the database write, cache invalidation, and response before updating. Multiple round trips before the user saw anything.
>
> I restructured it to be optimistic: on send, I immediately add the message to the local React Query cache so the UI updates instantly. The database write happens async. The Claude API call fires in parallel. The response streams back token by token.
>
> The user sees their message instantly and the AI response starts appearing within a second or two. The tradeoff is handling the case where the database write fails after we've already shown the message, but that's rare and I handle it with a retry plus error toast.
>
> The perceived latency went from 'seconds of nothing' to 'instant feedback.' That's the kind of optimization that matters for checkout flows too: perceived speed is as important as actual speed."

---

**Q: "How do you handle unclear requirements?"**

> "At fiddle, requirements were often a Slack message like 'the sandbox thing is broken, can you look at it?' No spec, no ticket, no reproduction steps.
>
> My approach: first, reproduce the issue myself. For the sandbox timeout bug, I had to wait 2 hours for a sandbox to expire to see it happen. Then I ask clarifying questions: 'Should the sandbox auto-recreate, or should we show an error and let the user retry?' Then I build the smallest thing that works, get feedback, and iterate.
>
> For the sandbox fix specifically, I proposed three approaches to the team: (1) extend the timeout via e2b's API, (2) detect expiry and auto-recreate, (3) show an error with a manual retry button. We went with option 2 because it's invisible to the user. I built it, tested it by letting sandboxes expire intentionally, and shipped it.
>
> The key is: don't wait for perfect requirements. Clarify the critical constraints, build something, get feedback fast."

---

**Q: "Describe a time you owned something end-to-end."**

> "The Storybook setup across fiddle's 4 repos. Nobody asked me to do it. I noticed that the team had 56 primitive components in the shadcn-ui repo, but no way to visually browse them, test them in isolation, or screenshot them for documentation.
>
> I set up Storybook 9 in all 4 repos: shadcn-ui, design-engineer, eleven-labs-ui, and the main fiddle app. Each repo had different challenges. shadcn-ui was on Tailwind v4 and needed stories for all 56 components. design-engineer needed a Tailwind v3 to v4 migration first. eleven-labs-ui had a dark mode CSS variable bug. The fiddle app needed a custom decorator to provide React Query context because components depended on Remix loaders.
>
> I also built a MutationObserver pattern to detect when stories were actually rendered and ready, instead of relying on arbitrary timeouts. This made screenshot automation reliable.
>
> End result: the team could browse every component visually, designers could verify implementations, and we had automated screenshots for documentation. I owned it from 'this should exist' to 'it's deployed and the team uses it daily.'"

---

## Week-by-Week Preparation Plan

A 6-week plan assuming 2-3 hours per day. Adjust based on your interview timeline.

### Week 1: JavaScript Foundations

| Day | Focus                                                                                    | Hours |
| --- | ---------------------------------------------------------------------------------------- | ----- |
| Mon | Closures, scope, hoisting. Code `createCounter`, explain stale closure trap.             | 2.5   |
| Tue | Event loop. Trace 5 predict-the-output problems. Draw the queues on paper.               | 2.5   |
| Wed | `this` keyword. All 4 binding rules. Code examples for each. Arrow function differences. | 2.5   |
| Thu | Promises, async/await. Implement `withTimeout`, `retry`. All 4 combinators.              | 2.5   |
| Fri | Prototypal inheritance, `Object.create` vs `new`, ES6 classes as sugar.                  | 2     |
| Sat | Review week. Re-explain every concept out loud without notes.                            | 2     |
| Sun | Rest or catch up on weak areas.                                                          | 1     |

### Week 2: Polyfills & Utility Functions

| Day | Focus                                                                 | Hours |
| --- | --------------------------------------------------------------------- | ----- |
| Mon | `myMap`, `myFilter`, `myReduce` from scratch. Handle edge cases.      | 2.5   |
| Tue | `myBind`, `curry`, `memoize` from scratch.                            | 2.5   |
| Wed | `debounce`, `throttle` with proper `this` context.                    | 2.5   |
| Thu | `deepClone` (handle circular refs), `flatten`, `pipe`, `compose`.     | 2.5   |
| Fri | `EventEmitter`, `promisify`, `Promise.myAll`, `Promise.myRace`.       | 2.5   |
| Sat | Speed drill: code all 17 functions from the checklist. Time each one. | 3     |
| Sun | Rest or redo any function that took more than 10 minutes.             | 1     |

### Week 3: Machine Coding (React)

| Day | Focus                                                                  | Hours |
| --- | ---------------------------------------------------------------------- | ----- |
| Mon | Build a Typeahead from scratch (production version). 45-minute timer.  | 3     |
| Tue | Build a Shopping Cart. Add/remove items, quantity, total, coupon code. | 3     |
| Wed | Build a Multi-step Checkout Form. Address -> Payment -> Confirmation.  | 3     |
| Thu | Build an Infinite Scroll product grid with filters.                    | 3     |
| Fri | Build a Countdown Timer with pause/resume and tab visibility handling. | 2.5   |
| Sat | Build an Accordion and a Tabs component. Focus on accessibility.       | 2.5   |
| Sun | Review all builds. Identify patterns. Extract reusable hooks.          | 2     |

### Week 4: Performance & Browser Internals

| Day | Focus                                                                         | Hours |
| --- | ----------------------------------------------------------------------------- | ----- |
| Mon | Critical rendering path. DOM, CSSOM, render tree, layout, paint, composite.   | 2.5   |
| Tue | Core Web Vitals: LCP, CLS, INP. How to measure, how to fix.                   | 2.5   |
| Wed | Network stack: HTTP caching, resource hints, CDN behavior.                    | 2.5   |
| Thu | React 18: concurrent features, useTransition, useDeferredValue, Suspense.     | 2.5   |
| Fri | Module systems: ESM vs CJS, tree shaking, code splitting, Vite vs Webpack.    | 2.5   |
| Sat | Build a performance audit of a sample checkout page. Identify and fix issues. | 3     |
| Sun | Rest.                                                                         | 0     |

### Week 5: Behavioral Prep

| Day | Focus                                                                                       | Hours |
| --- | ------------------------------------------------------------------------------------------- | ----- |
| Mon | Write out all 7 STAR stories. Time each one (under 2 minutes).                              | 2.5   |
| Tue | Practice "Tell me about yourself" and "Why Shopflo?" out loud. Record and listen back.      | 2     |
| Wed | Practice performance optimization story and unclear requirements story.                     | 2     |
| Thu | Practice ownership story and conflict/disagreement story.                                   | 2     |
| Fri | Prepare 6 questions to ask them. Research Shopflo's latest blog posts and LinkedIn updates. | 2     |
| Sat | Mock interview with a friend or rubber duck. Full behavioral round simulation.              | 2.5   |
| Sun | Rest.                                                                                       | 0     |

### Week 6: Full Simulation

| Day | Focus                                                                                   | Hours |
| --- | --------------------------------------------------------------------------------------- | ----- |
| Mon | Simulate Round 1: 45 min of JS theory questions. Answer out loud.                       | 2.5   |
| Tue | Simulate Round 2: Pick a random machine coding problem. 45-minute timer. No references. | 3     |
| Wed | Simulate Round 3: Full behavioral mock. Record yourself.                                | 2.5   |
| Thu | Review weak areas from simulations. Redo any problem that felt shaky.                   | 2.5   |
| Fri | Light review. Re-read this document. Get a good night's sleep.                          | 1.5   |
| Sat | Interview day prep: review cheat sheet, warm up with one easy coding problem.           | 1     |
| Sun | Rest. You're ready.                                                                     | 0     |

---

### Resources

| Resource                    | What It's For                                                | URL                           |
| --------------------------- | ------------------------------------------------------------ | ----------------------------- |
| GreatFrontEnd               | Structured frontend interview prep with practice problems    | greatfrontend.com             |
| Frontend Interview Handbook | Comprehensive guide to frontend interviews                   | frontendinterviewhandbook.com |
| BigFrontEnd.dev             | Frontend-specific coding challenges (BFE.dev)                | bigfrontend.dev               |
| PlayCode.io                 | Online JS/TS playground for quick practice                   | playcode.io                   |
| LearnersBucket              | Frontend machine coding problems with solutions              | learnersbucket.com            |
| web.dev                     | Google's Core Web Vitals and performance guides              | web.dev                       |
| javascript.info             | Deep JavaScript reference (event loop, promises, prototypes) | javascript.info               |
| Patterns.dev                | React and JavaScript design patterns                         | patterns.dev                  |

---

## Quick Reference Cheat Sheet

### Event Loop Output Patterns

```
sync code -> microtasks (Promise.then, await continuation, queueMicrotask) -> macrotasks (setTimeout, setInterval)
```

**Pattern 1: Basic ordering**

```javascript
console.log("A") // 1st: sync
setTimeout(() => log("B")) // 4th: macrotask
Promise.resolve().then(() => log("C")) // 3rd: microtask
console.log("D") // 2nd: sync
// Output: A, D, C, B
```

**Pattern 2: Async function**

```javascript
async function foo() {
  console.log("1") // 2nd: sync inside foo
  await Promise.resolve()
  console.log("2") // 4th: microtask (after await)
}
console.log("3") // 1st: sync
foo()
console.log("4") // 3rd: sync (after foo yields)
// Output: 3, 1, 4, 2
```

**Pattern 3: Nested promises**

```javascript
Promise.resolve().then(() => {
  console.log("1") // 1st microtask
  Promise.resolve().then(() => console.log("2")) // queued as new microtask
})
Promise.resolve().then(() => console.log("3")) // 2nd microtask (already queued)
// Output: 1, 3, 2
```

---

### `this` Binding Quick Reference

| Call Style                         | `this` Value                        |
| ---------------------------------- | ----------------------------------- |
| `new Foo()`                        | New object                          |
| `foo.call(obj)` / `foo.apply(obj)` | `obj`                               |
| `obj.foo()`                        | `obj`                               |
| `foo()`                            | `undefined` (strict) / `globalThis` |
| `() => {}`                         | Inherited from enclosing scope      |

---

### Promise Combinators

| Method               | Resolves When  | Rejects When                 |
| -------------------- | -------------- | ---------------------------- |
| `Promise.all`        | ALL resolve    | ANY rejects                  |
| `Promise.allSettled` | ALL settle     | Never                        |
| `Promise.race`       | First settles  | First settles (if rejection) |
| `Promise.any`        | First resolves | ALL reject                   |

---

### All Polyfill Signatures

```javascript
// Array methods
Array.prototype.myMap(callback, thisArg) -> Array
Array.prototype.myFilter(callback, thisArg) -> Array
Array.prototype.myReduce(callback, initialValue) -> any

// Function methods
Function.prototype.myBind(context, ...boundArgs) -> Function

// Utility functions
debounce(fn, delay) -> Function
throttle(fn, limit) -> Function
deepClone(obj) -> Object
curry(fn) -> Function
memoize(fn) -> Function
flatten(arr, depth?) -> Array
pipe(...fns) -> Function
compose(...fns) -> Function
promisify(fn) -> Function (returns Promise)
retry(fn, retries, delay) -> Promise

// Classes
EventEmitter { on(event, handler), off(event, handler), emit(event, ...args) }
```

---

### Core Web Vitals Targets

| Metric | Good    | Needs Improvement | Poor    |
| ------ | ------- | ----------------- | ------- |
| LCP    | < 2.5s  | 2.5s - 4.0s       | > 4.0s  |
| INP    | < 200ms | 200ms - 500ms     | > 500ms |
| CLS    | < 0.1   | 0.1 - 0.25        | > 0.25  |

---

### Critical Rendering Path (One-Line Summary)

```
HTML -> DOM -> CSSOM -> Render Tree -> Layout -> Paint -> Composite
         ^                                         ^
    CSS blocks this                        JS can trigger reflow here
```

---

### Resource Hints Priority

```
dns-prefetch < preconnect < preload < prefetch
(DNS only)    (DNS+TCP+TLS) (download now) (download when idle)
```

---

### React 18 Concurrent Features

| Feature            | What It Does                                   | When to Use                          |
| ------------------ | ---------------------------------------------- | ------------------------------------ |
| `useTransition`    | Marks state update as non-urgent               | Filtering large lists, tab switching |
| `useDeferredValue` | Defers re-render with new value                | Search results, derived computations |
| `Suspense`         | Shows fallback while async content loads       | Code splitting, data fetching        |
| Automatic batching | Batches all state updates (even in setTimeout) | Always on in React 18                |

---

_Last updated: March 2026. Review and update before each interview round._
