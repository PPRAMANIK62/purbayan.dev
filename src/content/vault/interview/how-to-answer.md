# How to Answer: A Strategic Interview Guide

Written from the interviewer's chair first, then flipped to yours. Know what they want before you walk in.

---

## Part 1: The Interviewer's Perspective

You're sitting across from a senior engineering manager. She's hiring for a full-stack role at a growth-stage startup or a mid-size tech company. She's seen 40 candidates this quarter. Most blur together. Here's what she's actually thinking.

### What I'm Looking For In a Candidate

**1. Technical Depth**
Can they go beyond "I used React" to "here's how React's reconciliation actually works, and I hit this specific issue in my project"? Surface-level knowledge is everywhere. I want someone who's been in the weeds.

**2. Problem-Solving Process**
Do they jump to solutions or do they clarify, plan, execute, verify? I'm watching their brain work, not just the answer.

**3. Real Experience**
Have they shipped code that real users interacted with? Tutorial projects don't count. I want someone who's dealt with production bugs, code review, and the mess of real codebases.

**4. Learning Velocity**
Can they pick up new things fast? The stack will change. The tools will change. I need someone who adapts, not someone who's married to one framework.

**5. Communication**
Can they explain technical concepts clearly to different audiences? Engineers who can't communicate create bottlenecks.

**6. Ownership**
Do they just fix what's assigned or do they find and fix problems proactively? I want someone who treats the codebase like it's theirs.

**7. AI Literacy**
Can they use AI tools effectively and critically, not blindly? This is 2026. I expect candidates to use AI. I also expect them to know when it's wrong.

### How I Would Test These

| Quality | Test Method | What I Watch For |
|---------|-------------|-----------------|
| Technical Depth | "Explain how your canvas layer system works" | Can they go from high-level to implementation details without losing me? Do they know *why* they made each choice? |
| Problem-Solving | Live coding: "Fix this React performance bug" | Do they measure before optimizing? Do they read the error message? Do they talk through their thinking? |
| Real Experience | "Tell me about a bug that took you more than a day to fix" | Specificity of the story. Honesty about what went wrong. I can smell a fabricated answer instantly. |
| Learning Velocity | "How did you approach migrating from react-flow to tldraw?" | Did they study the new tool first or just start coding? Did they plan the migration or wing it? |
| Communication | "Explain TCP to someone who only knows HTTP" | Simplicity. Analogies. Do they check if I'm following? |
| Ownership | "What's something you fixed that wasn't your task?" | Proactive bug-finding. Initiative. Did they wait to be told or did they just do it? |
| AI Literacy | "How do you use Claude/Copilot in your workflow?" | Do they verify output? Do they know limitations? Can they articulate when AI helps and when it hurts? |

### Red Flags That Get Candidates Rejected

1. **Can't explain WHY they chose a technology.** "It's popular" is not a reason. "Zustand over Redux because less boilerplate and better DX for our use case" is a reason.
2. **All answers are surface-level.** No details about implementation, no specifics about what went wrong, no numbers.
3. **Can't discuss failures or mistakes honestly.** Everyone has bugs. Everyone has bad decisions. If you can't talk about yours, I don't trust you.
4. **Claim credit for team work without acknowledging collaboration.** "I built the entire system" when you were on a team of five? That's a red flag.
5. **Can't whiteboard a simple system design under pressure.** You don't need to design Google. But you should be able to sketch a basic architecture and talk through tradeoffs.
6. **Inconsistency in career story without clear reasoning.** Gaps and pivots are fine. Unexplained gaps and pivots are not.
7. **Only know the happy path.** Can't discuss edge cases, errors, scaling issues, or what happens when things break.
8. **Over-reliance on AI without understanding what it generates.** If you can't explain the code you submitted, you didn't write it.

> 🎯 **Interview Tip:** Practice your project stories with a timer. If you can't explain a project in under 2 minutes, you'll lose the interviewer's attention.

### Green Flags That Make Me Want to Hire

1. **Built things from scratch** (not just tutorial projects). A TCP server from raw sockets, a search engine without Elasticsearch, an FFT library in C. These show real understanding.
2. **Contributed to major open source** (Apache ECharts, 65k stars). Shows they can navigate large codebases and survive rigorous code review.
3. **Can connect low-level concepts to high-level decisions.** "I chose Zustand because I understand how React's reconciliation works and Zustand's external store pattern plays well with concurrent features."
4. **Non-CS background with this depth.** Exceptional learning ability. Self-driven. Doesn't need a curriculum.
5. **Has a blog with technical depth.** The Canvas layers article isn't a tutorial. It's an architectural deep-dive. That's rare.
6. **Can explain tradeoffs, not just solutions.** "We could do X, but the tradeoff is Y. We went with Z because..."
7. **Shows genuine curiosity.** "I built musializer to understand FFT. I built 4at to understand TCP." That's not resume padding. That's a builder.
8. **Has production experience.** 48+ PRs across 6 repos. Canvas rendering, auth flows, build pipelines. Real work with real users.

---

## Part 2: Honest Assessment, Does Purbayan Have It?

No sugarcoating. Here's where you stand.

### Profile Summary

- NIT Durgapur, B.Tech Mechanical Engineering (graduating 2026)
- Self-taught developer, no CS degree
- Stack: TypeScript, React 19, Next.js 15, Rust, C, Go, Tailwind, Zustand, PostgreSQL
- Experience: fiddle-factory (8 months, intern then contractor, 48+ PRs across 6 repos)
- Open Source: Apache ECharts (merged PR in a 65k-star project)
- Projects: 5 major builds (wayforged, Canvas Kit, 4at, seroost, musializer) plus portfolio and others

### Quality-by-Quality Assessment

| Quality | Rating | Evidence | Gap to Fill |
|---------|--------|----------|-------------|
| Technical Depth | **STRONG** | Built TCP from sockets, FFT from math, TF-IDF from scratch, Canvas layers from Canvas API. These aren't wrappers around libraries. | Practice articulating these verbally under time pressure. Knowing it and explaining it in 2 minutes are different skills. |
| Problem-Solving | **STRONG** | Multiple complex bug fixes at fiddle: canvas loading race condition (React Query cold cache + tldraw onMount timing), iframe clipboard focus theft, sandbox timeout restoration. Each required systematic debugging. | Practice structured problem-solving out loud. Interviewers can't see your thinking unless you narrate it. |
| Real Experience | **STRONG** | fiddle-factory has real users. 48+ PRs shipped. Worked across 6 repos: frontend, component libraries, build infrastructure, auth, canvas rendering. | Can credibly say "I shipped code that real users depend on." Don't undersell this. |
| Learning Velocity | **EXCEPTIONAL** | Mechanical Engineering to full-stack with Rust, C, Go depth in roughly 3 years. Migrated react-flow to tldraw (learned a new canvas library under deadline). Picked up e2b sandboxes for cloud migration. | Frame this as your biggest strength in behavioral answers. The non-CS angle is a feature, not a bug. |
| Communication | **NEEDS PRACTICE** | Blog shows strong writing ability. PR descriptions are detailed and clear. But verbal interview communication is a different muscle. | Practice explaining projects in 2 minutes (elevator pitch) and 10 minutes (deep dive). Record yourself. Listen back. Cut the filler. |
| Ownership | **STRONG** | Proactively fixed 15+ bugs at fiddle. Set up Storybook across 4 repos without being asked. Contributed to Apache ECharts on your own initiative. | Have 2-3 "I noticed X was broken and fixed it without being asked" stories rehearsed and ready. |
| AI Literacy | **STRONG** | Built Claude health check endpoint and API integration at fiddle. Uses AI tools in development workflow. Understands the difference between using AI and depending on AI. | Practice articulating HOW you use AI and WHEN you choose not to. Interviewers want nuance here. |

### Honest Gaps

**No formal work at a large tech company.**
But fiddle-factory is real production work with real users, real code review, and real deadlines. Don't apologize for this. Frame it: "I've shipped production code across 6 repos. The company size doesn't change the quality of the work."

**No deployed backend at scale.**
Your systems programming knowledge is deep (TCP, FFT, TF-IDF), but you haven't operated a service handling thousands of requests per second. For system design questions, be honest: "I haven't operated at that scale, but here's how I'd approach it based on what I know about..."

**Behavioral interview practice may be lacking.**
Your technical skills are ahead of your storytelling skills. This is common for builders. The fix is simple: practice telling your stories out loud. Time them. Get feedback.

**DSA practice needs consistency.**
You have a Go DSA repo. That's a start. But coding rounds require speed and pattern recognition that only come from regular practice. Block time for this weekly.

---

## Part 3: How to Answer Every Type of Question

### 1. "Tell me about yourself" (Opening)

**Framework: Present, Past, Future (60-90 seconds)**

Don't recite your resume. Tell a story.

- **Present:** "I'm a full-stack developer finishing my B.Tech at NIT Durgapur. I've been working as a contractor at fiddle-factory, shipping features across their canvas editor, component libraries, and build infrastructure."
- **Past:** "I taught myself programming through curiosity about how things work. That curiosity took me from building TCP servers from raw sockets in Rust and Go, to writing an FFT library in C, to shipping 48+ PRs in a production codebase."
- **Future:** "I'm looking for a role where I can combine my frontend and systems experience to build products that work well at every layer of the stack."

**Common mistake:** Going on for 5 minutes. Reciting every project. Sounding rehearsed. Keep it tight. Let them ask follow-ups.

### 2. Technical Concept Questions ("Explain X")

**Framework: Definition, How It Works, Why It Matters, Your Experience**

Don't just define. Show you've used it.

Example: "Explain the event loop."
- **Definition:** "It's the mechanism that lets JavaScript handle async operations despite being single-threaded."
- **How it works:** "The call stack executes synchronous code. Async callbacks go to the task queue. The event loop checks if the call stack is empty, then pulls from the queue. Microtasks (promises) get priority over macrotasks (setTimeout)."
- **Why it matters:** "If you block the event loop with heavy computation, the UI freezes. That's why we use Web Workers or break work into chunks."
- **Your experience:** "At fiddle-factory, I made message-sending non-blocking (PR #227) because the UI was freezing while waiting for operations that didn't need to block. Understanding the event loop was key to identifying why."

**Common mistake:** Stopping at the definition. Or going so deep into implementation details that you lose the interviewer. Read the room.

### 3. "Tell me about a project" Questions

**Framework: Problem, Solution, Architecture, Challenges, Learnings**

- **Start with WHY you built it.** "I built seroost because I wanted to understand how search engines actually work, not just call an API."
- **Get specific about architecture.** "It's a local TF-IDF search engine in Rust. Custom tokenizer, inverted index, TF-IDF scoring. Serves results over HTTP using tiny_http. Only 3 external crates."
- **Share a REAL challenge.** "The hardest part was getting the tokenizer right. Naive splitting on whitespace doesn't handle punctuation, case sensitivity, or stop words. I had to iterate on the tokenization pipeline several times."
- **End with what you'd do differently.** "If I rebuilt it, I'd add BM25 scoring instead of raw TF-IDF, and I'd look into persistent indexing so you don't re-index on every startup."

**Common mistake:** Describing the tech stack without explaining decisions. "I used React and Node" tells me nothing. "I chose Rust with only 3 crates because I wanted to build everything from scratch and understand each piece" tells me everything.

### 4. Behavioral Questions (STAR Method)

**Framework: Situation, Task, Action, Result**

- **Situation:** Set the scene briefly. 1-2 sentences max. "At fiddle-factory, new users were seeing broken canvas states on their first visit."
- **Task:** What needed to happen. "I needed to figure out why the canvas was breaking only for first-time users, not returning ones."
- **Action:** What YOU specifically did. "I traced the issue to tldraw's onMount callback firing before projectData had loaded. First-time users had a cold React Query cache, so the data wasn't there yet. Returning users had cached data, so it worked. I deferred canvas hydration until the data was confirmed available."
- **Result:** Measurable outcome plus what you learned. "Fixed the bug for all new users. Learned to always consider the cold-cache path, not just the warm one."

**Common mistake:** Spending too long on Situation. Saying "we" when you mean "I." Being vague about what you actually did versus what the team did.

> 💡 **Key Insight:** The STAR method works because it forces specificity. Vague stories get filtered out — concrete details build trust.

### 5. System Design Questions

**Framework: Clarify, Estimate, Design, Deep Dive, Tradeoffs**

- **ALWAYS start by clarifying requirements.** "How many concurrent users? Do we need real-time updates? What's the latency budget?"
- **Sketch the high-level architecture.** Even verbally: "I'd have a React frontend talking to an API gateway, which routes to a canvas service and a chat service. Both write to a shared PostgreSQL database."
- **Pick ONE area to go deep on.** Don't try to design everything. "Let me dive into the real-time collaboration piece, since that's the hardest part."
- **Always discuss tradeoffs.** "We could use WebSockets for real-time, which gives us low latency but means managing persistent connections. Or we could use SSE, which is simpler but one-directional. For a collaborative editor, WebSockets make more sense because we need bidirectional communication."

**Common mistake:** Jumping straight into database schema. Not clarifying requirements. Designing for Google-scale when the question is about a startup. Not discussing alternatives.

### 6. Coding Round

**Framework: Understand, Plan, Code, Test, Optimize**

- **Read the problem TWICE.** Seriously. Misreading the problem is the #1 cause of failed coding rounds.
- **State your approach BEFORE coding.** "I'm going to use a hash map to track frequencies, then iterate once to find the answer. That gives me O(n) time and O(n) space."
- **Write clean code, not clever code.** Variable names that make sense. Functions that do one thing. No one-liners that take 30 seconds to parse.
- **Test with examples.** Walk through your code with the given example. Then try an edge case: empty input, single element, duplicates, negative numbers.
- **Discuss time/space complexity.** Don't wait to be asked. "This runs in O(n log n) because of the sort. We could get O(n) with a hash map if we trade space for time."

**Common mistake:** Coding in silence. Not testing. Panicking when stuck instead of stepping back and re-reading the problem. Writing "clever" code that you can't explain.

### 7. "Why should we hire you?"

**Framework: Unique Value + Evidence**

Don't be generic. Connect your specific experience to what they need.

"Three things set me apart. First, I have depth across the stack. I've built things from the TCP socket level up to React 19 UIs, so I can debug problems at any layer. Second, I ship real code. 48 PRs at fiddle-factory, a merged contribution to Apache ECharts. I'm not just building side projects. Third, I learn fast. I went from mechanical engineering to contributing to 65k-star open source projects in about three years. I don't just use tools. I understand how they work, which means I debug faster and make better architectural decisions."

**Common mistake:** Being humble to the point of invisibility. This is the one question where you're supposed to sell yourself. Have your three points ready. Say them with confidence.

---

## Part 4: Mock Interview, Full Q&A

### Round 1: Phone Screen

> Q: Tell me about yourself.

*Interviewer's Note: I'm checking if they can be concise, coherent, and interesting in 90 seconds. Most candidates ramble.*

"I'm a full-stack developer finishing my B.Tech at NIT Durgapur. I've been working as a contractor at fiddle-factory for the past 8 months, shipping features across their canvas editor, component libraries, and build pipeline. Before that, I interned there and led a major migration from react-flow to tldraw.

What got me into programming was curiosity about how things actually work. So I built a TCP chat server from raw sockets in Rust and Go, an FFT audio visualizer in C, and a search engine from scratch in Rust. I also contributed a merged fix to Apache ECharts, which has 65k stars.

I'm looking for a full-stack role where I can bring that same depth to building products people use every day."

*Common mistake to avoid: Going over 90 seconds. Listing technologies instead of telling a story.*

---

> Q: Why are you interested in this role?

*Interviewer's Note: I want to know if they've researched us or if they're spray-and-praying applications.*

"I've been looking at what your team is building, and two things stand out. First, [specific product feature or technical challenge from the company]. That's the kind of problem I enjoy. At fiddle-factory, I worked on a canvas-based editor where the hard part wasn't building features but making them work reliably across different user states and browser environments. Second, I want to work somewhere my systems-level knowledge actually matters. I've built things from raw sockets and C, and I want a team that values understanding the full stack, not just the framework layer."

*Common mistake to avoid: Generic answers like "I want to grow" or "your company is innovative." Be specific about THEIR product and YOUR fit.*

---

> Q: What's your strongest technical skill?

*Interviewer's Note: I'm testing self-awareness and depth. Can they pick one thing and go deep?*

"TypeScript and React for production work. But what makes that useful is the depth underneath. I've built things from the ground up in Rust and C, so when I'm debugging a React performance issue or designing a component architecture, I'm thinking about what's actually happening. Memory, rendering cycles, event propagation. Not just the API surface.

For example, at fiddle-factory I fixed a canvas loading bug that only affected new users. The root cause was a race condition between tldraw's onMount callback and React Query's cache state. Understanding how both systems work under the hood is what let me find it."

*Common mistake to avoid: Saying "I'm good at everything" or picking something you can't back up with a story.*

---

> Q: Tell me about a time you had to learn something quickly.

*Interviewer's Note: Learning velocity is one of the most important signals. I want specifics, not "I'm a fast learner."*

"During my internship at fiddle-factory, I was tasked with migrating the canvas system from react-flow to tldraw. I'd never used tldraw before. I had maybe two weeks to understand the library, plan the migration, and ship it.

My approach was to spend the first two days just reading tldraw's source code and documentation. Not coding, just understanding the mental model: how shapes work, how the editor state is managed, how custom tools are built. Then I mapped out what needed to change: old node components had to become custom tldraw shapes, the data format needed conversion utilities, and preview components had to be rebuilt.

I shipped the migration on time. The key was resisting the urge to start coding immediately. Those two days of reading saved me a week of wrong turns."

*Common mistake to avoid: Skipping the HOW. "I learned it fast" means nothing. Walk through your actual process.*

---

> Q: How do you use AI tools in your development workflow?

*Interviewer's Note: I want nuance. Not "AI is amazing" and not "I don't use AI." I want to know if they think critically about it.*

"I use AI tools daily, but with guardrails. For boilerplate, repetitive patterns, and exploring unfamiliar APIs, AI is great. It saves me time on things I could do but don't need to think hard about.

Where I'm careful is anything involving architecture decisions, security, or complex state management. AI tools tend to give you the most common pattern, not necessarily the right one for your context. At fiddle-factory, I built a Claude health check endpoint. I know how these APIs work. When I use AI-generated code, I read it the same way I'd read a PR from a junior developer: assume it might be wrong, verify the logic, test the edge cases.

The biggest mistake I see is people using AI to write code they don't understand. If you can't explain it, you can't debug it."

*Common mistake to avoid: Either dismissing AI entirely or sounding like you can't code without it. Show balance.*

---

### Round 2: Technical Deep Dive

> Q: Explain how React's reconciliation works and how it affected a decision you made.

*Interviewer's Note: This separates "I use React" from "I understand React." I want them to connect theory to practice.*

"React's reconciliation is how it figures out what actually changed in the DOM. When state updates, React builds a new virtual DOM tree and diffs it against the previous one. It uses a heuristic algorithm: elements of different types produce different trees, and the `key` prop helps React identify which items in a list moved, were added, or were removed.

The important thing is that reconciliation is O(n), not O(n^3) like a naive tree diff. React achieves this by assuming two elements of different types will produce entirely different subtrees, so it doesn't bother diffing into them.

This affected my work at fiddle-factory when I was building the visual component grid (PR #236). I replaced a text-only MentionMenu with a grid of component thumbnails. The grid items were dynamically generated from component data, and without proper keys, React was re-mounting every thumbnail on each filter change instead of just reordering them. Adding stable keys based on component IDs turned a janky experience into a smooth one."

*Common mistake to avoid: Reciting the docs without connecting to real experience. Or getting lost in implementation details without explaining the high-level concept first.*

---

> Q: You built a TCP chat server in both Rust and Go. Walk me through the concurrency model differences.

*Interviewer's Note: This is a systems question disguised as a project question. I want to see if they understand OS-level concepts.*

"In the Rust version, I used `std::thread` for OS threads. Each client connection gets its own thread. Shared state, like the list of connected clients, lives behind an `Arc<Mutex<>>`. Arc gives thread-safe reference counting, Mutex gives exclusive access. The tradeoff: OS threads are heavy. Each one gets a stack (usually 2-8MB), and context switching between them involves the kernel scheduler.

In the Go version, I used goroutines. Each client connection gets a goroutine. Goroutines are green threads managed by Go's runtime scheduler, not the OS. They start with a tiny stack (a few KB) that grows as needed. Communication happens through channels instead of shared memory with locks.

The practical difference: the Go version can handle way more concurrent connections with less memory. But the Rust version gives you more control and predictability. There's no garbage collector, no runtime scheduler making decisions for you.

For a chat server, Go's model is probably the better fit because you're I/O bound, not CPU bound. Goroutines shine when you're waiting on network calls. But I built both specifically to understand the tradeoff, not because one is universally better."

*Common mistake to avoid: Saying one is "better" without context. Interviewers want tradeoff thinking, not opinions.*

---

> Q: How does TF-IDF work, and what were the hardest parts of implementing it from scratch?

*Interviewer's Note: Can they explain an algorithm clearly AND talk about implementation challenges? Theory plus practice.*

"TF-IDF stands for Term Frequency, Inverse Document Frequency. It's a way to score how relevant a word is to a document in a collection.

Term Frequency is straightforward: how often does this word appear in this document? More occurrences means more relevant. Inverse Document Frequency is the interesting part: if a word appears in almost every document (like 'the' or 'is'), it's not very useful for distinguishing documents. IDF penalizes common words and boosts rare ones. You calculate it as log(total documents / documents containing the term).

Multiply TF by IDF, and you get a score that's high when a word is frequent in a specific document but rare across the collection.

The hardest part of implementing it in seroost wasn't the math. It was tokenization. Naive splitting on whitespace doesn't handle punctuation, case sensitivity, possessives, or hyphenated words. I went through several iterations of the tokenizer before it produced clean tokens. The second challenge was building an efficient inverted index. For each term, you need a list of (document_id, positions) pairs. Getting the data structure right so that lookups are fast but memory usage is reasonable took some thought.

I used only 3 external Rust crates for the whole project: tiny_http for serving, xml for parsing, serde_json for serialization. Everything else, the tokenizer, the index, the scoring, I built from scratch."

*Common mistake to avoid: Only explaining the math without talking about real implementation challenges. Or hand-waving the hard parts.*

---

> Q: At fiddle-factory, you fixed a canvas loading bug that only affected new users. Walk me through your debugging process.

*Interviewer's Note: This is my favorite type of question. I'm not testing if they know the answer. I'm testing HOW they debug.*

"New users were seeing broken canvas states on their first visit. Returning users were fine. That asymmetry was the first clue.

I started by reproducing it. Cleared my browser storage, visited as a new user, and saw the broken state. Then I visited again without clearing storage, and it worked. So something about the first visit was different.

I looked at the data flow. The canvas uses tldraw, and tldraw has an `onMount` callback where we hydrate it with project data. That data comes from React Query. And here's the thing: React Query caches responses. On a returning user's visit, the data is already in the cache from their previous session. On a first visit, the cache is cold. The data has to be fetched.

The bug was a race condition. tldraw's `onMount` was firing before the React Query fetch completed. For returning users, the cached data was available instantly, so `onMount` had what it needed. For new users, the fetch was still in flight.

The fix was to defer canvas hydration until the data was confirmed available. I added a check that waits for the React Query response before allowing tldraw to mount with project data. Simple fix, but finding the root cause required understanding three systems: React's lifecycle, tldraw's initialization, and React Query's caching behavior."

*Common mistake to avoid: Jumping to the solution without explaining the investigation. The debugging PROCESS is what I'm evaluating, not the fix itself.*

---

> Q: You set up Storybook across 4 repos at fiddle-factory. Why does that matter?

*Interviewer's Note: I'm testing if they think about developer experience and team productivity, not just features.*

"Component libraries without visual documentation are a guessing game. Developers end up reading source code to figure out what props a component takes and what it looks like in different states. That's slow and error-prone.

I set up Storybook across shadcn-ui, eleven-labs-ui, design-engineer, and the main fiddle repo. For shadcn-ui alone, I wrote stories for all 56 UI primitive components. Every variant, every state. Now any developer on the team can open Storybook, see every component, and know exactly how to use it.

But the bigger win was the screenshot pipeline. I built a MutationObserver-based system (PR #184) that detects when Storybook content is fully rendered, then integrated Storycap for automated screenshots. This replaced a complex runtime iframe capture approach. Simpler, more reliable, and it runs on static builds so it's fast.

The reason this matters: it's infrastructure that makes the whole team faster. Every new component gets visual documentation automatically. Every PR can include visual regression checks. It's the kind of work that doesn't show up in feature demos but saves hours every week."

*Common mistake to avoid: Treating infrastructure work as less important than feature work. If anything, it shows more maturity.*

---

### Round 3: System Design

> Q: Design a collaborative drawing tool (like the canvas editor you worked on at fiddle).

*Interviewer's Note: They've actually built something like this. I want to see if they can abstract from their experience to a general design.*

"Let me start by clarifying scope. Are we talking about real-time collaboration where multiple users draw simultaneously? What's the expected number of concurrent users per canvas? Do we need version history?

Assuming real-time collaboration with up to 50 concurrent users per canvas and basic version history:

**High-level architecture:** React frontend with a canvas rendering library (like tldraw or Fabric.js) talking to a WebSocket server for real-time updates. A REST API for CRUD operations on canvases. PostgreSQL for persistent storage. Redis for pub/sub between WebSocket server instances if we need to scale horizontally.

**The hard part is conflict resolution.** Two users drawing at the same time shouldn't overwrite each other. I'd use CRDTs (Conflict-free Replicated Data Types) for the canvas state. Each shape is an independent CRDT object. Operations like 'add shape,' 'move shape,' 'delete shape' are commutative, so they can be applied in any order and converge to the same state.

**Data model:** Each canvas has a list of shapes. Each shape has an ID, type, position, style properties, and a vector clock for ordering. Operations are stored as an append-only log for version history.

**Real-time flow:** User draws a shape. Client creates the shape locally (optimistic update) and sends the operation over WebSocket. Server broadcasts to all other connected clients. Each client applies the operation to their local state.

**Scaling:** For horizontal scaling of WebSocket servers, use Redis pub/sub so that a message received by one server gets broadcast to clients connected to other servers. For storage, partition canvases across database shards by canvas ID.

**Tradeoffs I'd discuss:** CRDTs add complexity but eliminate the need for a central authority to resolve conflicts. An alternative is Operational Transform (OT), which Google Docs uses, but OT requires a central server to transform operations, which is a bottleneck. For a drawing tool where operations are mostly independent (shapes don't overlap in the data model), CRDTs are a better fit."

*Common mistake to avoid: Designing the entire system in equal detail. Pick the hardest part (conflict resolution) and go deep. Skim the rest.*

---

> Q: Design a real-time chat system.

*Interviewer's Note: They built a TCP chat server from scratch. I want to see if they can scale the concept.*

"Let me clarify: are we talking about 1-on-1 chat, group chat, or both? What's the scale? Do we need message persistence, read receipts, typing indicators?

Assuming group chat with persistence, read receipts, and typing indicators for up to 100k concurrent users:

**Client layer:** React app with a WebSocket connection for real-time messaging. Messages are sent over WebSocket and also persisted via REST API.

**API Gateway:** Routes HTTP requests to the appropriate service. Handles authentication (JWT tokens).

**Chat Service:** Manages WebSocket connections. When a message comes in, it writes to the message store and broadcasts to all members of the chat room. For typing indicators and read receipts, these are ephemeral events that go through WebSocket only, no persistence needed.

**Message Store:** PostgreSQL with a messages table partitioned by chat_room_id and created_at. Index on (chat_room_id, created_at) for efficient pagination. For high write throughput, I'd put a write-ahead buffer (like Kafka) in front of the database.

**Presence Service:** Tracks who's online. Redis with TTL-based keys. Each user's WebSocket connection refreshes their presence key every 30 seconds. If the key expires, they're offline.

**Scaling WebSockets:** This is the hardest part. A single server can handle maybe 10-50k concurrent WebSocket connections. For 100k users, we need multiple servers. Use Redis pub/sub: when Server A receives a message for a room, it publishes to a Redis channel. Server B, which has other room members connected, subscribes to that channel and forwards the message.

**Message delivery guarantees:** At-least-once delivery. Each message gets a unique ID. Clients deduplicate on the ID. If a WebSocket connection drops, the client reconnects and fetches missed messages via REST API using the last received message ID.

Having built 4at from raw TCP sockets, I understand what's happening at the protocol level beneath all these abstractions. WebSockets are just an upgrade from HTTP, and underneath, it's still TCP. The framing, the keep-alive, the connection management, I've dealt with all of that manually."

*Common mistake to avoid: Forgetting about failure cases. What happens when a WebSocket server crashes? What about message ordering? Always address the unhappy path.*

---

> Q: Design a search engine (you built one, so let's scale it).

*Interviewer's Note: Perfect question for this candidate. They built seroost. Now I want to see if they can think beyond a single-machine implementation.*

"I built seroost as a single-machine TF-IDF search engine. Let me scale that up.

**Clarifying:** What are we indexing? Web pages? Internal documents? What's the corpus size? What latency do users expect?

Assuming we're building a document search engine for 10 million documents with sub-200ms query latency:

**Indexing pipeline:** Documents come in through an ingestion API. A processing pipeline tokenizes the text (I learned from seroost that tokenization is harder than it sounds: punctuation, case normalization, stop words, stemming). Then we build an inverted index: for each term, store a list of (document_id, term_frequency, positions).

**Index storage:** The inverted index is too large for a single machine at 10M documents. Shard it. Partition by document ID range. Each shard holds the inverted index for its subset of documents. Store shards on separate machines.

**Query flow:** User sends a query. A query coordinator parses it, sends it to all shards in parallel. Each shard computes TF-IDF scores for its documents and returns the top K results. The coordinator merges results from all shards, re-ranks, and returns the final top K.

**Ranking:** Start with TF-IDF (which I've implemented from scratch). But for better results, upgrade to BM25, which handles document length normalization better. For even better results, add a second-pass re-ranker using a lightweight ML model.

**Scaling reads:** Replicate each shard. Multiple replicas serve queries in parallel. Load balancer distributes queries across replicas.

**Scaling writes:** New documents go into a write-ahead log. A background process builds index segments and merges them periodically (similar to how Lucene works with segments). This way, writes don't block reads.

**Caching:** Cache frequent queries and their results in Redis. Cache the inverted index postings lists for popular terms in memory.

**The tradeoff I'd highlight:** Freshness vs. performance. If we need real-time indexing (document is searchable immediately after upload), we need a more complex architecture with a real-time index that gets periodically merged into the main index. If a few minutes of delay is acceptable, batch indexing is simpler and more efficient."

*Common mistake to avoid: Not connecting to your actual experience. I built the single-machine version. I know what TF-IDF scoring looks like in code. That grounds the design in reality, not just theory.*

---

### Round 4: Behavioral

> Q: Tell me about the most challenging bug you've ever fixed.

*Interviewer's Note: I want specificity, honesty about the struggle, and a clear debugging methodology.*

"The canvas loading bug at fiddle-factory. New users were seeing broken canvas states, but returning users were fine.

What made it hard was that three systems were interacting: React's component lifecycle, tldraw's initialization, and React Query's caching layer. The bug only appeared when the React Query cache was cold, which meant it only hit first-time users. As a developer with a warm cache, I couldn't reproduce it initially.

Once I cleared my browser storage and saw it, I started tracing the data flow. tldraw's `onMount` callback was firing, but the project data it needed hadn't arrived yet. React Query was still fetching. For returning users, the cache had the data from their last visit, so `onMount` had what it needed immediately.

The fix was straightforward once I understood the cause: defer canvas hydration until the data is confirmed available. But finding the root cause took me through React Query's cache invalidation logic, tldraw's internal mounting sequence, and React's rendering order.

What I learned: always test the cold-cache path. It's easy to develop with warm caches and miss bugs that only affect new users."

*Common mistake to avoid: Picking a trivial bug. Or not explaining why it was hard. The struggle is the point of this question.*

---

> Q: Tell me about a time you had to work with a codebase you'd never seen before.

*Interviewer's Note: Every new job starts with an unfamiliar codebase. I want to know their onboarding strategy.*

"When I contributed to Apache ECharts. It's a 65k-star charting library with a massive codebase. I'd never looked at it before.

I started with the issue I wanted to fix: candlestick charts rendering incorrectly when using `series.encode`. Instead of trying to understand the entire codebase, I traced the specific code path. I found the candlestick renderer, understood how it reads data through the encode mapping, and identified where the mapping was being ignored.

My approach was: start from the bug, trace backward through the call stack, understand just enough of the surrounding code to make a safe fix. I didn't try to understand the entire rendering pipeline. I understood the slice I needed.

The fix was reviewed by the maintainers and merged. What helped was reading existing tests to understand expected behavior, and reading recent PRs to understand the team's coding style and review expectations.

I use the same approach at fiddle-factory when I context-switch between their 6 repos. You can't hold the entire codebase in your head. You learn to navigate efficiently."

*Common mistake to avoid: Claiming you understood the whole codebase. Nobody does. Show that you can be effective without understanding everything.*

---

> Q: Describe a time you disagreed with a technical decision. How did you handle it?

*Interviewer's Note: I'm testing emotional intelligence and collaboration skills. Can they disagree without being difficult?*

"At fiddle-factory, the screenshot pipeline for component thumbnails was using runtime iframe capture. It was complex, flaky, and slow. I thought there was a simpler approach.

Instead of just saying 'this is wrong,' I built a proof of concept. I set up Storycap to take screenshots from static Storybook builds. Same output, simpler pipeline, more reliable. Then I showed the comparison: here's the current approach with its failure modes, here's the alternative with its tradeoffs.

The team agreed to switch. PR #185 replaced the old system.

What I've learned is that disagreements go better when you bring an alternative, not just criticism. 'This is bad' starts an argument. 'Here's another way, and here are the tradeoffs' starts a conversation."

*Common mistake to avoid: Either saying "I've never disagreed" (unbelievable) or telling a story where you were clearly difficult to work with. Show diplomacy.*

---

> Q: Why software engineering? You're from a mechanical engineering background.

*Interviewer's Note: The career pivot is interesting. I want to understand the motivation. Is it genuine curiosity or just chasing salaries?*

"Curiosity. That's the honest answer.

I got into mechanical engineering because I liked understanding how things work. Turns out, that same curiosity applies to software, except the feedback loop is faster. You can build something, run it, see it work (or break), and iterate in minutes instead of months.

What hooked me was going deep. I didn't just learn React and start applying for jobs. I wanted to know what happens when you open a TCP connection. So I built a chat server from raw sockets. I wanted to understand how search engines work. So I built one from scratch. I wanted to understand audio processing. So I wrote an FFT library in C.

The mechanical engineering background isn't wasted. It taught me to think in systems, to understand constraints, and to be comfortable with math. The transition wasn't 'I gave up on mech eng.' It was 'I found a field where my curiosity has no ceiling.'"

*Common mistake to avoid: Being defensive about the non-CS background. Own it. It's a strength. The curiosity-driven narrative is compelling and true.*

---

> Q: Tell me about a time you went above and beyond what was expected.

*Interviewer's Note: Ownership. Initiative. Does this person wait for instructions or do they see problems and fix them?*

"When I joined fiddle-factory, there was no Storybook setup. Components existed across multiple repos, but there was no visual documentation, no way to see all variants of a component without running the app and navigating to the right state.

Nobody asked me to set up Storybook. It wasn't on any sprint board. But I saw the problem: developers were spending time reading source code to understand components they could have just looked at visually.

I set up Storybook across 4 repos. For the shadcn-ui repo alone, I wrote stories for all 56 UI primitive components. Then I built the screenshot automation pipeline on top of it. Then I fixed rendering issues in the other repos so their stories worked correctly.

It took significant effort across multiple PRs. But now the team has a visual catalog of every component, automated screenshots for thumbnails, and a foundation for visual regression testing. That's the kind of work I do naturally. If I see something that would make the team more productive, I build it."

*Common mistake to avoid: Picking something small. "I stayed late once" isn't above and beyond. Pick something with real scope and impact.*

---

### Round 5: Reverse Interview

> Q: (Question Purbayan should ask) "What does the first 90 days look like for someone in this role?"

*Why this question works:* It shows you're thinking about impact, not just getting hired. You want to know how you'll ramp up, what you'll own, and when you're expected to be productive. It also reveals how structured (or unstructured) the team is.

*What to listen for:* If they have a clear onboarding plan, that's a good sign. If they say "you'll figure it out," that might be fine for a senior role but concerning for someone earlier in their career.

---

> Q: (Question Purbayan should ask) "What's the hardest technical problem your team is facing right now?"

*Why this question works:* It shows genuine interest in the work, not just the company. It also gives you a chance to respond with relevant experience. If they mention a canvas rendering challenge, you can say "I've worked on exactly that at fiddle-factory." If they mention scaling, you can talk about your system design thinking.

*What to listen for:* The specificity of their answer tells you a lot. A vague answer ("scaling") might mean they don't have clear technical direction. A specific answer ("we're trying to reduce our p99 latency on search from 800ms to 200ms") means they know their problems and are actively working on them.

---

*Last updated: February 2026*
