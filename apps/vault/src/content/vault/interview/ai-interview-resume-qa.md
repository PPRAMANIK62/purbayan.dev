---
title: "AI Interview: Resume Q&A"
---

# AI interview: the complete resume question tree

Built for a Mercor-style AI screen, but it works for any resume-driven interview. Every
question below is derived from a line that is actually on my resume. If a line is not on the
resume, it is not in here, because the interviewer never sees it.

Scope of the resume this covers: StashBase, SamurAI Studios, fiddle-factory (contractor),
fiddle-factory (intern), the skills block, trove/cn, mdt, and a B.Tech in Mechanical
Engineering from NIT Durgapur. Nothing else. Canvas Kit, 4at, seroost, musializer, and the
ECharts work are not on this resume, so I do not volunteer them unless asked what else I have
built.

---

## Part 1: how the machine reads me

### The mechanics

Twenty to thirty minutes of video with an AI interviewer that has already parsed my resume.
No human watches live. A transcript gets scored against a rubric and fed to a matching system.

The question mix runs roughly four to six technical depth probes, three or four behavioural
scenarios, and two or three verification questions that check whether I did the thing I wrote
down.

Two properties change how I should behave:

**It adapts, and the ramp is one-directional.** The first two or three answers set a baseline.
Strong answers pull the next question deeper. Weak ones keep the interview shallow and cap the
score I can still reach. Recovering late is much harder than starting well, so the opening
minutes carry more weight than they feel like they should.

**It punishes silence.** Long thinking pauses read as a pacing problem and it will talk over
me. I think out loud instead of thinking quietly.

### What it is actually scoring

Not whether I know React. Whether the person who wrote this resume and the person answering
are the same person. Every bullet is a claim, and the interview is a cheap way to test claims.

Three signals it is hunting for:

Ownership, meaning I can name the decision I made rather than the feature that existed.
Mechanism, meaning I can explain how the thing works one level below the bullet. Consequence,
meaning I know what it cost, what broke, or what I would change.

A candidate who says "I migrated the canvas to tldraw" and a candidate who says "react-flow
models everything as nodes and edges, and the hard part was that its position-and-connection
format does not map cleanly onto tldraw's shape props" score differently on the same bullet.

### The verification question is the whole format

"You said 56 primitives. What was in them?" is not a trick. It is the cheapest possible test of
whether a number is real. Any bullet with a number, a named library, or a named technique invites
one. I should assume every single one gets probed and prepare accordingly.

This is also why the resume no longer carries PR counts or a file count. A number that measures
my output volume rather than the thing I built cannot survive the follow-up, because the honest
answer to "what were those 57 PRs" is "a metric, mostly". Numbers that size the work still earn
their place: 56 primitives, four model providers, a two-hour sandbox lifetime.

---

## Part 2: resume audit, line by line

Before the questions, an honest look at what each line invites. Green means I can go three
questions deep without effort. Amber means I need to rehearse. Red means it is bait I should
either prepare hard or remove from the uploaded version.

| Resume line                                                        | Risk  | Why                                                                                                                                                                                                                                                  |
| ------------------------------------------------------------------ | ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Milkdown Crepe editor, source semantics preserved                  | Amber | "Source semantics" is a strong claim. I need a concrete example of one that was hard.                                                                                                                                                                |
| Sanitized HTML, footnotes, heading anchors, frontmatter            | Green | Each is a small, specific, explainable change.                                                                                                                                                                                                       |
| Shared Agent Contract, Claude and Codex adapters, parity tests     | Amber | This is my best architecture story and my most probeable. Rehearse the interface boundary.                                                                                                                                                           |
| Playwright E2E, cross-platform CI gates                            | Amber | Invites "how do you keep visual tests from being flaky", which has a real answer I must not fumble.                                                                                                                                                  |
| 57 merged PRs across 4 codebases                                   | Cut   | Measured my output volume, not the work. Burned a bullet and invited a verification probe I could only answer with "it is a bad metric". Replaced by the pipeline, storyboard, generation and UI bullets.                                            |
| Creative-brief pipeline, golden evaluations, provider abstractions | Amber | "Golden evaluations" is jargon the interviewer will ask me to define.                                                                                                                                                                                |
| Multi-scene storyboards, version history, backward compatibility   | Green | Full-stack migration story with a clean data-model spine.                                                                                                                                                                                            |
| Multi-provider image and video generation, continuity prompts      | Amber | Naming providers means naming their differences.                                                                                                                                                                                                     |
| 49+ merged PRs across 5 repositories                               | Cut   | Same problem as the 57. The scope it carried now lives in three bullets that each name something built.                                                                                                                                              |
| Storybook across 4 repos, canvas hydration race, PKCE              | Green | Three distinct, deep, well-understood stories.                                                                                                                                                                                                       |
| react-flow to tldraw migration                                     | Green | Best story on the resume. The follow-up is always the data conversion. The file count came off the page, so 84 is now a detail I volunteer rather than a claim I defend.                                                                             |
| StackBlitz WebContainers to e2b                                    | Green | Clean tradeoff answer with a real constraint behind it.                                                                                                                                                                                              |
| Languages line                                                     | Cut   | Was TypeScript, JavaScript, Rust, Go, C, Python, Shell. Now TypeScript, JavaScript. I have used Rust and Go enough to build with, not enough to be interviewed on.                                                                                   |
| Remix in the frameworks line                                       | Amber | Defensible through fiddle, but I did not choose it. Say so.                                                                                                                                                                                          |
| Zustand, Radix, Framer Motion, tldraw                              | Amber | tldraw and Framer Motion are safe. Zustand needs a "why not context" answer.                                                                                                                                                                         |
| MongoDB, Firebase in databases                                     | Cut   | Nothing on the page used them. Databases now reads PostgreSQL, Supabase.                                                                                                                                                                             |
| WebSockets in concepts                                             | Amber | Real-time sync at SamurAI covers it, but I should know the fallback story.                                                                                                                                                                           |
| trove/cn, shadcn registry format, Base UI                          | Green | Mine end to end, recent, and I can explain every choice.                                                                                                                                                                                             |
| mdt, ratatui, syntect                                              | Amber | Real and shipped, and it stays. The bullet that named four systems techniques has been rewritten, because it turned a build-to-learn project into a Rust internals interview. Rust still comes up via the project itself, so Part 10 has the script. |
| B.Tech Mechanical Engineering                                      | Amber | Always asked. Needs a confident forty-second answer, not an apology.                                                                                                                                                                                 |

The rows marked Cut have already been cut. Keeping the reasoning here because it is the rule I
should apply to every future edit of this page, not a one-time cleanup.

The mistake was uniform: I listed things I had touched rather than things I can be interviewed
on. Rust and Go are the clearest case. I built mdt in Rust and got something real out of it, but
I built it to learn the language, not from a position of knowing it, and Go is a taste. On a
normal resume that distinction is invisible and harmless. In an adaptive interview it is the
whole game, because the machine keeps drilling until I stop being able to answer and then scores
where I stopped. A language I cannot defend does not add breadth to my profile. It adds a hole to
my transcript. MongoDB and Firebase were the same thing with less excuse, since nothing on the
page used them at all.

What survives is TypeScript and JavaScript and the frontend stack around them. Narrower and
better, because the interviewer is measuring the gap between claim and depth, not the length of
the list.

---

## Part 3: the answer shape

Every technical answer I give follows the same four beats. It takes forty-five to seventy-five
seconds out loud, which is the right length for this format.

1. **The claim, in one sentence.** What I did. No preamble, no "so basically".
2. **The mechanism.** One level below the bullet. Name the actual thing: the callback, the data
   format, the lifecycle, the type.
3. **A number or a specific.** Two-hour sandbox timeout. 56 primitives. Four model providers.
   Cold React Query cache. Concrete beats adjectives every time.
4. **The tradeoff or the cost.** What I gave up, what broke, or what I would do differently.

Beat four is the one most candidates skip, and it is the one that separates "I used this" from
"I decided this". It also invites the follow-up I want rather than the one the interviewer
picks, which is quiet control over where the conversation goes.

Worked example, using the tldraw bullet:

> We moved the canvas off react-flow onto tldraw. [claim] react-flow models everything as nodes
> and edges, so it is good for flowcharts, but fiddle needed freeform drawing and custom
> component shapes, which meant building a new shape system rather than styling the old one.
> [mechanism] It came out to 84 files, and the bulk of that was not the shapes, it was the data
> converters. [number] The migration cost us weeks and I would do it again, but I underestimated
> the conversion: react-flow stores position, size, and connections, while tldraw stores shape
> props, rotation, opacity, and parent-child relationships, so grouped nodes had to become
> tldraw frames and there was no clean mapping. [tradeoff]

That answer has three natural follow-up hooks in it. Frames, converters, and "would do it
again". I know all three cold, so I have steered the next question into ground I own.

### The opening ninety seconds

The interview usually opens with "tell me about yourself" or "walk me through your most recent
work". Because the ramp is one-directional, this is the highest-value answer in the whole
session. I use it to plant hooks, not to recite chronology.

> I am a frontend-leaning full-stack engineer, mostly TypeScript and React, and the thread
> through my work is that I keep building difficult interactive surfaces. Canvases, editors,
> agent panels. At fiddle, an AI component design tool, I migrated the drawing canvas from
> react-flow to tldraw and later traced the hydration race that was leaving every new user with a
> blank canvas. At SamurAI Studios I rebuilt storyboards from project-owned to scene-owned, data
> model through to the workspace, without breaking projects saved on the old shape. Right now I
> contribute to StashBase, a local-first Electron knowledge base, where I own the Markdown editor
> and wrote the contract that lets Claude and Codex sit behind one interface. On the side I
> maintain trove/cn, a registry of copyable React components, and mdt, a terminal Markdown editor
> I wrote while teaching myself Rust and published to crates.io.

Five hooks in ninety seconds: tldraw migration, hydration race, storyboard schema, agent
contract, registry format. Every one of them is a place I can go three questions deep.

The first sentence is doing work the old version skipped. Naming the through-line, that I build
hard interactive surfaces, gives the interviewer a frame to hang everything else on, and it is
the same claim the resume summary now opens with. Without it the answer is a list of three jobs
and the machine picks which one to probe.

mdt is in there deliberately as the last clause rather than a headline, and the words "while
teaching myself" are doing real work. They frame it as evidence that I ship and learn, not as a
claim to systems depth, which means the interviewer is less likely to spend its scarce twenty
minutes there. If it goes there anyway, Part 10 has the script.

---

## Part 4: StashBase

Resume bullets under review:

1. Built the live Markdown editor on Milkdown Crepe for a local-first knowledge base: editing
   and preview in one surface, with source semantics preserved through links, code fences,
   lists, blockquotes, clipboard, and Find.
2. Hardened Markdown rendering with sanitized HTML, package-native footnotes and heading
   anchors, alert blocks, and hidden frontmatter; added Quick Open, a command palette, and
   editor history.
3. Wrote the Shared Agent Contract with Claude and Codex adapters and parity tests across both,
   and set up the Playwright E2E suite and cross-platform CI gates behind it.

### Q: What is StashBase and what do you own in it?

**Why it comes:** Orientation question. It is calibrating how much context it needs before it
can probe. Answer badly here and every later question stays shallow.

**Answer:**

> It is a local-first Electron app that turns the files on your disk into searchable context for
> AI coding agents. Your notes stay on your machine, the app indexes them, and agents reach them
> over MCP. I own three areas. The Markdown editor, which is a live editing surface rather than
> a split pane. The agent panel, where Claude and Codex both run behind one interface. And the
> renderer architecture around both, which I refactored into enforced layers.

**Follow-ups and how I take them:**

_"Local-first, what does that buy you?"_ Nothing leaves the machine unless the user sends it.
That is the product promise, and it constrains engineering: no server to hold state, so the
Electron main process owns the filesystem and the renderer owns nothing durable. It also means
the agent adapters spawn local processes rather than calling a hosted API, which is why the
contract had to model process lifecycle and not just request and response.

_"Why Electron and not a web app?"_ It needs real filesystem access and it needs to launch
local agent binaries. Neither is possible in a browser tab. The cost is bundle size and two
processes to reason about, and I paid part of that cost when I set an initial-JS budget in CI to
stop the renderer bundle drifting.

### Q: Walk me through the Milkdown Crepe editor. What does "source semantics preserved" mean?

**Why it comes:** It is the most jargon-heavy phrase on the bullet, so it is the cheapest place
to test whether I wrote the sentence or borrowed it. This is a verification probe wearing a
technical costume.

**Answer:**

> Crepe is Milkdown's batteries-included editor. It renders Markdown as formatted content you
> type directly into, so there is no separate preview pane, and the document you see is the
> document. The problem with that model is that the editor is a ProseMirror document underneath,
> not text, so every Markdown construct has to survive a round trip: parse into nodes, edit as
> nodes, serialise back to Markdown that is byte-comparable to what a plain text editor would
> produce. Preserving source semantics means that round trip does not quietly rewrite your file.
> The ones that actually broke were links, code fences, lists, blockquotes, paste, and Find.

**Follow-up: "Give me one that was genuinely hard."**

> Lists and blockquotes on exit. In a live editor you are inside a list item and you press Enter
> twice, and the editor has to decide whether you are adding an item, exiting one nesting level,
> or leaving the list. Get it wrong and the serialiser emits different indentation than the file
> had, so a file the user never meaningfully edited shows up as changed. I shipped that as its
> own change, live list and quote authoring, because the behaviour is small but the blast radius
> is every list in the library.

**Follow-up: "Why does paste matter?"**

> Because paste is where the two representations collide. Copying inside the editor copies
> ProseMirror nodes, copying from a browser brings HTML, and copying from a terminal brings
> plain text. If you accept the HTML path naively you inherit whatever markup the source page
> had, which is both a rendering problem and a security one. That is the same reason the
> rendering bullet says sanitized HTML.

**Follow-up: "Find seems trivial. Why is it on your resume?"**

> Because in a virtualised, node-based editor the match may not be mounted. Find has to locate
> the match in the document model, then scroll the actual rendered position into view, and those
> are two different coordinate systems. I shipped the scroll-into-view part separately from the
> matching, which tells you which half was the real work.

**Failure mode to avoid:** answering this with a list of features. The bullet already lists
features. The interviewer wants the one that fought back.

### Q: You say you hardened Markdown rendering. Harden against what?

**Why it comes:** "Hardened" implies a threat model. If I do not have one, the word was
decoration.

**Answer:**

> Against untrusted input, mostly. A knowledge base renders files the user did not necessarily
> write, including anything an agent generated or anything pasted from the web. Markdown allows
> raw HTML, so rendering it directly gives you script injection inside an Electron renderer,
> which is a much worse position than a browser tab. So HTML goes through sanitisation before it
> renders. Beyond that, hardening meant using the package-native implementations for footnotes
> and heading anchors instead of the hand-rolled ones that were there, because hand-rolled
> Markdown extensions are where the edge cases hide.

**Follow-up: "What is hidden frontmatter?"**

> YAML metadata at the top of the file. Real, part of the document, but it is not prose and a
> reader should not see it as a code block on every note. So it stays in the file and does not
> render. The alternative, stripping it, would lose data, and the alternative of rendering it
> makes every note ugly.

**Follow-up: "You mentioned an outline and Quick Open. Why do those live together?"**

> They are the same problem at different scales. Quick Open is navigation across files, the
> outline is navigation inside one. I moved the outline into the Files sidebar rather than
> giving it its own panel for that reason. One place you go to find things.

### Q: Explain the Shared Agent Contract.

**Why it comes:** This is the strongest architecture claim on the whole resume. Expect three or
four follow-ups here alone and expect them to get pointed.

**Answer:**

> StashBase can drive more than one coding agent. Claude Code and Codex both run as local
> processes with completely different protocols, different session models, different permission
> systems, and different ideas about what deleting a chat means. Before the contract, the app
> knew about both of them in the UI layer, so every feature had two code paths. The contract is
> one interface that both runtimes implement: start a session, stream deltas, expose available
> skills, apply an access mode, delete a chat. The panel talks to the contract. It does not know
> which runtime is behind it.

**Follow-up: "What did you have to leave out of the interface?"**

> Anything only one of them can do. That is the real design pressure. If I widen the interface
> to fit every Codex capability, the Claude adapter grows methods that throw, and then callers
> start branching on runtime again and the abstraction has bought nothing. So the contract holds
> what both can honour, and genuinely runtime-specific things are exposed as capabilities the
> panel can query rather than methods it can call blindly. Native skill catalogs went in that
> way.

**Follow-up: "What are parity tests and why did you need them?"**

> A shared test suite that runs against both adapters and asserts they behave the same. Without
> it the contract is a comment. Adapters drift the moment someone fixes a bug in one and not the
> other, and the drift is invisible because each adapter's own tests still pass. The parity
> suite is the thing that fails. I also wired them into CI, and I colocated them with the
> adapters so a person changing one adapter sees the test that governs both.

**Follow-up: "Where did the adapters actually diverge?"**

> Deletion and access. Codex needed chats permanently deleted rather than marked, and access
> mode validation was implemented twice with slightly different rules, so I pulled it into the
> shared layer. There was also a mapping bug where the Codex Auto reviewer came through as the
> wrong identity. Small, but the kind of thing only a parity check catches.

**Follow-up: "How do you handle a runtime that is not installed?"**

> You do not silently fail. If a built-in runtime is unavailable, the panel says which one and
> how to install it, and startup exit causes are retained so the reason survives the process
> dying. An agent panel that just shows nothing is the worst possible outcome, because the user
> cannot tell whether it is broken or empty.

### Q: Tell me about the Playwright suite. How do you keep Electron E2E from being flaky?

**Why it comes:** Anyone who has written E2E knows the honest answer is "with difficulty". This
question separates people who ran a generator from people who fought the flake.

**Answer:**

> Every spec launches a real Electron app through a dedicated entry file against a disposable
> fixture directory, so a test never touches my actual config, folders, or credentials. Three
> things drove almost all of the early flake. First, launch readiness: the window exists before
> the app is usable, so tests need an explicit readiness signal rather than a wait. Second, port
> release: the next test starts before the previous app has let go, so shutdown had to be
> serialised and the app has to actually quit after the window closes. Third, selectors that
> matched invisible copies, so scoping the slash-command lookup to the visible menu fixed a
> whole class of failures.

**Follow-up: "You have visual baselines. Are those not permanently flaky?"**

> They are if you let CI regenerate them. I split the projects into smoke, functional, and
> visual, and the visual baselines are reviewed and committed per platform, with a manual
> workflow to refresh them rather than an automatic one. A baseline that updates itself is not a
> test. The tradeoff is real work every time a legitimate visual change lands, and I have
> refreshed Linux baselines several times for exactly that reason, most recently after a fix
> that put a tree row height on a whole pixel.

**Follow-up: "A tree row height caused a visual test failure?"**

> It caused the row to land on a half pixel, which antialiases differently, which is a real
> rendering bug that happened to be caught by the pixel diff. That is the argument for visual
> tests in one sentence.

**Follow-up: "How do you test the agent panel if it spawns a real agent?"**

> You do not spawn a real one. There is a deterministic fake that speaks the Codex app-server
> protocol, so the panel exercises the real code path against a scripted peer. Same reason you
> would not hit a payment provider in CI.

### Q: You refactored the renderer architecture. What was wrong with it?

**Why it comes:** If I mention a refactor, the interviewer wants to know whether I fixed a
problem or rearranged files.

**Answer:**

> The directory layout implied a layering, app on top of features on top of store on top of
> common, but nothing enforced it, so both lower layers imported back upward. The store reached
> into the agent panel for the agent catalog, common imported from four different features, and
> common and store imported each other, which is a cycle. It happened for an ordinary reason:
> shared vocabulary got written inside whichever feature needed it first and nobody promoted it
> when a second feature needed it.

**Follow-up: "So you moved files. How is that not cosmetic?"**

> Because moving files alone lasts one pull request. The part that matters is that I then added
> oxlint with per-layer import restrictions, one rule block per feature naming the siblings it
> may not reach, each with a message saying where the shared code should go instead. The repo
> had no lint tooling at all before that. The patterns match the raw specifier, so they catch
> dynamic imports too, and that is how I found four violations hidden inside lazy-loaded
> components that a manual audit had missed.

**Follow-up: "Did you have to break the rules anywhere?"**

> Tests are exempt, because a renderer test legitimately imports a feature component to render
> it. And I calibrated the production rules so the codebase lands clean rather than shipping a
> config with hundreds of warnings nobody reads: correctness at error, suspicious and perf at
> warn, the JSX-scope rule off because the renderer uses the modern transform, exhaustive-deps
> at warn because several hooks narrow their dependencies deliberately.

**This is my best "encode the rule instead of writing it down" story.** If a behavioural
question asks how I make a change stick, this is the answer.

---

## Part 5: SamurAI Studios

Resume bullets under review:

1. Built the creative-brief pipeline that turns a client deck into a typed brief: deck ingestion,
   keyframe extraction, visual captioning, and per-stage evidence an operator console can
   inspect.
2. Rebuilt storyboards from project-owned to scene-owned across the stack: schema migration,
   scene-scoped APIs, version history with snapshot restore, and a multi-scene frontend
   workspace, without breaking existing projects.
3. Shipped per-beat image and video generation across four model providers, with continuity
   prompts to hold style between shots, run monitoring, and usage logging.
4. Moved the product UI onto shared primitives and Tailwind CSS v4 tokens, and cut gallery
   payloads with role-specific WebP derivatives.

### Q: Three months is short. What did you actually get done?

**Why it comes:** Apr to Jul 2026 is a brief tenure and the machine will notice. This used to be
a "you claim 57 PRs, prove it" probe. Now that the count is off the page it arrives as a fair
question about scope, which is a much better one to be asked.

**Answer:**

> Four codebases, and the work went in phases rather than spread evenly. April was foundations
> and product cleanup. Early May was media contracts and generation. Mid-May was making
> storyboards scene-aware, which became the biggest piece. Late May was the document
> intelligence slice end to end, ingestion through to the operator console. June was shared UI
> and cutting workflows the product had outgrown. If you want one thing to judge me on, it is
> the storyboard migration.

Ending on a nomination is deliberate. It hands the interviewer the next question and the next
question is one I can answer for five minutes.

**Follow-up: "Why does your GitHub graph not show this?"**

> Private repositories under a company account, and my commits are attributed to a work identity
> rather than my personal one. It is a common gap and I would rather explain it up front than
> have someone quietly assume I did nothing for three months.

### Q: Walk me through the creative-brief pipeline.

**Why it comes:** It is the most complex-sounding bullet, so it draws the deepest probe. It is
also the one most likely to expose someone who integrated an API and called it a pipeline.

**Answer:**

> A creative deck goes in, a structured brief comes out. Concretely: ingest a PowerPoint and
> validate it, because half of real input is malformed. Extract embedded video and pull
> representative keyframes. Prioritise the visual inputs, because a deck has far more images
> than are worth captioning, and run automatic captioning on the ones that matter. Classify and
> fetch metadata for any URLs, safely. Then a model step turns all that evidence into a typed
> brief that conforms to a schema we export as JSON Schema. Every stage persists what it
> consumed and what it produced.

**Follow-up: "Why persist every stage? That is a lot of storage."**

> Because a document pipeline that behaves like one opaque model call is unmaintainable. When a
> brief comes out wrong, the question is always which stage was wrong, and without per-stage
> artifacts you cannot answer it. That is also why I built the operator console: job search,
> live job detail, artifact previews, brief export. Someone non-technical can look at the
> captions and see that the model was fed the wrong three images. Storage is cheap compared to
> the alternative.

**Follow-up: "What are golden evaluations?"**

> A fixed set of decks with known-good expected briefs, checked into the repo. The pipeline runs
> against them and we diff. It is regression testing for a non-deterministic system. You cannot
> assert exact string equality against a model, so the assertions target structure and required
> facts rather than prose. It catches the failure that unit tests never catch, which is a prompt
> or model change quietly making output worse everywhere.

**Follow-up: "Why provider abstractions? Were you swapping models?"**

> Partly, and partly to keep extraction logic testable. If the extraction step calls OpenAI
> directly, every test needs credentials and a network. Behind an abstraction it takes a fake.
> The migration argument is secondary to the testability argument, though both are real.

**Follow-up: "How did you secure it?"**

> API key protection on the parser endpoints and authentication on the console. It is an
> internal service, so the threat model is mostly accidental exposure rather than a targeted
> attacker, but a parser endpoint that will fetch arbitrary URLs is not something you leave open.

### Q: The storyboard work. Walk me through it end to end.

**Why it comes:** "End to end" is a claim about scope. The interviewer is checking whether the
backend and frontend halves were both mine.

**Answer:**

> The product started with storyboards owned by the project. One project, one flat list of
> frames. Then it needed scenes, so a project holds scenes and a scene holds the storyboard.
> That is a data-model change, not a feature, so it ran through the whole stack. I added a Scene
> domain model and the migration, with default-scene resolution so every existing project got
> one scene containing its old frames. Then create, list, rename, reorder, and delete APIs.
> Then everything downstream had to become scene-scoped: frames, version history, snapshots,
> restore, edit, regenerate, render. Project-level final storyboards became an aggregation over
> scenes rather than a stored thing. On the frontend, a multi-scene workspace with the scene
> builder on its own route, scene-aware loading states, and the final-storyboard and
> candidate-selection interfaces.

**Follow-up: "How did you keep old projects working?"**

> Default-scene resolution plus legacy route compatibility. Old projects resolve to a single
> implicit scene rather than being migrated destructively, and the old project-level routes keep
> answering. I added migration guards and shared fixtures so tests cover both shapes, and the
> regression suite specifically asserts that one scene cannot leak state into another, because
> that is the bug this design makes possible.

**Follow-up: "What would leak?"**

> Version history and snapshots. If scoping is wrong anywhere in that chain, restoring a
> snapshot in scene two can overwrite frames in scene one, and the user loses work with no
> error. That is the failure I was most afraid of, so it is the one the tests target hardest.

**Follow-up: "You said you later simplified it. Why?"**

> The product direction changed and part of the multi-scene surface stopped earning its
> complexity, so I removed it rather than leaving it. Deleting a feature you built two months
> earlier is uncomfortable, but carrying a surface nobody uses costs every future change that
> touches it.

**This is my strongest end-to-end story.** Data model, migration, API design, compatibility
decision, UI restructure, tests that prove an invariant, and a later deletion. If I am asked for
one project to go deep on, this is it.

### Q: Multi-provider generation. What is actually hard about that?

**Why it comes:** Testing whether I think the work was calling APIs.

**Answer:**

> Calling the APIs is the easy part. We ran per-beat video across Runway, Veo, and Seedance,
> plus Kling for final image-to-video clips, and the hard parts were consistency, visibility, and
> cost. Consistency, because a storyboard is a sequence and each beat generated independently
> drifts visually, so I added continuity prompts that carry style context between beats and
> persisted the video prompts so a run is reproducible. Visibility, because these calls take
> minutes and fail in provider-specific ways, so runs needed monitoring, honest operational
> states, and error toasts that tell you what to do rather than that something went wrong. Cost,
> because generation is expensive and nobody could answer where the spend went, so I added
> provider usage logging and a usage view.

**Follow-up: "How do providers differ in ways that hit your code?"**

> Different input contracts, different async models, different failure vocabulary. Some take a
> reference image, some do not. Some return a job you poll, some hold the connection. The
> abstraction has to be over the lifecycle, submit, observe, retrieve, not over the parameters,
> because the parameters genuinely differ and flattening them loses capability.

**Follow-up: "What is real-time sync doing here?"**

> Multiple people work in the same workspace and a generation run started by one of them should
> appear for the others. I separated the real-time workspace concerns and centralised the data
> mapping, because before that each surface mapped provider responses into view models slightly
> differently, and the same clip could look different in two panels.

### Q: You listed media delivery work. Why did that need attention?

**Why it comes:** A frontend-flavoured probe with a performance angle. Good place to show I
measure.

**Answer:**

> Because one image URL was doing three jobs. A tile preview, a gallery image, and the original
> generation have different quality and cost requirements, and overloading a single field means
> you either ship the full-resolution original into a 200-pixel card or you degrade the one
> place quality matters. I gave media URLs distinct roles, generated sharper WebP thumbnails,
> exposed preview derivatives through the API, and made the frontend preview-aware so it knows
> when the small one is all it needs. Aspect ratio is preserved responsively so tiles do not
> jump as images load.

**Follow-up: "How would you measure the win?"**

> Bytes transferred per gallery view and layout shift. The aspect-ratio work targets the second
> one directly. Reserving the box before the image lands is the difference between a gallery
> that settles and one that reflows.

### Q: Tailwind v4 migration. What changed?

**Answer:**

> v4 moves configuration into CSS. Theme values live as custom properties declared in a CSS
> file rather than in a JavaScript config object, so the design system becomes CSS-first. I
> migrated our theme onto v4 tokens and built a design-system module around it, alongside shared
> Button, Modal, and Dropdown primitives and a compound MediaCard for project and workspace
> tiles.

**Follow-up: "Why compound components for MediaCard?"**

> Because the tile appears in several contexts with different affordances, and the alternative
> is a props explosion where the component grows a boolean per variant. Compound composition
> lets the caller assemble the parts it needs and keeps the variant knowledge at the call site
> instead of inside the component.

---

## Part 6: fiddle-factory, contractor

Resume bullets under review:

1. Traced and fixed the canvas hydration race that left new users with a blank canvas: tldraw's
   onMount fired before the data query resolved, so mount now gates on readiness.
2. Built the Storybook setup across four repositories, including a 56-component primitive
   catalogue, with render detection so screenshots capture real content.
3. Added PKCE auth and allowlist access control to the dashboard, and made chat sends
   non-blocking so messages render before the write completes.

### Q: What is fiddle?

**Answer:**

> A component design tool. You draw and describe a UI component on an infinite canvas, Claude
> generates the code, it runs in a cloud sandbox, and you get a live preview next to your
> drawing. Roughly Figma meeting a code generator. The main app is Remix, the canvas is tldraw,
> the sandbox is e2b, and generated components pull from a shared library of 56 primitives in a
> separate repo.

**Follow-up: "How many repositories was this across?"**

> Five. fiddle is the product. shadcn-ui holds the 56 shared primitives. eleven-labs-ui and
> design-engineer are the other component surfaces. repo-build-server builds user projects, and
> there is a dashboard for admin and access control. The Storybook work covered four of them.

### Q: Tell me about the canvas hydration race.

**Why it comes:** This is a debugging question in disguise, and it is the best one on my resume
because the root cause is genuinely non-obvious. Expect it to be asked whenever the interviewer
says "tell me about a hard bug".

**Answer:**

> New users would open the app and the canvas was blank. Returning users were fine, which is why
> nobody on the team saw it: we all had warm caches. The root cause is that tldraw's onMount
> callback fires exactly once, and it fires early. For a returning user, React Query already has
> the project data cached, so onMount runs with data available and hydration works. For a new
> user the cache is cold, the fetch has not resolved, and onMount runs with projectData
> undefined. The canvas initialises empty, and because onMount only fires once, the data arriving
> a moment later never re-triggers hydration.

**Follow-up: "How did you fix it?"**

> A readiness gate. The tldraw editor component does not mount until React Query reports the
> data ready, so onMount always has something to hydrate from. I also added a fallback that
> detects empty canvas state and retries hydration if data lands late.

**Follow-up: "Why not just call a hydrate function in a useEffect on the data?"**

> That is the tempting fix and it is worse. It means the editor mounts empty and then gets
> populated, so you have a visible flash of an empty canvas and a window where user input can
> land before the document arrives. Gating the mount removes the intermediate state instead of
> patching over it.

**Follow-up: "How would you have caught this earlier?"**

> An integration test that mounts with a cold cache. The whole bug class is "works for everyone
> who already has state". I shipped the fix across two pull requests and the honest lesson is
> that the second one existed because the first did not fully cover the late-arrival case.

**Follow-up: "How did you find it in the first place?"**

> By reproducing it as a new user, which meant clearing storage rather than reading code. Once
> the reproduction was reliable the cause took minutes, because you can log onMount and see
> undefined. Almost all the time went into believing it was environment-specific before I
> accepted it was cache state.

### Q: Storybook across four repositories. Why was that hard?

**Answer:**

> Because none of the four agreed on anything. shadcn-ui was Tailwind v4 with CSS variables and
> 56 primitives, so that one was mostly volume: stories for every component with its variants.
> design-engineer was still on Tailwind v3 and would not render correctly until I migrated it.
> eleven-labs-ui had a theme bug where dark-mode variables were not reaching the Storybook
> iframe. And fiddle itself needed a custom decorator providing a QueryClient, because its
> components expect Remix loader context that does not exist inside Storybook.

**Follow-up: "You mentioned a MutationObserver. What for?"**

> Screenshot timing. The build pipeline captures a story once it has rendered, and the naive
> approach is to wait a fixed number of milliseconds, which is either too short and flaky or too
> long and slow. Instead I observe the DOM for the actual rendered content and treat its
> appearance as the ready signal. Same principle as the Playwright readiness work later: assert
> on the real event, not on elapsed time.

**Follow-up: "Was it worth it?"**

> For shadcn-ui, clearly. Before it, knowing what a primitive looked like or what props it took
> meant reading the source. After it, you browse. What I would change is the setup drift: each
> repo carrying its own Tailwind, Storybook, and build config cost hours of "why does this work
> in repo A and not repo B". I would push for a shared config package, or a monorepo.

### Q: PKCE. Explain the flow and why you need it.

**Why it comes:** A named protocol is a free knowledge check. There is a correct answer and I
should give it precisely.

**Answer:**

> Proof Key for Code Exchange. The plain authorisation code flow was designed assuming the
> client can hold a secret, which a browser app or a desktop client cannot. So the client
> generates a random verifier, hashes it, and sends the hash as a challenge with the
> authorisation request. When it exchanges the returned code for tokens it sends the original
> verifier, and the server checks it against the challenge it stored. An attacker who intercepts
> the authorisation code cannot use it, because they do not have the verifier and cannot derive
> it from the hash. I implemented it on the dashboard alongside allowlist-based access control,
> user types, and template restrictions.

**Follow-up: "Why not the implicit flow?"**

> It puts the access token in a URL fragment, so it lands in browser history and referrers, and
> it has no refresh path. It is effectively deprecated. PKCE is what replaced it.

### Q: What does non-blocking chat mean?

**Answer:**

> The original send flow waited on everything before the UI moved: write to the database,
> invalidate the React Query cache, wait for the refetch, then render. Several round trips
> before the user sees their own message. I restructured it so the message goes into the local
> cache optimistically and renders immediately, the database write goes out async, the model call
> fires in parallel, and the response streams back token by token.

**Follow-up: "What happens when the write fails after you have already shown it?"**

> That is the cost of optimism and you have to handle it explicitly rather than hope. Retry,
> and on final failure surface an error toast and mark the message as unsent rather than
> silently dropping it. The rare bad case is worth the common good case here, because chat is
> the primary interaction and latency in it is the whole feel of the product.

**Follow-up: "You also fixed double submission. Same area?"**

> Same input, different problem. Two fast Enter presses sent the message twice, a straightforward
> race. A submitting flag disables the input on first submit and clears when the response starts
> streaming, plus a debounce guard.

### Q: Anything else in that period you would call interesting?

Two smaller stories I keep in reserve, both good if the interviewer wants breadth rather than
depth:

**The clipboard bug.** Users interacted with the live preview iframe, then tried to copy on the
canvas, and nothing happened. The iframe steals document focus, and the clipboard API requires
the document to be focused. Fix was a focus restoration handler when the user clicks back onto
the canvas. Worth telling because the symptom and the cause look unrelated.

**Sandbox expiry.** e2b sandboxes die after two hours with no error and no callback. The object
still exists, it just stops answering. Users came back from a break to a dead preview. I added
a health check before operations and an auto-recreation flow that spins up a fresh sandbox from
the same template and re-injects the current code. The subtle part was making sure in-flight
operations do not race the recreation.

---

## Part 7: fiddle-factory, intern

Resume bullets under review:

1. Migrated the canvas from react-flow to tldraw: custom shapes and tools per component type,
   preview renderers, and converters that carried existing documents between two canvas models.
2. Moved cloud sandboxes from StackBlitz WebContainers to e2b for reliable installs, and built
   the "make real" flow that turns a canvas drawing into a generated component.

### Q: Walk me through the react-flow to tldraw migration.

**Why it comes:** Every time. It is the most concrete, largest-scope claim on the resume. The
bullet now names what the migration required rather than how many files it touched, so the
natural probe is the converters, which is exactly where I want it.

**Answer:** use the worked example in Part 3. Claim, mechanism, number, tradeoff.

**Follow-up: "How big was it?"**

> Around 84 files, in four groups. Removing the node-based system, which touched everything that
> referenced a node type. Custom tldraw shapes, one per component type, each with its own props
> schema and renderer. Tools for placing and manipulating them. And the data converters, which
> were the fewest files and the largest share of the work.

Volunteering 84 here is fine and it is not the same as putting it on the resume. Offered inside
an answer it sizes the migration for someone who asked. Printed as a bullet it was a claim about
me, and the follow-up to a claim about me is always harder than the follow-up to a detail.

**Follow-up: "Why were the converters the hard part?"**

> Because the two libraries model a canvas differently rather than differently-named. react-flow
> stores nodes with position, dimensions, and edges between them. tldraw stores shapes with
> props, rotation, opacity, and parent-child relationships. There is no field-for-field mapping.
> Grouped react-flow nodes had to become tldraw frames, which is a structural change rather than
> a rename, and every existing user document had to come through it without loss.

**Follow-up: "How did you validate the conversion?"**

> Round-trip on real documents rather than synthetic ones, because the edge cases live in what
> users actually drew. The honest gap in what I did is that I would build the converter as a
> pure function with a fixture corpus from day one, so conversion is testable without a canvas.

**Follow-up: "Why not stay on react-flow and extend it?"**

> Because the mismatch was in the model, not the features. react-flow is a node-graph library
> and it is good at that. fiddle needed freeform drawing, arbitrary shapes, and a Figma-like
> feel, and building that on a graph library means fighting it forever. Migrating cost weeks
> once. Fighting it costs every feature.

### Q: WebContainers to e2b. Why?

**Answer:**

> WebContainers run the whole sandbox in the browser, which is elegant until it is not. We hit
> memory limits, package installation failures, and browser compatibility problems, and all
> three land on the user as "the preview is broken" with nothing we can do. e2b runs real Linux
> sandboxes in the cloud, so installs behave like installs. The cost is network latency and a
> two-hour session limit, and I built custom templates and session management around that.

**Follow-up: "Is moving compute to the cloud not a step backwards for a design tool?"**

> For latency, yes. For reliability, no, and reliability was the thing failing. If I were
> optimising now I would look at keeping a warm sandbox pool so the first preview does not pay
> cold start, but that is a cost decision as much as an engineering one.

### Q: What is the "make real" flow?

**Answer:**

> You draw a rough component on the canvas and get generated code back. Mechanically the
> drawing becomes an attachment on the chat message, so the model receives the image alongside
> the text prompt, and there is an API route that handles the request and shapes the response
> into something the canvas can place. It reuses the chat path rather than inventing a parallel
> one, which is why the attachment framing mattered.

**Follow-up: "How do you handle a bad generation?"**

> You keep it cheap to retry and you never destroy the drawing. The generation is additive
> rather than a replacement of the user's input, which is the difference between a tool you
> experiment with and one you are afraid of.

---

## Part 8: the skills block

This section is where AI screens do the most damage, because it is a list of claims with no
evidence attached. The interviewer picks one and drills. Below, each line with what I can
actually defend.

### Languages

Now reads TypeScript, JavaScript. It used to carry Rust, Go, C, Python, and Shell as well.

**TypeScript.** Defensible everywhere. Expect a type-system question.

_"What is a TypeScript feature you use that most people do not?"_

> Discriminated unions to make invalid states impossible. In the agent contract, a session is a
> union over its states rather than an object with optional fields, so you cannot hold a
> reference to a session that is both starting and streaming. The alternative, an object with
> five optional properties, pushes the check to every reader and they will not all do it. Same
> instinct behind giving the store's slice map an actual type instead of a comment describing it.

_"Where do you draw the line on typing?"_

> At boundaries. Anything crossing a process, a wire, or a file gets parsed and typed there, and
> internal code trusts the types rather than re-checking. In StashBase I consolidated wire
> contracts into one shared directory for exactly that reason, and separately made sure
> HTTP-only fields did not leak into the indexer's status type.

**Rust, which is off the skills line but still on the page.** Cutting the languages line does
not make this question go away, because mdt is a Rust project and it is one of only two projects
I list. The difference is that Rust now arrives as "tell me about this project" rather than as
"you claim this language", which is a much better question to be asked. Either way I set the
floor in the first sentence rather than let the machine find it four questions later.

_"I see Rust on here. Tell me about your Rust experience."_

> I should be straight with you about the level. I built mdt in Rust, a terminal Markdown
> editor, and I shipped it to crates.io, so it is a real thing that works. But I built it to
> learn the language rather than from already knowing it. I can talk about what the tool does
> and the decisions I made, and I would not claim to be someone you should hire for Rust.

That answer is not a loss. It is a calibrated self-assessment, which is a scored positive, and
it redirects the interview to what I actually built. The thing that loses points is answering
two Rust questions confidently and falling apart on the third, because then the machine has both
the low ceiling and evidence that I oversold.

Go needs no script now that it is off the page and has no project behind it. If it comes up from
something I say out loud, the honest sentence is that I have written some and it is not a language
I would put myself forward on. The lesson generalises: an AI interviewer keeps drilling until it
finds a floor and then scores the floor, so the only winning move is not to advertise a floor I do
not want measured.

### Frameworks: React 19, Next.js 15, Node.js, Express.js, Tailwind CSS 4, Remix

_"What is actually new in React 19 and are you using it?"_

> The additions I care about are Actions and the form integration around them, the use hook for
> reading promises and context during render, ref as an ordinary prop so forwardRef stops being
> boilerplate, and the built-in document metadata handling. The compiler is the bigger shift
> because it removes most manual memoisation, though it is not something I would claim to have
> tuned in production.

_"You have Remix and Next.js both. When would you pick which?"_

> I did not pick Remix, it predated me at fiddle, and I should say that rather than
> retroactively justifying it. Having worked in it, its loader and action model fits a tool that
> is constantly loading project state and submitting changes, and nested routing mapped cleanly
> onto canvas plus sidebar plus chat. I reach for Next when I want the App Router and React
> Server Components, which is what trove/cn uses.

_"Tailwind v4, what changed?"_ Covered in Part 5. CSS-first configuration, theme as custom
properties, no JavaScript config object.

### Libraries: shadcn/ui, Radix UI, Framer Motion, Zustand, Storybook, tldraw

_"Zustand over Context or Redux. Defend it."_

> Context is not a state manager, it is a dependency injection mechanism, and using it for
> frequently-changing state re-renders every consumer regardless of what they read. Zustand
> gives you selector-level subscriptions, so a component that reads one field re-renders when
> that field changes and not otherwise. Compared to Redux it is far less ceremony for the same
> unidirectional model. The tradeoff is less structure, so a large store needs discipline. In
> StashBase I split the store into typed slices and moved feature logic out of components into
> the slices that own it, because the store had started collecting whatever needed a home.

_"shadcn/ui is not a library. Why is it on your list?"_

> Correct, and that is the point. It is a distribution model: the components are copied into
> your repo as source rather than installed as a dependency, so you own and modify them. I have
> built on it, contributed Storybook coverage for 56 primitives at fiddle, and trove/cn ships in
> the same registry format. I would not describe it as a dependency in my stack, I would describe
> it as a pattern I use.

_"tldraw. What did you extend?"_ Custom shapes with their own props and renderers, tools for
placing them, and preview components. See Part 7.

### Databases

Now reads PostgreSQL, Supabase. MongoDB and Firebase are gone, since nothing on the page used
them.

PostgreSQL is the one with evidence behind it, from the storyboard schema and migration work.
Supabase has no artifact on this resume either, so if it gets probed I answer at the level of
what it is, Postgres with auth and storage wrapped around it, and move to the schema work. It
survived the cut because it sits next to the thing I can defend rather than off on its own. If I
trim again, it is the next to go.

_"Tell me about a schema you designed."_

> The storyboard model at SamurAI. Storyboards were project-owned and needed to become
> scene-owned, so a Scene table sits between project and frames, everything downstream keys off
> scene, and old projects resolve to a default scene rather than being migrated destructively.
> The interesting constraint was that final storyboards stopped being stored and became an
> aggregation across scenes, because storing them meant two sources of truth that could disagree.

_"Relational or document, how do you choose?"_

> By whether the data has relationships I will query across. The storyboard case is obviously
> relational: scenes belong to projects, frames belong to scenes, versions belong to frames, and
> I query across all of it. I would reach for a document store when the unit of read and write
> is the whole document and there is no cross-entity querying, which is a narrower case than it
> gets used for.

The document-store answer above is the safe way to talk about that side without claiming a
database I have not shipped on. It is a design opinion, not a proficiency claim, and those are
free.

### DevOps: Git, Docker, GitHub Actions, CI/CD, Linux, Bun, Vercel

_"Describe a CI pipeline you built."_

> The StashBase one is the interesting answer, because it is Electron and cross-platform. There
> are required checks and manual ones: typecheck, lint, unit, and a Playwright suite split into
> smoke, functional, and visual projects. Visual baselines are committed per platform and
> refreshed through a manual workflow rather than automatically, because a self-updating baseline
> is not a test. The renderer suite runs on Windows because that is where the path handling
> breaks, and I hit exactly that when the layer-boundary lint could not find its exemptions on
> Windows path separators. Release packaging and development both moved to Node 24. There is also
> an initial-JS budget so bundle growth fails the build rather than being noticed a year later.

_"Why Bun?"_ Install and script speed, and it runs TypeScript directly. The risk is
compatibility gaps against a Node-shaped ecosystem, which is why CI at StashBase validates on
Node rather than assuming parity.

### Concepts: REST APIs, OAuth/PKCE, WebSockets, component architecture, performance

_"Where have you used WebSockets?"_

> The real-time workspace sync at SamurAI, where a generation run started by one collaborator has
> to appear for the others. Streaming responses are a related but different case: the agent
> transcript in StashBase and the chat at fiddle both stream deltas, and for one-directional
> streaming server-sent events are a simpler fit than a socket. I would pick a socket when both
> ends need to push.

_"You listed performance optimization. Give me a measured one."_

> Two honest ones. The chat send path at fiddle, where the win was perceived rather than
> measured in milliseconds: the user sees their message immediately instead of after a database
> write, a cache invalidation, and a refetch. And media delivery at SamurAI, where the metric is
> bytes per gallery view, fixed by giving media URLs distinct roles and serving WebP derivatives
> rather than shipping the original into a thumbnail. I would rather give you those than claim a
> percentage I did not measure.

That last sentence is deliberate. Admitting the boundary of what I measured scores better than
inventing a number, because the follow-up to an invented number is always "how did you measure
it".

---

## Part 9: trove/cn

Resume bullets under review:

1. Open-source registry of interface patterns from real products, rebuilt as copyable React
   source with live previews beside the implementation.
2. Built with Next.js App Router, Base UI primitives, Motion, Shiki, and the shadcn registry
   format; released under the MIT license.

### Q: What problem does trove/cn solve?

**Answer:**

> You see a nice interaction on a real product and you cannot read the code behind it. The
> alternative, a component library, hands you a package with a design system attached that you
> did not ask for. trove/cn rebuilds those patterns from scratch and ships them as source in the
> shadcn registry format, so one add command copies the files into your project. Live preview
> next to the implementation, no runtime dependency, no wrapper package.

**Follow-up: "How is that different from just publishing an npm package?"**

> Ownership. A package is a black box you configure through props, and the moment you need
> behaviour the author did not anticipate you are stuck. Copied source is yours to edit. The
> cost is that you do not get updates, which is a real tradeoff, and it is the right one for
> interface patterns specifically because they are things you want to customise rather than
> consume.

**Follow-up: "What is the registry format and what was hard about it?"**

> A JSON manifest describing each component: its files, its dependencies, its registry
> dependencies. Getting one add command to pull the correct files plus transitive dependencies
> was the fiddly part. I generate the public registry JSON from component metadata rather than
> maintaining it by hand, because a hand-maintained manifest drifts from the source the first
> time someone adds a file.

**Follow-up: "You render dozens of animated previews on one page. Does that not crawl?"**

> That was the main performance problem. Every preview is a live component with real motion, so
> naively mounting them all means dozens of animations running for content nobody is looking at.
> The answer is to not run what is off screen and to keep each preview isolated so one heavy
> example does not affect its neighbours.

**Follow-up: "Why Base UI rather than Radix, given Radix is on your skills list?"**

> Base UI is the successor line from the same direction of thinking, unstyled primitives with
> real accessibility behaviour, and it is where new work is going. Radix is what I have used in
> production. Picking Base UI for a new project and keeping Radix on the resume for the
> production work is accurate rather than inconsistent.

**Follow-up: "How do you decide what goes in?"**

> Whether copying it is worth more than reading it. A pattern earns a place if the interesting
> part is the implementation rather than the idea. The risk is that the collection turns into a
> design system you have to adopt wholesale, which is exactly what I am trying to avoid, so
> coherence has to come from quality rather than from a shared visual language.

---

## Part 10: mdt

Resume bullets under review:

1. Fast, terminal-based markdown viewer and editor: file tree navigation, rendered preview with
   syntax highlighting, vim-style editor, and live split-pane preview.
2. Published on crates.io as mdtui; custom terminal renderer with width-aware wrapping for
   nested lists, blockquotes, and tables.

### Why bullet two changed

It used to read "dirty-flag rendering, file watching with auto-reload, advisory file locking, and
panic-safe terminal teardown". All four are really in the tool. The problem was not accuracy, it
was that naming four systems techniques in one line tells an adaptive interviewer that systems
programming is somewhere it can go, and it would, and about three questions in it would find that
what I understand is the shape of the problem in my own app rather than the shape of the problem
in general.

I built mdt to learn Rust. That is the true version, and the resume should not put a target on
the one part of my profile that cannot take fire.

The current bullet does something better than going quiet. It names the one hard problem in the
project that is not a Rust problem at all. Width-aware wrapping through nested structures is
layout and algorithms, I solved it myself, and I can talk about it for five minutes without
touching the language. So the bullet still invites a probe, which is what a good bullet does, but
it invites the probe I want. The answer is below, under "What was hard about it".

### Where the floor is, and saying so early

mdt stays on the resume because it is genuine evidence: I picked an unfamiliar language, built
something non-trivial, and published it. That is worth having on the page. The framing that
makes it an asset instead of a liability is that I present it as a learning project from the
first sentence.

_"Tell me about mdt."_

> It is a terminal Markdown editor I wrote in Rust. File tree on the left, rendered preview with
> syntax highlighting, a small vim-style editor, and a split pane so the preview updates while
> you type. It is on crates.io as mdtui. I should say up front that I built it to learn Rust,
> not because I already knew it, so I can talk about what it does and why I made the choices I
> made, and I would not hold myself out as a systems engineer.

Twenty seconds, and it has done three things. Established the artifact is real, set the ceiling
before the machine probes for it, and pointed the follow-up at product decisions rather than
language internals. That last part matters most, because decisions are the thing I can defend.

### Q: Why build this when glow exists?

This one is safe. It is a product question, and product judgment is not what I am short on.

> glow is a viewer. No editing, no file tree, no live preview. What I wanted was the whole loop
> in one place: browse, read, edit, and watch the render update. The cost I was trying to remove
> was switching between a file manager, a viewer, and an editor for something as small as fixing
> a typo in a note.

**Follow-up: "Why Rust?"**

> Honestly, partly because I wanted to learn it. The reasoning that made it a sensible choice
> for this particular project is that a terminal UI redrawing while you type is a latency
> problem, and ratatui was the best TUI library I found. But I am not going to pretend I did a
> language evaluation. I picked a project that would force me to learn something.

That answer is better than a fabricated tradeoff analysis. An invented justification invites
"what specifically about the garbage collector concerned you", and then I am defending a position
I never held.

### Q: What was hard about it?

Answer at the level of the problem, not the language. Text layout in a terminal is a real
problem and explaining it well does not require Rust expertise.

> Text wrapping, more than I expected. A paragraph wraps at the terminal width, but a list item
> inside a blockquote wraps at the width minus everything it is nested in, and the continuation
> lines have to line up under the content rather than under the bullet. Every nesting level
> changes the available width, so I had to carry that width down through the layout rather than
> compute it once. The related decision is that code blocks and tables do not wrap at all, they
> truncate with an indicator, because a wrapped table is unreadable and a truncated one is not.

**Follow-up: "Why write your own renderer instead of using a crate?"**

> Because the output target is a terminal and I needed the layout tied to scrolling and to the
> split preview. An off-the-shelf renderer gives you formatted text, but it does not know about
> the pane it is rendering into. Whether that was the right call I am genuinely not sure. It was
> a lot of work and part of the reason I did it was that writing the renderer was the point.

Admitting I am not sure is safe here and it is true. It reads as judgment, and it closes the
line of questioning rather than opening a deeper one.

### If an older copy of the resume is in play

Older versions are already out on job boards and in inboxes, and I cannot recall them, so I
should still be able to take these four. The rule for all of them is the same: describe what it does in my app, why I wanted it, and then stop and say I am
at the edge. Do not extrapolate to how the operating system works.

**Dirty-flag rendering.** Safe, and the easiest of the four.

> The screen only redraws when something changed. A terminal UI that redraws on a loop burns CPU
> doing nothing, so sitting idle costs nothing and typing costs one redraw. The preview is also
> debounced so it waits for a pause rather than re-rendering the document on every keystroke.

**File watching with auto-reload.** Also safe, because it is a behaviour question.

> If the file changes on disk, the view reloads. The part that needed care is that it must not
> reload over your own unsaved edits, so it tracks whether the buffer is dirty before replacing
> anything.

**Advisory file locking.** Answer narrowly and stop.

> It stops two instances of mdt from editing the same file and overwriting each other. Advisory
> means only programs that check for the lock respect it, so it does not stop some other editor
> from writing the file. That was the level I needed, since I was defending against my own tool,
> not against the whole system. If you want to go further into file locking than that, I would be
> guessing.

That last sentence is the whole technique. It answers the question honestly and closes the door
in the same breath.

**Panic-safe terminal teardown.** Same shape.

> A terminal UI puts the terminal into raw mode, and if the program dies without putting it back
> you are left with a broken shell. So restoring it is wired into the crash path and not only the
> normal exit path. I hit that during development, which is how I learned it needed doing.

"I hit that during development" is worth including. It says the feature came from a real problem
rather than from a blog post, which is the honest provenance and a better story than expertise
would be.

### What I do not do in this section

Volunteer ownership semantics, borrow-checker anecdotes, async runtimes, or any comparison
between Rust and another systems language. Nothing in that territory helps me and all of it
invites a follow-up I cannot take. If the interviewer walks there anyway, the exit is the same
sentence every time: that is past where I have actually worked, here is what I did do.

## Part 11: education and the non-CS question

Resume line: B.Tech Mechanical Engineering, NIT Durgapur, 2022 to 2026.

### Q: You studied Mechanical Engineering. How did you end up here?

**Why it comes:** Every time. It is the single most predictable question on my resume. There is
no version of this interview where it does not appear, so there is no excuse for it being
unrehearsed.

**Answer, forty seconds, no apology:**

> I got into programming through wanting to know how things worked underneath, and that never
> stopped at the web layer. It pulled me into terminal UIs, file system behaviour, and Rust. NIT
> Durgapur gave me the engineering fundamentals, and the software is self-taught and then
> tested against production work: fiddle from 2025, SamurAI, and now StashBase. The practical
> effect is that I did not learn one framework and stop, I learned by building things at
> different levels of the stack, and I think that shows in the range on the page.

**What I do not do:** apologise, over-explain, or call it a disadvantage. The interviewer is not
checking my credentials, it is checking whether I am defensive about them. Confidence is the
scored variable here, not the degree.

**Follow-up: "Do you feel gaps from not having a CS degree?"**

> Specific ones, and I fill them deliberately. I have not done a formal algorithms course, so
> when a problem is genuinely algorithmic I am slower to recognise the standard shape. What I
> have instead is a lot of time spent below the framework layer, which is why I can talk about
> terminal raw mode and advisory locking rather than only about React.

**Follow-up: "Why not mechanical engineering as a career?"**

> Short and honest: I found the work I wanted to do every day, and it was this. There is no
> interesting story there and inventing one would be worse than the truth.

---

## Part 12: behavioural questions, answered from resume material

The AI screen mixes three or four of these in. The rule is the same as the technical ones. One
story, named specifics, and a consequence. Vague answers score worst here because everyone gives
them.

### "Tell me about a hard bug."

Canvas hydration race. Part 6. It is the best answer I have because the root cause is
non-obvious, the reason nobody found it is interesting, and I know what I would change.

Backup answer if I have already used it: e2b sandboxes dying silently after two hours.

### "Tell me about a technical decision you made and its tradeoff."

Enforcing the StashBase renderer layers with lint rather than documentation. Part 4. The whole
point is that the first version of the fix, moving files, would not have survived, and I knew
it. It also gives me the cleanest tradeoff statement: the lint config had to be calibrated so
the repo lands clean, because a config that ships hundreds of warnings gets ignored and then it
is documentation again.

### "Tell me about something you built end to end."

Multi-scene storyboards. Part 5. Data model, migration, APIs, frontend routes, regression tests
proving scenes cannot leak into each other, and a later deletion when the product changed.

### "Tell me about working in an unfamiliar codebase."

Five repositories at fiddle with no shared configuration. The specific detail that makes this
real is that each carried its own Tailwind version and Storybook config, so behaviour differed
between repos for reasons that had nothing to do with the change I was making. The answer to how
I coped is that I worked in dependency order, shared libraries before consumers, and wrote pull
request descriptions with enough context that someone in a different repo could follow.

### "Tell me about feedback or a code review that changed something."

The link navigation work in StashBase. I shipped it, an adversarial review found real problems in
the link change, and I addressed them in a follow-up before it merged. The useful part is the
order: I would rather the review find it than a user, and I shipped the fixes as their own
commit so the record shows what was wrong rather than hiding it in an amend.

### "Tell me about something you removed."

Two. The iframe screenshot capture path at fiddle, where the pipeline had two sources of
screenshots, a flaky timing-dependent one and a deterministic one, and I deleted the flaky one
rather than fixing it. And part of the multi-scene surface at SamurAI when the product direction
changed. Removing something I built two months earlier is the harder of the two, and it is the
better story.

### "How do you use AI tools?"

Directly, because the interviewer already knows the answer is yes and is testing for judgment.

> Constantly, for exploring unfamiliar APIs, mechanical refactors, and challenging an approach
> before I commit to it. What I keep is architecture, security, and anything with complex state.
> I review every diff and I do not keep code I cannot explain, which is a real filter and not a
> slogan. Working on StashBase, where the product is an agent surface, has made me more
> particular rather than less: the parity tests exist precisely because I do not trust two
> implementations to stay honest without something that fails.

### "Where do you want to be in two years?"

> Doing product engineering deep enough that the frontend and the system underneath are the same
> job. The work I have liked most is the work where those met: the storyboard migration, the
> agent contract, the tldraw conversion. I would rather get better at that than move away from
> building.

---

## Part 13: traps and how to survive them

**The stack rank.** "You have React, Rust, Go, and C. Rank yourself in each." The trap is that
inflating one answer poisons the whole session, because everything after it is checked against
the claim. Give the ordering and be blunt about the drop: strong in TypeScript and React, that is
what I do every day and what I want to be asked about. Rust is one shipped project and a learning
exercise. Go and C are less than that. A calibrated self-assessment is a scored positive. An
uncalibrated one gets caught in the next question and costs more than the honest version ever
would.

**The definition check.** "What exactly is a golden evaluation?" "What does advisory mean?"
"What is PKCE protecting against?" Every piece of jargon I wrote is a candidate. If I cannot
define it plainly, I should not have written it. Answers are in Parts 5, 10, and 6.

**The number check.** 57, 49, 84, 56, 4, 5. Have the breakdown for each. If I do not remember,
say so and give the shape rather than guessing a wrong number, because a wrong number is worse
than an approximate one.

**The scope check.** "You said you built the pipeline. Who else worked on it?" Claiming a team's
work is the fastest way to fail a reference. Say what was mine and what I contributed to. On
StashBase specifically, it is open source and my commits are public, so precision costs me
nothing and vagueness costs me everything.

**The silence trap.** The interviewer moves on if I pause. When I need a moment, I narrate:
"the interesting part of that one was the data conversion, let me take that first". That is
speech, not silence, and it buys the same thinking time.

**The depth cliff.** It will keep going deeper until I stop being able to answer. That is by
design and reaching the bottom is not a failure. The failure is bluffing at the bottom. The
right move is to name the boundary and offer the adjacent thing I do know: "I have not
implemented that myself. What I have done next to it is X."

**The unrelated deep-dive.** A frontend role will still ask about Postgres, or CI, or whatever
else is on the page, because the machine reads the whole page. Preparing only frontend material
for a frontend interview is the most common way to be surprised by this format. The corollary,
and the reason the audit in Part 2 matters more than any single rehearsed answer, is that
anything I leave on the page is something I have agreed to be tested on.

---

## Part 14: the ninety-second cheat sheet

Numbers, in case one is asked cold. The first group is on the resume, so I must have these. The
second group is not, so I offer them inside an answer when they size something, and never lead
with them.

| On the page          | Detail                                         |
| -------------------- | ---------------------------------------------- |
| shadcn-ui primitives | 56, all with Storybook stories                 |
| Storybook repos      | 4                                              |
| Model providers      | 4 for generation: Runway, Veo, Seedance, Kling |
| StashBase            | Open source, commits public under PPRAMANIK62  |

| Held in reserve      | Detail                               |
| -------------------- | ------------------------------------ |
| tldraw migration     | ~84 files, May to Aug 2025           |
| SamurAI              | 4 codebases, Apr to Jul 2026         |
| fiddle contractor    | 5 repositories, Dec 2025 to Apr 2026 |
| e2b sandbox lifetime | 2 hours, silent expiry               |

The five stories I should never have to reach for:

1. Canvas hydration race. tldraw onMount fires once and early, cold React Query cache, blank
   canvas for every new user.
2. Multi-scene storyboards. Project-owned to scene-owned, migration with default-scene
   resolution, legacy routes kept working, tests proving no cross-scene leakage.
3. Shared Agent Contract. One interface over Claude and Codex, parity tests as the thing that
   catches drift, capabilities rather than throwing methods.
4. tldraw migration. Node-and-edge model to a shape model, the converters were the work, grouped
   nodes became frames.
5. Renderer layer enforcement. Cycles between common and store, moved the shared vocabulary,
   then made oxlint enforce it because a convention lasts one pull request.

Openers that get me the ramp:

Lead with the migration or the hydration bug. Both are concrete, both have a non-obvious root
cause, and both give me a number in the first two sentences.

Closers, when it asks whether I have questions:

Ask about the code, not the company. What does a first task look like. How much of the frontend
is component work versus system work. What is the thing in the codebase everyone is quietly
afraid of. That last one gets honest answers.
