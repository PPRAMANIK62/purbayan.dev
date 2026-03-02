# Shopflo Frontend Interview Prep

_4-day prep for Rounds 1 (JS basics + polyfills) and 2 (machine coding)._

---

## Day 1: JavaScript Core Concepts

**Focus:** Closures, event loop, `this` keyword, promises, hoisting, coercion

**Instructions:**

- Morning: Study theory (closures, event loop, this binding)
- Afternoon: Promises, hoisting, event delegation, destructuring
- Evening: Start first 3 polyfills (myMap, myFilter, myReduce)
- Explain each concept out loud like an interviewer asked

### BFE.dev Quizzes

| Quiz # | Topic                 | Link                            |
| ------ | --------------------- | ------------------------------- |
| 1-10   | var, const, let       | https://bigfrontend.dev/quiz/1  |
| 11-20  | this binding          | https://bigfrontend.dev/quiz/11 |
| 21-30  | Promise & async/await | https://bigfrontend.dev/quiz/21 |
| 31-40  | Closures & scope      | https://bigfrontend.dev/quiz/31 |

### BFE.dev Coding

| #   | Function                                   | Link                               |
| --- | ------------------------------------------ | ---------------------------------- |
| 1   | Implement curry()                          | https://bigfrontend.dev/problem/1  |
| 2   | Implement throttle()                       | https://bigfrontend.dev/problem/2  |
| 3   | Implement Array.prototype.flat()           | https://bigfrontend.dev/problem/3  |
| 5   | Implement throttle() with leading/trailing | https://bigfrontend.dev/problem/5  |
| 11  | Implement pipe()                           | https://bigfrontend.dev/problem/11 |

---

## Day 2: Polyfills Grind

**Focus:** Code ALL core polyfills from scratch, no references

**Instructions:**

- Morning: debounce, throttle, myBind, curry, memoize
- Afternoon: deepClone, flatten, pipe, compose, Promise.myAll, EventEmitter
- Evening: Speed drill - recode ALL functions with timer, no references
- Use BFE.dev for instant test feedback

### BFE.dev Quizzes

| Quiz # | Topic           | Link                            |
| ------ | --------------- | ------------------------------- |
| 41-50  | Event loop      | https://bigfrontend.dev/quiz/41 |
| 51-60  | Prototype chain | https://bigfrontend.dev/quiz/51 |
| 61-70  | Type coercion   | https://bigfrontend.dev/quiz/61 |
| 71-80  | Hoisting        | https://bigfrontend.dev/quiz/71 |

### BFE.dev Coding

| #   | Function                            | Link                               |
| --- | ----------------------------------- | ---------------------------------- |
| 6   | Implement debounce()                | https://bigfrontend.dev/problem/6  |
| 9   | Implement deepClone()               | https://bigfrontend.dev/problem/9  |
| 14  | Implement memo()                    | https://bigfrontend.dev/problem/14 |
| 15  | Implement promisify()               | https://bigfrontend.dev/problem/15 |
| 26  | Implement Array.prototype.reduce()  | https://bigfrontend.dev/problem/26 |
| 27  | Implement Array.prototype.map()     | https://bigfrontend.dev/problem/27 |
| 30  | Implement Function.prototype.bind() | https://bigfrontend.dev/problem/30 |
| 32  | Implement Array.prototype.flat()    | https://bigfrontend.dev/problem/32 |

---

## Day 3: Machine Coding

**Focus:** Build UI components from scratch, timed, no googling

**Instructions:**

- Morning (60 min): Build Shopping Cart
- Afternoon (60 min): Build Typeahead/Autocomplete
- Evening (45 min): Build Countdown Timer
- After each build: Did you handle empty state? Loading state? Cleanup?

### Most Likely Shopflo Problems

| Problem                    | Why They'd Ask          |
| -------------------------- | ----------------------- |
| Shopping Cart              | This IS their product   |
| Checkout Form (Multi-step) | Their core flow         |
| Product Grid with Filters  | Brand product catalogs  |
| Typeahead/Autocomplete     | Product search          |
| Countdown Timer            | Gamified checkout       |
| Coupon/Discount UI         | Discount Engine product |

### BFE.dev Quizzes (warmup before building)

| Quiz # | Topic                  | Link                            |
| ------ | ---------------------- | ------------------------------- |
| 81-90  | setTimeout/setInterval | https://bigfrontend.dev/quiz/81 |
| 91-100 | DOM & events           | https://bigfrontend.dev/quiz/91 |

### BFE.dev Coding (Promise combinators)

| #   | Function                       | Link                               |
| --- | ------------------------------ | ---------------------------------- |
| 23  | Implement Promise.all()        | https://bigfrontend.dev/problem/23 |
| 24  | Implement Promise.race()       | https://bigfrontend.dev/problem/24 |
| 33  | Implement Promise.any()        | https://bigfrontend.dev/problem/33 |
| 34  | Implement Promise.allSettled() | https://bigfrontend.dev/problem/34 |

### Machine Coding Practice

| Site                    | Link                                               |
| ----------------------- | -------------------------------------------------- |
| GreatFrontEnd           | https://greatfrontend.com/questions/user-interface |
| FrontendArk             | https://frontendark.com                            |
| DevTools Tech           | https://devtools.tech/questions/all                |
| LearnersBucket (videos) | https://youtube.com/@learnersbucket                |

---

## Day 4: Review + Full Simulation

**Focus:** Pressure test - everything timed, nothing open

**Instructions:**

- Morning (2 hrs): Polyfill speed drill - all 8 core functions from scratch
- Afternoon (2 hrs): Redo weakest build from Day 3 + one bonus problem
- Evening (2 hrs): Full interview simulation (30 min Round 1 + 45 min Round 2)

### Polyfill Speed Targets

| Function      | Target Time | Link                               |
| ------------- | ----------- | ---------------------------------- |
| debounce      | < 3 min     | https://bigfrontend.dev/problem/6  |
| throttle      | < 3 min     | https://bigfrontend.dev/problem/2  |
| myMap         | < 3 min     | https://bigfrontend.dev/problem/27 |
| myReduce      | < 5 min     | https://bigfrontend.dev/problem/26 |
| myBind        | < 5 min     | https://bigfrontend.dev/problem/30 |
| curry         | < 5 min     | https://bigfrontend.dev/problem/1  |
| deepClone     | < 8 min     | https://bigfrontend.dev/problem/9  |
| Promise.myAll | < 8 min     | https://bigfrontend.dev/problem/23 |

### BFE.dev Final Review

- Redo ANY quiz you got wrong from Days 1-3
- Random quiz mode: https://bigfrontend.dev/quiz
- Target: 100% accuracy on all revisited quizzes
- Recode all polyfills - any taking > 2x target needs more practice

---

## Predict the Output (Event Loop Patterns)

_Memorize these 4 patterns. They cover 90% of "predict the output" questions._

### Pattern 1: Basic — sync → microtask → macrotask

```javascript
console.log("A")
setTimeout(() => console.log("B"), 0)
Promise.resolve().then(() => console.log("C"))
console.log("D")
// Output: A, D, C, B
```

**Why:** Sync runs first (A, D). Microtasks drain (C). Then macrotasks (B).

### Pattern 2: async/await — await yields to sync code

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

**Why:** `3` sync. `foo()` called → `1` sync inside. `await` pauses foo, schedules rest as microtask. Control returns → `4` sync. Microtask drains → `2`.

### Pattern 3: Nested promises — inner promise queues after outer

```javascript
Promise.resolve().then(() => {
  console.log("1")
  Promise.resolve().then(() => console.log("2"))
})
Promise.resolve().then(() => console.log("3"))
// Output: 1, 3, 2
```

**Why:** First `.then` runs → logs `1`, queues inner promise. Second `.then` already queued → logs `3`. Inner promise runs → `2`.

### Pattern 4: setTimeout(0) vs Promise in loop

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log("timeout", i), 0)
}
for (let j = 0; j < 3; j++) {
  Promise.resolve().then(() => console.log("promise", j))
}
// Output: promise 0, promise 1, promise 2, timeout 3, timeout 3, timeout 3
```

**Why:** `let` creates new binding per iteration (0,1,2). `var` shares one binding (final value 3). Promises (microtasks) run before timeouts (macrotasks).

---

## Machine Coding Framework

_The first 8 minutes of thinking separate pass from fail. Don't start coding immediately._

### The 6 Phases (45-min round)

```
CLARIFY → DECOMPOSE → STATE → BUILD MVP → EDGE CASES → POLISH
 3 min      3 min     2 min    25 min       7 min       5 min
```

### Phase 1: Clarify (3 min)

**Ask these questions to scope DOWN:**

- "Should I handle error states / loading states?"
- "Is keyboard navigation expected?"
- "Should it persist across page refresh?"
- "API calls or mock data?"
- "Mobile responsive needed?"

_You can't build everything in 45 min. Decide what's MVP vs bonus._

### Phase 2: Decompose (3 min)

**Think in rectangles. Say this out loud:**

```
"I see three components:
 - App (holds state)
 - ProductList → ProductCard (xN)
 - Cart → CartItem (xN)"
```

**Where does state live?** If multiple components need it → lift to common parent.

### Phase 3: State Design (2 min)

**The most important 2 minutes.**

| Question                   | Answer                                |
| -------------------------- | ------------------------------------- |
| What's the minimum state?  | Only what can't be derived            |
| What's derived?            | totals, filtered lists, counts        |
| What actions change state? | add, remove, update, toggle           |
| Store or derive?           | If you can compute it, don't store it |

**Example (Shopping Cart):**

- Store: `cart` array of `{ id, name, price, quantity }`
- Derive: `total` (reduce), `itemCount` (sum of quantities)
- Actions: addToCart, removeFromCart, updateQuantity

### Phase 4: Build MVP (25 min)

**Order matters:**

1. Parent component with state + handlers
2. Pass props down to children
3. Wire up the main user flow
4. Test the happy path once before moving on

_Get it working ugly. Polish comes later._

### Phase 5: Edge Cases (7 min)

**Check this list systematically:**

| Edge Case     | How to Handle                                  |
| ------------- | ---------------------------------------------- |
| Empty state   | "Your cart is empty" message                   |
| Single item   | Works same as multiple?                        |
| Rapid clicks  | Functional updater `setState(prev => ...)`     |
| Zero/negative | Guard in handler, disable button               |
| Long text     | Truncate with CSS `text-overflow`              |
| Loading       | Spinner or skeleton                            |
| Error         | Error message + retry                          |
| Cleanup       | `clearInterval`, `abort()` in useEffect return |

### Phase 6: Polish (5 min)

- Add ONE high-impact bonus (keyboard nav, animation, localStorage)
- **Say out loud** what you'd add with more time
- Walk interviewer through your code

---

## Pass vs Fail Behaviors

| Pass ✅                                   | Fail ❌                                           |
| ----------------------------------------- | ------------------------------------------------- |
| Asks clarifying questions before coding   | Starts coding immediately                         |
| Plans component structure out loud        | Writes one giant component                        |
| Handles loading, error, empty states      | Only handles happy path                           |
| Cleans up side effects (abort, timers)    | Leaves memory leaks                               |
| Uses semantic HTML                        | Divs for everything                               |
| Explains tradeoffs while coding           | Codes in silence                                  |
| Gets MVP working, then enhances           | Tries to build perfect solution, runs out of time |
| Decomposes into small, focused components | Everything in one file                            |

---

## Quick Reference

### State Design Cheat Sheet

| Component       | Store                                          | Derive                         |
| --------------- | ---------------------------------------------- | ------------------------------ |
| Shopping Cart   | `cart: { id, name, price, qty }[]`             | `total`, `itemCount`           |
| Typeahead       | `query`, `results`, `isLoading`, `activeIndex` | —                              |
| Multi-step Form | `currentStep`, `formData: {}`, `errors: {}`    | `isStepValid`                  |
| Countdown Timer | `timeLeft`, `isRunning`, `initialTime`         | formatted `MM:SS`              |
| Tabs            | `activeIndex`                                  | —                              |
| Todo            | `todos: { id, text, done }[]`, `filter`        | `filteredTodos`, `activeCount` |

### Cleanup Patterns

```javascript
// Timer cleanup
useEffect(() => {
  const id = setInterval(() => /* ... */, 1000)
  return () => clearInterval(id)
}, [])

// Fetch abort
useEffect(() => {
  const controller = new AbortController()
  fetch(url, { signal: controller.signal })
  return () => controller.abort()
}, [url])

// Event listener
useEffect(() => {
  const handler = (e) => /* ... */
  window.addEventListener('keydown', handler)
  return () => window.removeEventListener('keydown', handler)
}, [])
```

### Questions to Ask for Common Problems

| Problem       | Ask                                                         |
| ------------- | ----------------------------------------------------------- |
| Shopping Cart | Duplicate = new item or increment? Persist to localStorage? |
| Typeahead     | Min chars before search? API or local filter? Keyboard nav? |
| Form          | Validate per step or final? Can user go back? What fields?  |
| Timer         | Pause/resume? What happens at 0? Handle tab visibility?     |
| Filters       | Multiple filters? Sort? URL sync? Clear all button?         |

---

## Practice Platforms

| Platform       | Best For               | Link                                |
| -------------- | ---------------------- | ----------------------------------- |
| BFE.dev        | JS quizzes & polyfills | https://bigfrontend.dev             |
| GreatFrontEnd  | UI components          | https://greatfrontend.com           |
| FrontendArk    | React practice         | https://frontendark.com             |
| DevTools Tech  | Machine coding         | https://devtools.tech               |
| LearnersBucket | Video walkthroughs     | https://youtube.com/@learnersbucket |

---

_Read theory (interview-prep.md) → Take quiz → Code the polyfill → Build the component → Repeat._
