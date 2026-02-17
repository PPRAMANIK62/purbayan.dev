# Projects Deep Dive: Interview-Ready Reference

Everything here is written in first person so you can practice saying it out loud.

---

## fiddle-factory (Main Work Experience)

### What It Is

fiddle-factory is a component design tool built on a tldraw canvas where users design UI components with AI assistance from Claude. Think Figma meets an AI code generator. Users draw, describe, and iterate on components visually, then export production-ready code.

### Rapid-Fire Details

| Detail | Value |
|--------|-------|
| Language | TypeScript (Remix/React) |
| Repos | fiddle, shadcn-ui, eleven-labs-ui, design-engineer, dashboard, repo-build-server |
| Canvas | tldraw |
| AI | Claude (Anthropic) |
| Sandbox | e2b (previously StackBlitz WebContainers) |
| Auth | PKCE flow |
| Role | Intern (May-Aug 2025), Contractor (Dec 2025-Present) |

### Architecture

The main `fiddle` app is a Remix application. The canvas layer uses tldraw for freeform drawing and component placement. When a user designs something on the canvas, it gets sent to Claude via a chat interface. Claude generates code, which runs in an e2b cloud sandbox for live preview. The generated components pull from a shared component library (`shadcn-ui` repo with 56 primitives). There's a separate `repo-build-server` that handles building user projects, and a `dashboard` app for admin/access control.

Data flow: Canvas drawing -> chat attachment -> Claude API -> generated code -> e2b sandbox -> live preview -> export.

### Technical Decisions & Why

**tldraw over react-flow.** react-flow is a node-graph library. It's great for flowcharts and diagrams, but fiddle needed freeform drawing, custom shapes, and a more Figma-like experience. tldraw gives you an infinite canvas with built-in tools, selection, zoom, pan, and a shape system you can extend. The tradeoff was a harder migration (custom shapes, data converters, new tool system) but a much better UX.

**e2b over StackBlitz WebContainers.** WebContainers run entirely in the browser, which sounds great until you hit memory limits, package installation issues, and browser compatibility problems. e2b runs real Linux sandboxes in the cloud. The tradeoff: network latency and 2-hour session timeouts. But the reliability and compatibility gains were worth it. I built custom templates and session management to handle the timeout issue.

**Remix over Next.js.** This was a decision made before I joined. Remix's loader/action pattern fits well for a tool where you're constantly loading project data and submitting changes. The nested routing maps naturally to the app's layout (canvas + sidebar + chat).

**Storybook 9 with Tailwind v4.** When I set up Storybook across the repos, Storybook 9 was the latest and had better ESM support. Tailwind v4 was already in use in some repos. The challenge was that each repo was on a different Tailwind version, so I had to handle migration in `design-engineer` (v3 to v4) while keeping `shadcn-ui` on v4 from the start.

### Problems Faced & How Overcome

**Canvas loading bug for new users (PRs #246, #259).** This was the nastiest bug I debugged. New users would open the app and the canvas would be blank or broken. Root cause: tldraw's `onMount` callback fires exactly once, and it fires early. For new users, the React Query cache is cold, so `projectData` is still `undefined` when `onMount` runs. The canvas tries to hydrate with nothing. Fix: I deferred canvas hydration until React Query had resolved. I added a loading gate that checks data readiness before allowing tldraw to initialize. For returning users with warm caches, it worked fine, which is why this only hit new users.

**Clipboard not working after iframe interaction (PR #218).** Users would interact with the live preview iframe (which runs the e2b sandbox output), then try to copy something on the canvas, and nothing would happen. The iframe steals document focus. The browser's clipboard API requires the document to have focus. Fix: I added a focus restoration handler that re-establishes `document.focus()` when the user clicks back on the canvas area. Subtle but critical for UX.

**Double submission on chat (PR #191).** Users could hit Enter twice fast and send the same message twice. Classic race condition. Fix: added a `submitting` state flag that disables the input immediately on first submit, plus a debounce guard. The flag clears when the response starts streaming back.

**Sandbox timeout and auto-recreation (PR #274).** e2b sandboxes expire after 2 hours silently. No error, no callback. The sandbox just stops responding. Users would come back to a dead preview. Fix: I built timeout detection that checks sandbox health before operations, and an auto-recreation flow that spins up a fresh sandbox and re-injects the current code when a timeout is detected.

**Toast migration from react-toastify to sonner (PR #243).** Not a drop-in replacement. react-toastify uses `toast.success("msg")` with a container component. sonner uses `toast.success("msg")` too, but the configuration, positioning, theming, and promise-toast patterns are completely different. I had to audit every toast call across the app and update the patterns, not just the import.

**Build pipeline simplification (PR #185).** The screenshot system had two sources: runtime iframe captures (complex, flaky, timing-dependent) and Storycap (static, deterministic). I removed the iframe capture path entirely and standardized on Storycap. Fewer moving parts, more reliable screenshots.

**Storybook across 4 repos with different configs.** Each repo had its own Tailwind version, path aliases, and theming approach. `shadcn-ui` was Tailwind v4 with CSS variables. `design-engineer` was Tailwind v3 and needed migration. `eleven-labs-ui` had a theme bug where dark mode wasn't applying. `fiddle` itself needed QueryClient fixes because Storybook doesn't have Remix's loader context. I used a MutationObserver pattern (PR #184) to detect when Storybook content was actually rendered and ready, rather than relying on arbitrary timeouts.

**Non-blocking message send (PR #227).** The chat's send flow was blocking: it waited for the full database write, cache invalidation, and response before the UI updated. I restructured it to cache the message optimistically, fire the API call async, and stream the response back. The user sees their message instantly.

### What I'd Do Differently

I'd push harder for a shared configuration package across the repos. Each repo having its own Tailwind config, Storybook config, and build setup created a lot of drift. A monorepo or at least a shared `@fiddle/config` package would have saved hours of "why does this work in repo A but not repo B."

For the canvas loading bug, I'd have written an integration test that simulates a cold cache from day one. The bug only appeared for new users, which means the dev team (all with warm caches) never saw it. A test that clears the cache before mounting would have caught it immediately.

I'd also have documented the e2b sandbox lifecycle more thoroughly. The 2-hour timeout was a known constraint, but there was no runbook for what happens when it expires. That knowledge was tribal.

### Anticipated Q&A

**Q: Walk me through the canvas migration from react-flow to tldraw.**
**A:** react-flow models everything as nodes and edges, like a graph. fiddle needed freeform drawing, custom component shapes, and a Figma-like feel. tldraw provides an infinite canvas with a shape system you can extend. I removed the old node-based system entirely, built custom tldraw shapes for each component type, created tools for placing and manipulating them, built preview renderers for each shape, and wrote data converters to translate the old react-flow node format into tldraw's shape format. The hardest part was the data conversion. react-flow stores position, dimensions, and connections. tldraw stores shapes with props, rotation, opacity, and parent-child relationships. I had to map every field and handle edge cases like grouped nodes becoming tldraw frames.

**Q: How did you handle the canvas loading bug for new users?**
**A:** tldraw's `onMount` fires once, early in the component lifecycle. For returning users, React Query has cached project data, so it's available immediately. For new users, the cache is cold, and the data fetch hasn't resolved yet. So `onMount` fires with no data, and the canvas initializes empty. Since `onMount` only fires once, the data arriving later doesn't trigger re-hydration. I fixed it by adding a loading gate: the tldraw editor component doesn't mount until React Query reports the data as ready. This means `onMount` always has data to work with. I also added a fallback that checks for empty canvas state and retries hydration if data arrives late.

**Q: Explain your Storybook setup across 4 repos.**
**A:** Each repo had different needs. `shadcn-ui` had 56 primitive components on Tailwind v4 and Storybook 9. I wrote stories for every component with multiple variants. `design-engineer` needed a Tailwind v3 to v4 migration before Storybook would even render correctly. `eleven-labs-ui` had a theme bug where the dark mode CSS variables weren't being injected into the Storybook iframe. `fiddle` itself needed a custom decorator that provides a QueryClient, because many components depend on Remix loaders that don't exist in Storybook. The MutationObserver pattern (PR #184) was key: instead of guessing when a story is "ready" with timeouts, I observe the DOM for the actual rendered content. When the target elements appear, I know the story is ready for screenshots or interaction.

**Q: How did you improve message send performance?**
**A:** The original flow was synchronous: user sends message, we write to the database, invalidate the React Query cache, wait for the cache to refetch, then show the updated chat. That's multiple round trips before the user sees anything. I restructured it: on send, I optimistically add the message to the local cache immediately so the UI updates. The database write happens async. The Claude API call fires in parallel. The response streams back token by token. The user sees their message instantly and the AI response starts appearing within a second or two. The tradeoff is handling the case where the database write fails after we've already shown the message, but that's rare and I handle it with a retry + error toast.

**Q: Tell me about a complex bug you fixed.**
**A:** The sandbox auto-recreation bug (PR #274). e2b sandboxes have a 2-hour lifetime. When they expire, there's no error event or callback. The sandbox just stops responding to API calls. Users would come back after a break and find a dead preview. Debugging was tricky because the sandbox object still existed in memory, it just couldn't execute anything. I added health checks that ping the sandbox before operations. If the ping fails, I trigger a recreation flow: spin up a new sandbox from the same template, re-inject the current code from the latest state, and swap the sandbox reference. The user sees a brief loading state and then everything works again. The subtle part was making sure in-flight operations don't race with the recreation.

**Q: How do you approach working across multiple repos?**
**A:** Consistency is everything. I try to use the same patterns in every repo: same ESLint config where possible, same commit message style, same PR description format. When I make a change that affects multiple repos (like the Storybook setup), I do them in dependency order: shared libraries first, then consumers. I write detailed PR descriptions that explain not just what changed but why, because the next person touching that code might be in a different repo and needs context. I also keep a mental map of which repo owns which concern, so I don't accidentally duplicate logic.

**Q: What was the most impactful PR you shipped?**
**A:** Two candidates. The Storybook setup for `shadcn-ui` with 56 components was high-impact because it gave the team a visual catalog of every primitive. Before that, you had to read the source code to know what a component looked like or what props it accepted. After, you could browse, interact, and screenshot every variant. The canvas loading fix (PRs #246, #259) was high-impact in a different way: it was blocking every new user from having a working first experience. Fixing it directly improved activation rates.

**Q: How did you build the Figma-to-code plugin?**
**A:** The plugin runs inside Figma's plugin sandbox. It reads selected frames from the Figma API, extracts the design tree (layers, styles, constraints, auto-layout properties), and runs it through a codegen pipeline that converts Figma's layout model into React components with Tailwind classes. Multi-frame export was important because users often have multiple variants of a component. The tweakpane UI lets users configure the output: which CSS framework, whether to inline styles or use classes, component naming conventions. The hardest part was mapping Figma's constraint-based layout to Tailwind's utility classes. Figma uses absolute positioning with constraints; Tailwind uses flexbox and grid. The conversion isn't 1:1, so I had to make heuristic decisions about when a constraint-based layout should become flex vs grid.

---

## wayforged

### What It Is

A TUI-based installer for setting up a complete Fedora Hyprland development environment. You run one script and it configures everything: window manager, terminal, shell, fonts, editors, languages, services.

### Rapid-Fire Details

| Detail | Value |
|--------|-------|
| Language | Shell (95.6%), CSS (4.4%) |
| TUI Framework | charmbracelet/gum |
| Phases | 14 installation phases |
| Config Files | 22 managed configs |
| Modes | Full, Minimal, Custom |
| Design | Idempotent with error recovery |

### Architecture

Entry point is `install.sh`, which sources a `lib/` directory containing presentation helpers, logging, error handling, and utilities. The actual work happens in `phases/`, which contains 14 scripts that run in dependency order:

1. Repositories (DNF repos, RPM Fusion)
2. Hyprland (compositor, config, waybar, wofi)
3. Tokyo Night (GTK theme, icons, cursors)
4. Nerd Fonts (Iosevka, JetBrains Mono)
5. Ghostty (terminal emulator)
6. Zsh (oh-my-zsh, plugins, .zshrc)
7. CLI Tools (bat, eza, fd, ripgrep, fzf, etc.)
8. Node.js (fnm, LTS install)
9. Editors (Neovim, VS Code)
10. Git (config, GPG, SSH keys)
11. Apps (Firefox, Spotify, Discord)
12. Languages (Rust, Go, Python)
13. Services (Docker, Bluetooth, etc.)
14. Finalize (cleanup, summary)

Each phase is self-contained but assumes earlier phases have run. The `lib/` layer provides `gum`-powered UI: spinners, confirmations, multi-select menus, styled output.

### Technical Decisions & Why

**Shell over Python/Ansible.** The target audience is developers setting up a fresh Fedora install. Shell is guaranteed to be there. Python might not be installed yet. Ansible is overkill for a single-machine setup. The tradeoff: shell scripting is painful for complex logic, error handling is manual, and testing is basically "run it and see."

**charmbracelet/gum for TUI.** gum gives you styled prompts, spinners, confirmations, and multi-select menus as simple CLI commands. No curses library, no complex TUI framework. Just `gum choose "Option A" "Option B"` and you get a beautiful selector. The tradeoff: it's an external dependency that needs to be installed early in the process.

**14 discrete phases.** Each phase is a separate script file. This makes it easy to re-run a single phase if it fails, skip phases you don't need, and reason about what each phase does. The alternative was one monolithic script, which would be unmaintainable.

**Three modes.** Full installs everything. Minimal installs just the essentials (Hyprland, terminal, shell, fonts). Custom lets you pick phases with a gum multi-select. This covers the spectrum from "I want everything" to "I just need Hyprland and Ghostty."

### Problems Faced & How Overcome

**Making shell scripts idempotent.** If a user runs the installer twice, it shouldn't break anything or duplicate work. For package installs, `dnf install` is naturally idempotent (it skips already-installed packages). For config files, I check if the file exists and diff it against the expected content before overwriting. For git clones, I check if the directory exists. For services, I check `systemctl is-enabled` before enabling. Every operation has a "is this already done?" check.

**Phase ordering dependencies.** Phase 7 (CLI Tools) needs Phase 1 (Repositories) to have added the correct repos. Phase 8 (Node.js) needs Phase 7 to have installed `curl`. Phase 12 (Languages) needs Phase 1 for some package sources. I solved this with explicit dependency documentation in each phase script's header comment, and the main installer enforces the order. In custom mode, if you select Phase 8, it automatically includes Phase 1 and Phase 7.

**gum TUI styling across terminal sizes.** gum's multi-select and input prompts can overflow on narrow terminals. I added terminal width detection and adjust the prompt layout accordingly. On very narrow terminals (< 80 cols), I fall back to simpler prompts.

**Detecting already-installed packages without breaking re-runs.** `rpm -q package-name` for RPM packages, `which binary-name` for standalone binaries, checking `$HOME/.config/` for config-based tools. Each detection method is different, so I built a `lib/utils.sh` with helper functions like `is_installed()`, `is_service_running()`, `config_exists()`.

### What I'd Do Differently

I'd add a `--dry-run` mode that shows what would be installed without doing it. Users want to preview before committing to a 30-minute install.

I'd also add a rollback mechanism. Right now, if Phase 8 fails, Phases 1-7 are already applied. A rollback log that tracks every change would let users undo a partial install.

Testing is the big gap. Shell scripts are hard to test, but I could have used `bats` (Bash Automated Testing System) for unit tests on the utility functions.

### Anticipated Q&A

**Q: Why shell scripting instead of something like Ansible or Nix?**
**A:** Ansible requires Python and a YAML learning curve. Nix is powerful but has a steep learning curve and doesn't map well to "install these Fedora packages and copy these config files." Shell is universally available on a fresh Fedora install, and the operations I'm doing (dnf install, cp, ln -s, systemctl enable) are all native shell commands. The tradeoff is maintainability, but I mitigated that with a clean lib/phases architecture.

**Q: How do you handle failures mid-install?**
**A:** Each phase has error recovery built in. If a command fails, the user gets three options via gum: retry, skip, or log-and-continue. Critical failures (like no internet) abort the whole install with a clear message. Non-critical failures (like a font download timing out) can be skipped and retried later by re-running just that phase. Every action is logged to `~/.wayforged/install.log` with timestamps.

**Q: How did you make it idempotent?**
**A:** Every operation checks its precondition first. Package installs use `rpm -q` to check if already installed. Config file copies check if the target exists and compare checksums. Service enables check `systemctl is-enabled`. Git clones check if the directory exists. If the precondition is met, the operation is skipped with a "already done" message. This means you can run the installer 10 times and get the same result as running it once.

**Q: What's the hardest part of maintaining a shell-based installer?**
**A:** Package names change, repos move, download URLs break. Fedora updates twice a year, and each release can change package names or deprecate repos. I pin versions where possible and use variables for URLs so they're easy to update. The other hard part is error handling. Shell doesn't have try/catch. You use `set -e` for fail-fast, trap for cleanup, and explicit `|| handle_error` patterns. It's verbose but it works.

---

## Canvas Kit

### What It Is

A browser-based drawing application with a proper layer system, multiple tools, and PNG export. Built to explore how layers work on an immediate-mode HTML5 Canvas.

### Rapid-Fire Details

| Detail | Value |
|--------|-------|
| Stack | Next.js 15.2.3, React 19, TypeScript, Tailwind CSS 4, Framer Motion 12 |
| Live | canvas-kit.vercel.app |
| Canvas Model | Immediate-mode with offscreen buffers |
| Tools | Brush (B), Eraser (E), Rectangle (R), Circle (C) |
| Blog | "Layers on an Immediate-Mode Canvas" |

### Architecture

The core insight is that HTML5 Canvas is immediate-mode: once you draw a pixel, it's baked into the bitmap. There's no scene graph, no "objects" to select or move. To support layers, I use one visible canvas as a compositor and one `OffscreenCanvas` per layer as a buffer.

When the user draws on "Layer 3," the strokes go to Layer 3's offscreen buffer. Every frame, the compositor clears the visible canvas, then iterates through layers bottom-to-top, calling `drawImage()` for each visible layer's buffer onto the visible canvas. This gives you layer visibility toggles, reordering, and opacity controls for free.

Tools use a strategy pattern. Each tool (Brush, Eraser, Rectangle, Circle) implements the same interface: `onPointerDown`, `onPointerMove`, `onPointerUp`. The active tool is swapped by keyboard shortcut or toolbar click. The Eraser uses `globalCompositeOperation = 'destination-out'` on the active layer's buffer, which punches transparent holes.

Undo/redo uses a per-layer command pattern. Each command stores `{ layerId, imageData, before, after }`. Undo restores the `before` imageData to the layer's buffer. Redo restores the `after`. The command stack is per-layer, so undoing on Layer 2 doesn't affect Layer 1.

Export calls `canvas.toDataURL('image/png')` on the compositor canvas, which gives you the flattened result of all visible layers.

### Technical Decisions & Why

**Offscreen buffers per layer over a single canvas with save/restore.** The alternative is one canvas with `save()`/`restore()` and clipping regions. That doesn't give you true layer independence. With offscreen buffers, each layer is its own bitmap. You can toggle visibility, change opacity, reorder, and composite them however you want. The tradeoff is memory: each layer is a full-resolution bitmap. For a 1920x1080 canvas with 10 layers, that's ~80MB of pixel data. Fine for a drawing app, not fine for a production design tool.

**Command pattern for undo/redo over diffing.** I could diff the canvas state before and after each operation, but canvas diffs are expensive (comparing millions of pixels). Instead, I snapshot the affected region's imageData before the operation and after. The command stores both. This is fast and deterministic.

**Strategy pattern for tools.** Adding a new tool means implementing three methods. No switch statements, no if/else chains. The tool registry maps keyboard shortcuts to tool instances.

### Problems Faced & How Overcome

**Erasing across layers.** The eraser needs to make pixels transparent on the active layer only. Using `globalCompositeOperation = 'destination-out'` on the active layer's offscreen buffer does exactly this. But initially I was applying it to the compositor canvas, which erased across all layers. The fix was making sure all drawing operations (including erasing) target the active layer's buffer, never the compositor directly.

**Responsive canvas sizing.** HTML5 Canvas has two sizes: the CSS display size and the bitmap resolution. If you set `width: 100%` in CSS but don't update the `width`/`height` attributes, you get a stretched, blurry canvas. I sync the bitmap dimensions to the container size on mount and on resize, using `devicePixelRatio` for crisp rendering on high-DPI screens. All offscreen buffers resize too, which means re-drawing their content at the new resolution.

**Keyboard shortcut conflicts.** Browser defaults (Ctrl+Z for undo, Ctrl+S for save) conflict with app shortcuts. I intercept keyboard events at the app level, `preventDefault()` for handled shortcuts, and pass through everything else. The tricky part is not blocking shortcuts when the user is typing in a text input (like a layer name field).

### What I'd Do Differently

I'd separate the drawing engine from React entirely. Right now, the canvas logic is tangled with React state and effects. A standalone `CanvasEngine` class with its own event system would be cleaner, more testable, and reusable outside React.

I'd add pressure sensitivity for stylus input using the Pointer Events API's `pressure` property. The data is there; I just didn't map it to brush size/opacity.

I'd also explore WebGL for compositing. Drawing 10 layers with `drawImage()` is fine, but WebGL could composite them in a single draw call with GPU acceleration.

### Anticipated Q&A

**Q: How do layers work on an immediate-mode canvas?**
**A:** HTML5 Canvas is immediate-mode, meaning there's no retained scene graph. Once you draw, it's pixels. To support layers, I use one `OffscreenCanvas` per layer as a buffer. All drawing operations target the active layer's buffer. A compositor canvas (the one the user sees) clears and redraws every frame by iterating layers bottom-to-top and calling `drawImage()` for each visible layer. This gives you layer independence: visibility, opacity, reordering, all work because each layer is its own bitmap.

**Q: How does undo/redo work?**
**A:** Per-layer command pattern. Before any drawing operation, I snapshot the affected area's `imageData` from the active layer's buffer. After the operation, I snapshot again. The command stores both snapshots plus the layer ID. Undo puts back the "before" snapshot. Redo puts back the "after." The stack is per-layer, so undoing on one layer doesn't touch others.

**Q: Why not use SVG or a retained-mode library like Fabric.js?**
**A:** The whole point was exploring immediate-mode canvas and building layers from scratch. SVG and Fabric.js give you objects and layers for free, but you don't learn how compositing actually works. Also, for a pixel-based drawing app (not a vector editor), immediate-mode canvas is more natural. You're manipulating pixels, not objects.

**Q: How do you handle high-DPI displays?**
**A:** I multiply the canvas bitmap dimensions by `window.devicePixelRatio` and scale the drawing context accordingly. So on a 2x display, a 1920x1080 CSS canvas has a 3840x2160 bitmap. All coordinates are in CSS pixels; the scale transform handles the mapping. This gives crisp lines and text on Retina displays. All offscreen layer buffers use the same scaling.

---

## 4at

### What It Is

A multi-user TCP chat server with dual implementations in Rust and Go. Connect with telnet, authenticate with a token, and chat in real time.

### Rapid-Fire Details

| Detail | Value |
|--------|-------|
| Languages | Rust, Go |
| Protocol | TCP on port 6979, telnet-compatible |
| Rust deps | std::net, std::thread, getrandom (near zero-dependency) |
| Go deps | net package, goroutines |
| Features | Token auth, rate limiting, ban system, broadcast, text filter |

### Architecture

Both implementations follow the same design. A TCP listener binds to port 6979. On each new connection, a handler thread/goroutine spawns. The server generates an auth token on startup and prints it to stdout. Clients must send this token as their first message. After auth, messages are broadcast to all connected clients.

The Rust version uses `std::net::TcpListener` with OS threads (`std::thread::spawn`). Shared state (connected clients, banned IPs, message history) lives in an `Arc<Mutex<ServerState>>`. Each thread locks the mutex to read/write state.

The Go version uses `net.Listen` with goroutines. Shared state uses channels for message passing (idiomatic Go) rather than mutexes. A central "hub" goroutine receives messages from client goroutines and broadcasts them.

### Technical Decisions & Why

**Dual implementation.** I built both to compare concurrency models. Rust's OS threads with `Arc<Mutex<>>` vs Go's goroutines with channels. The Rust version is more explicit about ownership and locking. The Go version is more concise but hides complexity in the runtime scheduler.

**Near zero dependencies in Rust.** Only `getrandom` for token generation. Everything else is stdlib. I wanted to understand what the standard library gives you for networking and concurrency without reaching for tokio or async-std. The tradeoff: no async I/O, so each connection burns an OS thread. Fine for a chat server with dozens of users, not fine for thousands.

**Telnet compatibility.** No custom client needed. Any telnet client works. This means the protocol is line-based plaintext. No binary framing, no length prefixes. Simple but limited.

**Token auth over username/password.** The token is generated fresh on each server start and printed to stdout. The admin shares it with allowed users. No database, no password hashing, no account management. Appropriate for a small, ephemeral chat server.

### Problems Faced & How Overcome

**Safely sharing mutable state across threads in Rust.** The client list, ban list, and message history all need to be read and written by multiple threads. Rust's ownership system forces you to use `Arc<Mutex<T>>`. The `Arc` provides shared ownership (reference counting), and the `Mutex` provides interior mutability with locking. The tricky part is avoiding deadlocks: never hold two locks at once, keep critical sections short, and clone data out of the lock rather than holding the lock while processing.

**Rate limiting without a separate data store.** I track message timestamps per client in the shared state. Each client has a `Vec<Instant>` of recent message times. On each message, I prune timestamps older than the window (e.g., 10 seconds), then check if the count exceeds the limit (e.g., 5 messages). If so, the message is dropped and the client gets a warning. No Redis, no external store. The tradeoff: this state is lost on server restart, but that's fine for an ephemeral chat server.

**Graceful disconnect detection.** TCP doesn't have a "disconnect" event. You find out a client disconnected when a `read()` or `write()` returns an error or zero bytes. I handle this by wrapping every I/O operation in error checks. On error, the client is removed from the shared state and a "user left" message is broadcast. The Go version uses `defer` for cleanup; the Rust version uses `Drop` traits and explicit cleanup in the error path.

### What I'd Do Differently

I'd add async I/O in the Rust version using tokio. OS threads work fine for small scale, but it's a missed learning opportunity. Async Rust with tokio's `TcpListener` and `select!` macro would handle thousands of connections on a single thread.

I'd also add TLS. Plaintext TCP means anyone on the network can read messages. Adding `rustls` or Go's `crypto/tls` would be straightforward and make it actually usable on untrusted networks.

A proper message protocol (even just JSON lines) would make it easier to add features like private messages, rooms, or message history.

### Anticipated Q&A

**Q: Compare the Rust and Go concurrency models you used.**
**A:** Rust uses OS threads with `Arc<Mutex<>>` for shared state. You explicitly lock, read/write, and unlock. The compiler enforces that you can't access shared data without locking. It's verbose but safe: data races are compile-time errors. Go uses goroutines (green threads, multiplexed onto OS threads by the runtime) with channels for communication. The hub pattern: one goroutine owns the state, others send messages to it via channels. It's more concise and idiomatic, but race conditions are runtime errors, not compile-time. Go has a race detector (`go run -race`) but it's opt-in.

**Q: How did you handle the shared mutable state problem in Rust?**
**A:** `Arc<Mutex<ServerState>>` where `ServerState` holds the client list, ban list, and rate limit data. Each thread clones the `Arc` (incrementing the reference count) and locks the `Mutex` when it needs access. I kept critical sections minimal: lock, clone the data I need, unlock, then process. This avoids holding the lock during I/O operations, which would block other threads. For broadcast, I lock once to get a snapshot of connected clients, unlock, then iterate and write to each client's stream outside the lock.

**Q: Why not use async Rust (tokio)?**
**A:** I wanted to understand the fundamentals first. OS threads with mutexes is the baseline concurrency model. Once you understand locking, contention, and deadlocks, async makes more sense because you can appreciate what it's abstracting away. Also, for a small chat server, OS threads are perfectly adequate. Tokio adds complexity (pinning, Send bounds, async trait limitations) that wasn't justified for this scope.

---

## seroost

### What It Is

A local search engine that indexes documents using TF-IDF (Term Frequency-Inverse Document Frequency) scoring, built from scratch in Rust with a web frontend.

### Rapid-Fire Details

| Detail | Value |
|--------|-------|
| Language | Rust |
| External crates | 3 (serde_json, tiny_http, xml-rs) |
| Architecture | main.rs (entry), model.rs (TF-IDF), server.rs (HTTP) |
| Frontend | index.html + index.js |
| Scoring | TF-IDF with custom tokenizer and inverted index |

### Architecture

Three files, three concerns. `main.rs` handles CLI argument parsing and orchestration: read files from a directory, build the index, start the server. `model.rs` contains the TF-IDF engine: tokenization, inverted index construction, and query scoring. `server.rs` runs a tiny HTTP server that serves the frontend and handles search API requests.

The indexing pipeline: read document -> tokenize (split on whitespace/punctuation, lowercase, strip non-alphanumeric) -> build term frequency map per document -> build inverted index (term -> list of documents containing it) -> compute IDF scores (log(total_docs / docs_containing_term)).

At query time: tokenize the query -> for each query term, look up the inverted index -> for each matching document, compute TF-IDF score -> rank by score -> return top results.

### Technical Decisions & Why

**Only 3 external crates.** I wanted to understand what goes into a search engine at the lowest level. No Lucene, no tantivy, no elasticsearch client. Just raw data structures: `HashMap<String, Vec<(DocId, f64)>>` for the inverted index, `HashMap<DocId, HashMap<String, usize>>` for term frequencies. The tradeoff: no stemming, no stop words, no fuzzy matching. But I understand exactly how every query is scored.

**tiny_http over actix/warp/axum.** tiny_http is a single-threaded, minimal HTTP server. It handles `GET` and `POST`, serves static files, and that's it. No middleware, no routing framework, no async runtime. For a local search tool, this is all you need. The tradeoff: no concurrent request handling, but for a single-user local tool, that's fine.

**Custom tokenization over a library.** I split on whitespace and punctuation, lowercase everything, and strip non-alphanumeric characters. No stemming (so "running" and "run" are different tokens), no stop word removal (so "the" and "a" are indexed). This is intentionally naive. I wanted to see how far basic TF-IDF gets you without NLP preprocessing. The answer: surprisingly far for technical documents where exact terms matter.

### Problems Faced & How Overcome

**Efficient tokenization from scratch.** The naive approach (split on whitespace, iterate characters) is O(n) per document, which is fine. But I initially allocated a new `String` for every token, which thrashed the allocator. I switched to pre-allocating a buffer and reusing it across tokens, which cut indexing time significantly for large document sets.

**Scaling the inverted index.** For thousands of documents with millions of unique terms, the `HashMap` gets large. I considered a trie or B-tree, but `HashMap` with a good hash function (Rust's default SipHash) was fast enough. The real bottleneck was the initial build, not query time. I added a progress indicator so users know it's working during indexing.

**Minimal latency HTTP serving.** The search needs to feel instant. Since the index lives in memory and queries are just hash lookups + scoring, the bottleneck is serialization. I pre-serialize document metadata and only compute scores on the fly. Response times are under 10ms for most queries.

### What I'd Do Differently

I'd add stemming (Porter stemmer) and stop word removal. These two features alone would dramatically improve search quality for natural language queries.

I'd also persist the index to disk so you don't have to rebuild it every time you start the server. A simple binary serialization with `bincode` would work.

BM25 scoring instead of raw TF-IDF would handle document length normalization better. Long documents currently get unfairly high scores because they have more term occurrences.

### Anticipated Q&A

**Q: Explain TF-IDF scoring.**
**A:** TF (Term Frequency) measures how often a term appears in a document. A document mentioning "rust" 10 times is more relevant to a "rust" query than one mentioning it once. IDF (Inverse Document Frequency) measures how rare a term is across all documents. "The" appears in every document, so its IDF is near zero. "Borrow checker" appears in few documents, so its IDF is high. The final score is TF * IDF. This means a term that's frequent in a specific document but rare overall gets the highest score. It's the foundation of most search engines, though modern ones layer BM25, PageRank, and ML on top.

**Q: Why build a search engine from scratch instead of using Elasticsearch?**
**A:** To understand the fundamentals. Elasticsearch is a distributed system with inverted indices, analyzers, sharding, replication. If you don't understand how an inverted index works, you can't debug why your Elasticsearch queries return unexpected results. Building from scratch taught me tokenization, index construction, scoring, and the tradeoffs between precision and recall. Now when I use Elasticsearch, I understand what's happening under the hood.

**Q: What are the limitations of your implementation?**
**A:** No stemming, so "running" and "run" are different terms. No stop word removal, so common words like "the" waste index space. No fuzzy matching, so typos return nothing. No persistence, so the index rebuilds on every start. No concurrent query handling. These are all solvable, but I intentionally kept it minimal to focus on the core algorithm.

---

## musializer

### What It Is

A real-time audio visualizer that performs FFT (Fast Fourier Transform) on audio input and renders frequency spectrum visualizations. Written in C, about 670 lines.

### Rapid-Fire Details

| Detail | Value |
|--------|-------|
| Language | C (~670 lines) |
| Files | src/musializer.c (app), src/fft.h (header-only FFT) |
| FFT | 256 bins, O(N log N), butterfly operations, bit-reversal permutation |
| Audio | 44,100 Hz, 32-bit float, stereo |
| Dependency | raylib (graphics + audio) |
| Build | build.sh |

### Architecture

Two files. `musializer.c` handles the application loop: load audio file, read samples, pass them to FFT, map frequency bins to visual bars, render with raylib. `fft.h` is a header-only library implementing the Cooley-Tukey FFT algorithm.

The render loop: read N samples from the audio buffer -> apply a window function (Hanning) to reduce spectral leakage -> run FFT to get frequency magnitudes -> map 256 frequency bins to screen-space bars -> draw bars with height proportional to magnitude and color mapped to frequency.

raylib handles both the graphics (window, drawing primitives) and audio (loading, streaming, sample access). This keeps external dependencies to exactly one library.

### Technical Decisions & Why

**C over Rust or Python.** Real-time audio visualization needs predictable, low-latency performance. C gives you direct control over memory layout and no garbage collector pauses. Python would be too slow for per-frame FFT. Rust would work but adds complexity (borrow checker, unsafe for raw audio buffers) without much benefit for a 670-line program.

**Header-only FFT library.** I wrote the FFT as a single header file so it's reusable without a build system. Include `fft.h`, call `fft()`, done. No linking, no CMake, no pkg-config. The tradeoff: header-only means the implementation is visible to every translation unit that includes it, which can slow compilation. For a two-file project, this doesn't matter.

**raylib over SDL2 or GLFW+OpenAL.** raylib bundles graphics and audio in one library with a dead-simple API. `LoadMusicStream()`, `DrawRectangle()`, done. SDL2 requires more boilerplate. GLFW doesn't include audio. raylib's simplicity matches the project's scope.

**256 FFT bins.** At 44,100 Hz sample rate, 256 bins gives ~172 Hz resolution per bin. This is enough to distinguish bass, mids, and treble visually. 512 or 1024 bins would give finer resolution but more visual noise. 256 is a good balance for a visualizer (not an analyzer).

### Problems Faced & How Overcome

**Implementing FFT correctly.** The Cooley-Tukey algorithm requires bit-reversal permutation of the input, then butterfly operations at each stage. Getting the bit-reversal right was the first hurdle: for N=256, index 1 (binary 00000001) maps to 128 (binary 10000000). I wrote a helper that reverses the bits of an 8-bit integer. The butterfly operations combine pairs of elements using complex multiplication with twiddle factors (roots of unity). Getting the twiddle factor indices right required careful reading of the algorithm and drawing out the butterfly diagrams on paper.

**Real-time performance.** FFT on 256 samples is fast (O(N log N) = ~2048 operations), but it runs every frame at 60 FPS. That's 120,000+ floating-point operations per second just for FFT, plus rendering. I avoided allocations in the hot loop: the FFT buffer is pre-allocated, the output bins are a static array, and the rendering uses raylib's immediate-mode drawing (no scene graph overhead). On modern hardware this is trivial, but on the Raspberry Pi I tested on, it mattered.

**Mapping frequency bins to visuals.** Linear mapping (bin 0 = leftmost bar, bin 255 = rightmost bar) looks wrong because human hearing is logarithmic. Low frequencies (bass) occupy a huge range of bins but should be a small visual area. I use a logarithmic scale for the x-axis, grouping low-frequency bins together and spreading high-frequency bins out. This makes the visualizer "feel" right musically.

**Audio buffer synchronization.** raylib streams audio in chunks. The render loop runs at 60 FPS. These aren't synchronized. I read the current playback position, compute which samples correspond to "now," and FFT those. If the audio buffer hasn't advanced since the last frame, I reuse the previous FFT result to avoid visual stuttering.

### What I'd Do Differently

I'd add a smoothing filter on the FFT output. Raw FFT magnitudes jump frame-to-frame, making the bars flicker. Exponential moving average (current = alpha * new + (1-alpha) * previous) would smooth the animation.

I'd also add multiple visualization modes: waveform, spectrogram (time-frequency heatmap), circular spectrum. The FFT data supports all of these; it's just different rendering.

Support for microphone input (not just audio files) would make it a live visualizer for any audio source.

### Anticipated Q&A

**Q: Explain how FFT works at a high level.**
**A:** FFT converts a time-domain signal (amplitude over time) into a frequency-domain signal (amplitude at each frequency). It's the Cooley-Tukey algorithm: recursively split the input into even and odd indices, FFT each half, then combine using butterfly operations with complex twiddle factors. The "fast" part is that it's O(N log N) instead of the naive DFT's O(N^2). For 256 samples, that's ~2048 operations instead of ~65,536. The output is 256 complex numbers; I take their magnitudes to get the frequency spectrum.

**Q: Why C for this project?**
**A:** Real-time audio processing needs predictable performance. No GC pauses, no runtime overhead. C gives me direct access to audio buffers as float arrays, which is exactly what FFT operates on. The program is 670 lines. At that scale, C's lack of abstractions isn't a problem, and its performance characteristics are a benefit. Plus, raylib's C API is the most natural way to use it.

**Q: How do you handle the audio-visual synchronization?**
**A:** The audio streams independently from the render loop. Each frame, I query the current playback position from raylib, compute which sample index that corresponds to, read 256 samples starting from that index, and run FFT on them. If the playback position hasn't changed since the last frame (which happens when the frame rate is higher than the audio chunk rate), I reuse the previous FFT result. This keeps the visualization in sync with what you're hearing without coupling the render loop to the audio thread.

---

## Open Source: Apache ECharts

### What It Is

Apache ECharts is a JavaScript charting library with 65,000+ GitHub stars. I contributed two PRs: one merged, one open.

### Rapid-Fire Details

| Detail | Value |
|--------|-------|
| Project | Apache ECharts (65k+ stars) |
| PR #21325 | MERGED: fix candlestick render error with series.encode |
| PR #21314 | OPEN: fix tooltip formatter callback for connected charts |

### Technical Details

**PR #21325 (Merged): Candlestick render error with series.encode.** The candlestick chart type expects data in a specific format: [open, close, low, high]. When users use `series.encode` to map custom dataset columns to these fields, the renderer was reading raw data indices instead of encoded indices. This caused render errors or incorrect candles. I traced the issue through the data pipeline: dataset -> encode mapping -> series data access -> renderer. The fix was making the candlestick renderer respect the encode mapping when accessing data values.

**PR #21314 (Open): Tooltip formatter callback for connected charts.** ECharts supports "connecting" multiple chart instances so they share tooltips and interactions. When charts are connected, the tooltip formatter callback receives data from all connected charts. But the `params` object in the callback was missing fields for the non-primary charts. I traced this through the tooltip component's event handling and the chart connection manager. The fix ensures all connected chart data is properly serialized into the formatter callback params.

### What I Learned

Working on a 65k-star project with strict review processes taught me how large OSS projects maintain quality. Every PR needs tests, documentation updates, and passes CI. The codebase uses a custom build system and has its own patterns for data flow. Reading and understanding existing patterns before writing code is more important than the code itself.

### Anticipated Q&A

**Q: What was it like contributing to a large open source project?**
**A:** Humbling and educational. The codebase is massive, and understanding the data flow from dataset to renderer took hours of reading. The review process is thorough: maintainers check not just correctness but consistency with existing patterns, performance implications, and edge cases. I learned to write better PR descriptions, include reproduction steps, and add targeted tests. The candlestick fix was a one-line change in the renderer, but understanding why that line was wrong required tracing data through five modules.

**Q: How did you find and fix the candlestick bug?**
**A:** A user reported that candlestick charts rendered incorrectly when using `series.encode` with a custom dataset. I reproduced it locally, then traced the data flow. The dataset provides raw rows. The `encode` config maps column indices to semantic fields (open, close, low, high). The candlestick renderer was reading columns by raw index instead of going through the encode mapping. So if your dataset had [date, volume, open, close, low, high] and you encoded columns 2-5, the renderer was still reading columns 0-3. The fix was using the encode-aware data accessor instead of the raw one.

---

## harmony

### What It Is

A real-time music room sharing application where users can listen to music together in synchronized rooms.

### Rapid-Fire Details

| Detail | Value |
|--------|-------|
| Language | TypeScript |
| Concept | Shared music rooms with real-time sync |

### Anticipated Q&A

**Q: What's the core technical challenge of synchronized music playback?**
**A:** Clock drift. Every client's audio playback drifts slightly from the server's timeline. You need periodic sync messages that tell clients "the current track is at position X." Clients adjust their playback position to match, using small speed adjustments (playing slightly faster or slower) rather than hard seeks, which cause audible glitches.

---

## better-auth-ts

### What It Is

A Next.js application with Prisma ORM and Better Auth for authentication. A reference implementation for modern TypeScript auth patterns.

### Rapid-Fire Details

| Detail | Value |
|--------|-------|
| Stack | Next.js, Prisma, Better Auth |
| Language | TypeScript |

### Anticipated Q&A

**Q: Why Better Auth over NextAuth/Auth.js?**
**A:** Better Auth is more TypeScript-native and gives you more control over the auth flow. NextAuth abstracts a lot, which is great until you need custom behavior. Better Auth lets you define your own session management, token handling, and provider configuration with full type safety. The tradeoff is more setup code, but you understand exactly what's happening.

**Q: How does Prisma fit into the auth flow?**
**A:** Prisma is the ORM layer. Better Auth needs to store users, sessions, and tokens somewhere. Prisma provides the database schema (User, Session, Account models), migrations, and type-safe queries. When a user logs in, Better Auth calls Prisma to create/update the session record. When checking auth, it queries the session table. The Prisma schema is the source of truth for the auth data model.

---

## snippetbox

### What It Is

A secure snippet sharing web application built in Go, following Alex Edwards' "Let's Go" book. Users create, view, and share text snippets with expiration dates.

### Rapid-Fire Details

| Detail | Value |
|--------|-------|
| Language | Go |
| Source | "Let's Go" by Alex Edwards |
| Features | Snippet CRUD, user auth, session management, CSRF protection |

### Anticipated Q&A

**Q: What did you learn from building this?**
**A:** Production Go web patterns: middleware chains, dependency injection via closures, secure session management with SCS, CSRF protection, proper error handling with custom error types, database connection pooling, and template caching. The book emphasizes doing things "the Go way" rather than reaching for a framework. No Gin, no Echo. Just `net/http` with thoughtful architecture.

**Q: How does session management work without a framework?**
**A:** Using the SCS (Session Cookie Store) package. Sessions are stored server-side (in the database), and the client gets a signed cookie with the session ID. On each request, middleware loads the session from the database, makes it available to handlers via the request context, and saves any changes after the handler returns. CSRF tokens are stored in the session and validated on every POST/PUT/DELETE.

---

## proglog

### What It Is

A distributed log system built in Go, following Travis Jeffery's "Distributed Services with Go" book. Implements consensus, service discovery, and log replication.

### Rapid-Fire Details

| Detail | Value |
|--------|-------|
| Language | Go |
| Source | "Distributed Services with Go" by Travis Jeffery |
| Concepts | Raft consensus, gRPC, service discovery, log replication |

### Anticipated Q&A

**Q: Explain the distributed log architecture.**
**A:** The log is an append-only data structure. Each server maintains a local log (segments on disk). Raft consensus ensures all servers agree on the log order. One server is the leader; it accepts writes and replicates them to followers. If the leader fails, Raft elects a new one. Service discovery (using Serf) lets servers find each other without hardcoded addresses. gRPC handles the RPC layer between servers. The key insight: a distributed log is the foundation of systems like Kafka, and building one teaches you consensus, replication, and failure handling.

**Q: What's Raft consensus and why does it matter?**
**A:** Raft is an algorithm for getting multiple servers to agree on a sequence of operations. It's simpler than Paxos (the academic standard) while providing the same guarantees. A leader is elected, it proposes entries, followers acknowledge, and once a majority agrees, the entry is committed. It matters because without consensus, distributed systems can diverge: two servers might have different data, and you can't tell which is correct. Raft guarantees that committed entries are durable and consistent across the cluster.

---

## distributed-log-processing-system

### What It Is

A distributed log processing system built in Python. Handles ingestion, processing, and querying of log data at scale.

### Rapid-Fire Details

| Detail | Value |
|--------|-------|
| Language | Python |
| Concept | Log ingestion, processing pipelines, distributed querying |

### Anticipated Q&A

**Q: How does this differ from proglog?**
**A:** proglog is about building the distributed log itself (consensus, replication, storage). This project is about processing logs that already exist: ingesting them from multiple sources, running transformations and aggregations, and making them queryable. Think of proglog as building Kafka, and this as building a log analytics pipeline on top of it.

---

## ad-my-brand-insights

### What It Is

A marketing analytics dashboard that visualizes brand performance metrics and campaign insights.

### Rapid-Fire Details

| Detail | Value |
|--------|-------|
| Language | TypeScript |
| Concept | Marketing analytics, data visualization, dashboard |

### Anticipated Q&A

**Q: What kind of metrics does the dashboard track?**
**A:** Campaign performance (impressions, clicks, conversions, CTR), audience demographics, engagement trends over time, and comparative analysis across campaigns. The dashboard pulls data from marketing APIs, aggregates it, and presents it with interactive charts and filters.

---

## portfolio (purbayan.dev)

### What It Is

My personal developer portfolio site. Tokyo Night themed, monospace everything, with a terminal easter egg that supports tab completion.

### Rapid-Fire Details

| Detail | Value |
|--------|-------|
| Stack | React 19, Vite, TypeScript, Tailwind CSS 4, Zustand, Framer Motion |
| Theme | Tokyo Night |
| Font | Iosevka Mono |
| Easter Egg | Terminal with tab completion |
| Live | purbayan.dev |

### Architecture

Standard React SPA with Vite. Zustand for minimal global state (theme, terminal visibility). Framer Motion for page transitions and micro-interactions. The terminal easter egg is a custom component that parses commands, supports tab completion for available commands, and renders output with a typewriter effect.

### Anticipated Q&A

**Q: Tell me about the terminal easter egg.**
**A:** It's a custom React component that mimics a Unix terminal. You can type commands like `help`, `about`, `projects`, `contact`. Tab completion works: type `pro` and hit Tab, it completes to `projects`. The command parser splits input on spaces, matches the first token against a command registry, and executes the handler. Output renders with a typewriter effect using `setInterval` to append characters. The terminal state (history, current input, cursor position) lives in a Zustand store so it persists across component mounts.

**Q: Why Zustand over Redux or Context?**
**A:** Zustand is tiny (~1KB), has no boilerplate, and doesn't require providers wrapping your component tree. For a portfolio site with minimal global state (theme preference, terminal state), Redux is overkill and Context causes unnecessary re-renders. Zustand gives you a hook-based API: `const theme = useStore(s => s.theme)`. That's it. No actions, no reducers, no dispatch.

**Q: Why Vite over Next.js for a portfolio?**
**A:** A portfolio is a static site. No server-side rendering needed, no API routes, no dynamic data fetching. Vite gives you fast HMR, optimized builds, and zero configuration for a React SPA. Next.js would add a server runtime, file-based routing, and SSR complexity that a portfolio doesn't need. Vite builds to static HTML/JS/CSS that deploys anywhere.

---

## Cross-Project Themes (For Behavioral Questions)

### "Tell me about a time you debugged a complex issue."

Use the **canvas loading bug** from fiddle-factory. It has everything: a race condition, framework lifecycle quirks (tldraw onMount), caching behavior (React Query cold vs warm cache), and a fix that required understanding three systems interacting. The bug only affected new users, which made it hard to reproduce in development.

### "Tell me about a time you improved performance."

Use the **non-blocking message send** from fiddle-factory (PR #227). Concrete before/after: before, users waited for a full database round-trip before seeing their message. After, optimistic updates show the message instantly while the write happens async. Or use the **build pipeline simplification** (PR #185): removed a complex iframe screenshot system in favor of deterministic Storycap captures.

### "Tell me about working with a large codebase."

Use **Apache ECharts** (65k stars). Tracing a bug through five modules, understanding existing patterns before writing code, writing a PR that fits the project's conventions. Or use **fiddle-factory's multi-repo setup**: 6 repos, each with different configs, and maintaining consistency across them.

### "Tell me about a technical decision you made."

Use **tldraw over react-flow** for a design-focused answer. Or **e2b over WebContainers** for an infrastructure answer. Or **OS threads vs goroutines** from 4at for a systems answer. Each has clear tradeoffs you can articulate.

### "What's a project you're most proud of?"

**Canvas Kit** if you want to show depth of understanding (layers, compositing, command pattern, strategy pattern). **fiddle-factory** if you want to show breadth and impact (15+ PRs, multiple repos, real users). **musializer** if you want to show low-level skills (C, FFT, real-time rendering).

### "How do you learn new technologies?"

Point to the pattern: **seroost** (learned search/IR by building from scratch), **proglog** (learned distributed systems from a book + implementation), **4at** (learned Rust concurrency by building the same thing in two languages), **musializer** (learned FFT by implementing it in C). The pattern is: pick a concept, build something real, keep dependencies minimal so you understand every layer.
