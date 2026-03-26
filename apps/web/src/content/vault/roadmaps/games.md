# Multiplayer Game Development — Learning Path

## ✅ Why This Section Exists

Your company is implementing game/multiplayer features. You want hands-on
experience in this domain. You love low-level programming. This section
maps out the entire multiplayer game development landscape and provides
10 progressive projects to build real expertise.

**The goal: become the person in the room who understands what's happening
under the hood when someone says "netcode."**

### Progress

- [x] Core Networking Concepts (UDP vs TCP)
- [x] Networking Strategies (Lockstep, Snapshot, State Sync)
- [ ] Project 1: rawnet — UDP Echo Server
- [ ] Project 2: ticktock — Multiplayer Pong
- [ ] Project 3: authserver — Authoritative Server
- [ ] Project 4: predict — Client-Side Prediction
- [ ] Project 5: tinecs — ECS from Scratch
- [ ] Project 6: rollback-fighters — Rollback Netcode
- [ ] Project 7: netproto — Custom Reliable UDP
- [ ] Project 8: voxelworld — Multiplayer Voxel World
- [ ] Project 9: arenanet — Scalable Game Server
- [ ] Project 10: physworld — Deterministic Physics

---

## ✅ The Landscape: Game Networking vs Web Networking

Game networking is fundamentally different from web networking:

| Aspect            | Web (HTTP/REST)         | Game Networking                         |
| ----------------- | ----------------------- | --------------------------------------- |
| Protocol          | TCP (reliable, ordered) | UDP (unreliable, unordered) — by design |
| Latency tolerance | 200-500ms acceptable    | 16-50ms or it "feels wrong"             |
| Data pattern      | Request-response        | Continuous stream, 20-128 times/second  |
| State model       | Stateless               | Entire world must stay in sync          |
| Failure mode      | Retry the request       | Can't retry — game already moved on     |
| Serialization     | JSON                    | Custom binary, every byte counts        |

Games use UDP because TCP's reliability guarantees (retransmission, ordering)
add latency. A late packet is worse than a lost packet — you'd rather drop
an old position update than delay the current frame waiting for it.

---

## ✅ The Three Fundamental Networking Strategies

Glenn Fiedler (gafferongames.com — THE bible) defines three strategies:

### 1. Deterministic Lockstep

Send only inputs, both sides simulate identically. Bandwidth scales with
input size, not world size. Used in RTS games (StarCraft, Age of Empires).
Hard because floating-point determinism is a nightmare.

### 2. Snapshot Interpolation

Server sends full world snapshots, clients interpolate between them.
Simple, robust, no determinism needed. Used in FPS games (Quake, Overwatch).
Bandwidth scales with world size.

### 3. State Synchronization

Hybrid: simulation runs on both sides, server sends corrections. Only sends
updates for objects that changed. Used in physics-heavy games. Complex but
bandwidth-efficient.

---

## ⏳ The Standard Tech Stack

| Layer              | AAA / Corporate                             | Indie / Low-Level Hacker                       |
| ------------------ | ------------------------------------------- | ---------------------------------------------- |
| **Language**       | C++ (Unreal), C# (Unity)                    | Rust, C, Zig, Go                               |
| **Engine**         | Unreal, Unity                               | Bevy (Rust), Godot, custom                     |
| **Networking**     | Unreal Replication, Netcode for GameObjects | lightyear, bevy_replicon, raw sockets, enet    |
| **Protocol**       | UDP with custom reliability                 | Raw UDP, netcode-rs (Glenn Fiedler's protocol) |
| **ECS**            | Built into engine                           | Bevy ECS, hecs, specs, flecs (C/C++)           |
| **Serialization**  | Protobuf, FlatBuffers                       | Custom binary, bitcode (Rust), MessagePack     |
| **Rollback**       | In-house                                    | ggrs (Rust GGPO), GGPO (C++)                   |
| **P2P (browser)**  | Proprietary                                 | matchbox (Rust/WebRTC)                         |
| **Session DB**     | Custom                                      | Redis, PostgreSQL                              |
| **Infrastructure** | Dedicated bare-metal                        | Fly.io, dedicated VPS, edge compute            |

---

## ⏳ The Hard Problems (and why they're hard)

1. **Clock Synchronization** — Two machines never agree on "now." You need
   NTP-like sync to sub-millisecond precision, or interpolation breaks.

2. **Latency Compensation** — Player A shoots where Player B was 100ms ago.
   Do you hit? This is "lag compensation" — Valve wrote the definitive
   article on it.

3. **Cheating** — If the client runs the simulation, clients can lie.
   Authoritative server is the only real defense, but it adds latency.

4. **Determinism** — For lockstep to work, EVERY machine must compute the
   EXACT same result. Floating-point operations don't guarantee this
   across platforms.

5. **Bandwidth** — Sending full world state 60 times/second to 100 players
   doesn't scale. You need delta compression, interest management, and
   priority systems.

6. **Networked Physics** — Physics objects interacting while synchronized
   across a network is the single hardest problem in game networking.

---

## 🔮 The 10 Projects: Beginner to Nightmare

Each project builds on concepts from the previous one. The stack
recommendation is Rust throughout (low-level + modern systems lang +
excellent game ecosystem).

---

### Project 1: `rawnet` — UDP Echo Server + Binary Protocol

**Difficulty:** Beginner | **Time:** 1 week | **Language:** Rust

**What you build:**
A raw UDP server/client that sends and receives custom binary messages.
No libraries, no frameworks — just `std::net::UdpSocket`. Define a binary
message format (packet header + payload), implement serialization/
deserialization by hand, handle packet loss gracefully.

**Structure:**

```
src/
  protocol.rs    — packet header struct, serialize to bytes, deserialize
  server.rs      — UdpSocket::bind, recv_from loop, echo back
  client.rs      — send_to, recv_from with timeout
  main.rs        — CLI to run as server or client
```

**Critical learnings to focus on:**

- **Why UDP, not TCP**: Run both side by side. Measure latency. TCP has
  head-of-line blocking — one lost packet delays ALL subsequent packets.
  UDP lets you just move on.
- **Binary serialization by hand**: Write `to_bytes()` and `from_bytes()`
  manually. Understand byte order (big-endian vs little-endian), alignment,
  and why JSON is too fat for games.
- **Non-blocking I/O**: Use `set_nonblocking(true)`. In games, you can't
  block on a socket — check for packets, process if they exist, keep the
  game loop running.
- **Packet structure design**: Header (sequence number, packet type,
  timestamp) + payload. Foundation of everything that follows.

**Reference:** `balintkissdev/multiplayer-game-demo-rust` on GitHub.

**Read first:** Glenn Fiedler's "Sending and Receiving Packets" and
"UDP vs TCP" on gafferongames.com.

---

### Project 2: `ticktock` — Multiplayer Pong with Fixed Timestep

**Difficulty:** Beginner+ | **Time:** 2 weeks | **Language:** Rust + macroquad

**What you build:**
Classic Pong where two players play over the network. Server runs the
simulation at a fixed tick rate (60Hz). Clients send inputs, server
broadcasts game state. Clients render at whatever FPS they can,
interpolating between server snapshots.

**Structure:**

```
shared/
  game_state.rs  — ball position, paddle positions, score (serializable)
  input.rs       — PlayerInput { up: bool, down: bool }
  protocol.rs    — message types (Input, StateUpdate, JoinGame)
server/
  main.rs        — fixed timestep loop, accept connections, broadcast state
client/
  main.rs        — render loop, send inputs, receive state, interpolate
```

**Critical learnings to focus on:**

- **"Fix Your Timestep!"**: Glenn Fiedler's most important article. Game
  logic MUST run at a fixed rate (e.g., 60 updates/sec), decoupled from
  render framerate. Accumulate time, step in fixed increments, render
  with interpolation.
- **The game loop**: `while running { process_input(); update(fixed_dt);
render(interpolation_alpha); }` — the heartbeat of every game.
- **Tick rate**: Server simulation rate. CS2 runs at 64Hz (now 128Hz).
  Higher = smoother but more bandwidth/CPU. Feel the difference between
  20Hz, 60Hz, and 128Hz.
- **Input delay**: Client sends input, waits for server to process it,
  then sees the result. That's a full round-trip of latency. This is
  what the next projects solve.

**Read first:** Glenn Fiedler's "Fix Your Timestep!" on gafferongames.com.

---

### Project 3: `authserver` — Authoritative Server for a 2D Top-Down Shooter

**Difficulty:** Intermediate | **Time:** 3 weeks | **Language:** Rust + macroquad/Bevy

**What you build:**
A 2D top-down shooter. Server is authoritative — the only source of truth.
Clients send inputs (move direction, shoot), server simulates everything
(movement, collisions, bullet hits), clients just render what the server
tells them. Add entity interpolation so other players look smooth.

**Structure:**

```
shared/
  components.rs  — Position, Velocity, Health, Bullet
  input.rs       — InputCommand { move_dir, shoot, aim_angle }
  protocol.rs    — ClientMessage, ServerMessage, entity snapshots
server/
  world.rs       — HashMap<EntityId, Entity>, tick-based update
  systems.rs     — movement, collision detection, bullet lifecycle
  network.rs     — accept connections, assign player IDs, broadcast
client/
  interpolation.rs — buffer server snapshots, interpolate between them
  renderer.rs      — draw entities at interpolated positions
  input.rs         — capture input, send to server every tick
```

**Critical learnings to focus on:**

- **Authoritative server**: The server is GOD. The client is a dumb
  terminal. If the client says "I moved to (100, 200)" the server says
  "No, you're at (99, 198) because there's a wall." Fundamental
  anti-cheat architecture.
- **Entity interpolation**: Clients render a slightly past state (~100ms
  behind server). Between two snapshots, lerp positions. This is why
  other players look smooth even with low tick rates.
- **Snapshot buffering**: Store the last N server snapshots. For rendering,
  find the two that bracket "render time" and lerp between them.
- **Input-to-render latency**: Press a key, wait ~100-200ms to see
  movement. Unacceptable for the local player. Project 4 solves this.

**Reference:** Gabriel Gambetta's entire "Fast-Paced Multiplayer" series
at gabrielgambetta.com/client-server-game-architecture.html (4 parts).

---

### Project 4: `predict` — Client-Side Prediction + Server Reconciliation

**Difficulty:** Intermediate+ | **Time:** 3-4 weeks | **Language:** Rust + Bevy

**What you build:**
Extend Project 3. Local player's movement responds instantly (client-side
prediction). Client simulates local player ahead of server. When server
sends authoritative state, client compares against prediction, and if
there's a mismatch, replays all inputs since that server tick to
reconcile.

**Structure:**

```
client/
  prediction.rs     — run local player simulation ahead of server
  input_buffer.rs   — ring buffer of timestamped inputs (last 1-2 seconds)
  reconciliation.rs — on server update: compare predicted vs actual,
                      if mismatch: snap to server state, replay inputs
  jitter_buffer.rs  — smooth out network jitter in incoming packets
```

**Critical learnings to focus on:**

- **Client-side prediction**: Client doesn't wait for server. Applies
  input IMMEDIATELY and simulates locally. Player sees instant response.
  But client state is speculative — it could be wrong.
- **Server reconciliation**: Server says "at tick 150, your position was
  X." Client checks: "I predicted Y at tick 150." If X != Y: snap to X,
  replay all inputs from tick 151 to now. Corrects prediction invisibly.
- **Input buffering**: MUST keep a history of inputs with tick numbers.
  Without this, reconciliation is impossible. Use a ring buffer.
- **When prediction fails visibly**: If server disagrees significantly
  (someone pushed you), the correction is visible as a "snap." Good
  implementations blend the correction over a few frames.

**This is THE project that teaches you how modern FPS games feel responsive.**

**Read first:** Gabriel Gambetta's "Client-Side Prediction and Server
Reconciliation" at gabrielgambetta.com.

---

### Project 5: `tinecs` — ECS Game Engine from Scratch

**Difficulty:** Intermediate+ | **Time:** 3-4 weeks | **Language:** Rust

**What you build:**
A minimal but real Entity Component System from scratch. No Bevy, no hecs.
Write the archetype storage, the query system, the system scheduler. Build
a simple game on top of it to prove it works.

**Structure:**

```
src/
  world.rs       — World { entities, archetypes, component_storage }
  entity.rs      — Entity is just a u32 ID (generation + index)
  component.rs   — ComponentId, type-erased storage via TypeId
  archetype.rs   — groups of entities with same component set, SoA storage
  query.rs       — Query<(&Position, &mut Velocity)> — iterate archetypes
  system.rs      — System trait, SystemScheduler (topological sort)
  commands.rs    — deferred spawn/despawn/insert
game/
  components.rs  — Position, Velocity, Sprite, Health, Collider
  systems.rs     — movement_system, collision_system, render_system
  main.rs        — create World, register systems, game loop
```

**Critical learnings to focus on:**

- **Data-oriented design**: OOP says "objects have data and behavior."
  ECS says "data is stored separately, behavior is functions over data."
  This is a 10-100x performance difference because of CPU cache.
- **Cache locality**: Storing all Position components contiguously in
  memory (SoA) is cache-friendly. Scattered across heap-allocated game
  objects (AoS/OOP), every access is a cache miss. At 10,000+ entities,
  this DESTROYS performance.
- **Archetype storage**: Groups of entities with the exact same component
  set, stored together. Querying is a table scan of matching archetypes.
- **System scheduling**: Systems declare read/write components. Scheduler
  runs non-conflicting systems in parallel. Free parallelism.
- **Why this matters for networking**: In ECS, "serialize game state" is
  trivial — iterate components, write bytes. "Diff two states" is trivial.
  "Roll back" is trivial — snapshot components, restore. ECS makes ALL
  networking strategies easier.

**Reference:** Bevy's ECS implementation (bevy_ecs crate). Also hecs for
a simpler reference.

---

### Project 6: `rollback-fighters` — Rollback Netcode Fighting Game

**Difficulty:** Advanced | **Time:** 4-6 weeks | **Language:** Rust + ggrs + macroquad

**What you build:**
A 2D fighting game (2 characters, basic attacks, blocking) with GGPO-style
rollback netcode. Peer-to-peer, both players simulate locally, inputs are
exchanged, and when a remote input arrives late, the game rolls back to
that frame, applies it, and re-simulates forward to the current frame.

**Structure:**

```
src/
  game_state.rs    — Clone + Eq + Serialize, fully deterministic
  input.rs         — PlayerInput, InputBuffer, input delay/prediction
  simulation.rs    — advance_frame(state, inputs) -> state (PURE function)
  rollback.rs      — state history ring buffer, save/load, resimulate N frames
  network.rs       — P2P connection, input exchange, frame advantage calc
  rendering.rs     — render current predicted state
  main.rs          — save state -> predict inputs -> advance -> sync
```

**Critical learnings to focus on:**

- **Deterministic simulation**: Must be a pure function: same inputs =
  same output, ALWAYS. No randomness (use seeded RNG), no floating point
  (use fixed-point math), no HashMap iteration (non-deterministic order).
- **Rollback mechanics**: Save state every frame. When remote input arrives
  for frame N (you're on N+5): load state at N, apply real input,
  re-simulate N+1 through N+5. All in one frame's time budget.
- **Input prediction**: Predict remote player "does what they did last
  frame." Right ~90% of time. When wrong, rollback corrects it.
- **Frame advantage**: If player A processes frames faster than B, A slows
  down. GGPO manages this — keeps both players within a few frames.

**Used in:** Street Fighter 6, Guilty Gear Strive, Mortal Kombat.

**Reference:** `pond3r/ggpo` (C++), `gschup/ggrs` (Rust port),
outof.pizza/posts/rollback/ (Mario Bros clone with rollback).

---

### Project 7: `netproto` — Custom Reliable UDP Protocol from Scratch

**Difficulty:** Advanced | **Time:** 5-6 weeks | **Language:** Rust

**What you build:**
A production-grade game networking protocol on raw UDP. Implement:
connection management (connect/disconnect with challenge-response),
reliability (selective ACKs), ordering (sequence numbers), fragmentation
(splitting large packets), encryption (AEAD), and congestion control.
This is what enet, GameNetworkingSockets, and netcode-rs do internally.

**Structure:**

```
src/
  socket.rs           — raw UDP wrapper, non-blocking
  connection.rs       — state machine (disconnected -> connecting -> connected)
  handshake.rs        — challenge-response to prevent IP spoofing
  sequence.rs         — sequence number wrapping, comparison (handle overflow)
  reliability.rs      — packet ACK bitfield, selective retransmission
  fragmentation.rs    — split large packets, reassemble, handle missing fragments
  encryption.rs       — ChaCha20-Poly1305 AEAD, key exchange
  congestion.rs       — bandwidth estimation, send rate control
  channel.rs          — unreliable, reliable-ordered, reliable-unordered
  packet.rs           — [header | channel_data | ack_bitfield]
```

**Critical learnings to focus on:**

- **Selective ACKs**: TCP retransmits everything after a loss. Games use a
  bitfield: "I received 100, 99, 98, 97, 95 (missed 96)." Only 96 resent.
- **Sequence number wrapping**: 16-bit (0-65535). When they wrap,
  comparison must handle it correctly.
- **Connection tokens + encryption**: Glenn Fiedler's netcode protocol
  uses encrypted connect tokens to prevent DDoS/IP spoofing.
- **Channel abstraction**: Single UDP socket multiplexes channels —
  unreliable (position updates), reliable-ordered (chat),
  reliable-unordered (asset loading).

**THE low-level networking project.** If you understand this, you
understand what every game networking library does under the hood.

**Reference:** Glenn Fiedler's "Building a Game Network Protocol" series.
`netcode-rs` on crates.io. Valve's GameNetworkingSockets source.

---

### Project 8: `voxelworld` — Multiplayer Voxel World (Minecraft-like)

**Difficulty:** Advanced+ | **Time:** 6-8 weeks | **Language:** Rust + Bevy or wgpu

**What you build:**
A multiplayer voxel world — explore, build, destroy blocks. Server is
authoritative over world state. Chunks loaded/unloaded by player proximity.
World modifications replicated to nearby players. Combines rendering,
networking, spatial data structures, and optimization.

**Structure:**

```
shared/
  chunk.rs         — Chunk<16x16x16>, run-length encoding, serialization
  world.rs         — HashMap<ChunkPos, Chunk>, block get/set
  protocol.rs      — ChunkData, BlockUpdate, PlayerState messages
server/
  world_gen.rs     — procedural terrain (noise functions)
  interest.rs      — spatial hash: which players near which chunks
  replication.rs   — send chunks entering range, block updates to nearby
  persistence.rs   — save/load world to disk (sled/rocksdb/custom)
client/
  chunk_mesh.rs    — greedy meshing: voxels to renderable mesh
  chunk_manager.rs — request chunks, cache locally, mesh on background thread
  world_renderer.rs — frustum culling, render visible chunks
```

**Critical learnings to focus on:**

- **Interest management / Area of Interest**: Server doesn't send entire
  world. Tracks what each player can "see" (loaded chunk radius). Sends
  updates only for that area. How every MMO/open-world game works.
- **Delta compression**: Don't send full chunk on block change. Send
  "block at (3,7,2) in chunk (5,12) changed to Stone."
- **Chunk meshing on background threads**: Meshing is expensive. Do it
  off main thread. Teaches concurrent data pipelines.
- **Spatial data structures**: Octrees, spatial hashing. Systems
  programming problem.
- **Persistence**: World state survives restarts. Memory-mapped files,
  write-ahead logs, or embedded databases.

**Reference:** `andrewgazelka/hyperion` (high-perf Minecraft server in
Rust, uses Bevy ECS). `veloren/veloren` (open-source Rust voxel RPG).

---

### Project 9: `arenanet` — Scalable Game Server with Matchmaking

**Difficulty:** Expert | **Time:** 8-10 weeks | **Language:** Rust + Go

**What you build:**
A multi-service game backend: matchmaking, lobby service, and multiple
game server instances. Players connect to gateway, join lobby, matchmaking
assigns them to a game, server instance spins up, players redirect to it.
After game ends, results persist, players return to lobby.

**Structure:**

```
gateway/
  src/main.rs        — TLS listener, auth, route to services
matchmaking/
  src/main.rs        — Elo-based matching, queue management, gRPC
  src/queue.rs       — priority queue with skill brackets, wait time balancing
  src/rating.rs      — Elo/Glicko-2 rating calculation
lobby/
  src/main.rs        — room management, party system, chat
  src/room.rs        — Room state machine (waiting -> starting -> in_game)
game-server/
  src/main.rs        — game simulation (reuse from projects 3-4)
  src/session.rs     — game session lifecycle, result reporting
shared/
  proto/             — protobuf service definitions
  auth/              — JWT token validation
infra/
  docker-compose.yml — Redis, Postgres, NATS/message queue
```

**Critical learnings to focus on:**

- **Service architecture for games**: Game server is just ONE piece. Need
  auth, matchmaking, lobby, session management, leaderboards, anti-cheat.
- **Matchmaking algorithms**: Elo, Glicko-2, TrueSkill. Tradeoff between
  match quality and queue time. Bracket expansion over wait time.
- **Game server lifecycle**: Spin up for match, run, report results, shut
  down. Container orchestration matters here.
- **Connection migration**: Player connects to gateway, gets assigned to
  game server, needs a token to connect directly.
- **Horizontal scaling**: 10,000 concurrent matches? Each game server
  handles one match. Matchmaker is the router. Redis tracks capacity.

**Reference:** Agones (Google's game server management on K8s). Nakama
(open-source game server framework).

---

### Project 10: `physworld` — Deterministic Networked Physics Engine

**Difficulty:** Nightmare | **Time:** 10-14 weeks | **Language:** Rust (or C)

**What you build:**
A custom rigid body physics engine with deterministic simulation, networked
across multiple clients. Objects collide, stack, interact — all clients see
the exact same result. Implement: collision detection (GJK/EPA), constraint
solver, fixed-point arithmetic (no floats), state synchronization with
authority handoff, jitter-free rendering.

**Structure:**

```
physics/
  math/
    fixed.rs         — fixed-point number type (Q16.16), all arithmetic ops
    vec2.rs          — Vec2<Fixed>, dot, cross, normalize (all fixed-point)
    mat2.rs          — rotation matrices in fixed-point
  collision/
    gjk.rs           — GJK algorithm: do two convex shapes overlap?
    epa.rs           — EPA: penetration depth + contact normal
    broad_phase.rs   — spatial hash or sweep-and-prune
    narrow_phase.rs  — GJK+EPA on candidate pairs
  dynamics/
    rigid_body.rs    — position, velocity, angular velocity, mass, inertia
    constraint.rs    — contact constraint, friction, joints
    solver.rs        — sequential impulse solver (Erin Catto's method)
    world.rs         — step: broad -> narrow -> solve -> integrate
  determinism/
    hash.rs          — hash full state for cross-platform verification
network/
  authority.rs       — which client owns which object, authority transfer
  sync.rs            — state synchronization strategy
  snapshot.rs        — serialize full state, delta encoding
client/
  renderer.rs        — interpolated rendering of physics objects
  debug.rs           — desync detection overlay, state hash comparison
```

**Critical learnings to focus on:**

- **Fixed-point arithmetic**: Floating-point is NOT deterministic across
  CPUs. For deterministic physics, use fixed-point math (integers
  representing fractional values). How StarCraft 2 and Factorio do it.
- **The constraint solver**: Erin Catto (creator of Box2D) invented the
  sequential impulse method. Iteratively solves contact constraints.
  Understanding this = understanding ALL physics engines.
- **GJK/EPA collision detection**: GJK tells you IF two convex shapes
  overlap. EPA tells you HOW MUCH and in WHAT DIRECTION. Beautiful
  algorithms.
- **Authority and ownership**: When two players interact with the same
  object, who controls physics? Authority handoff — server decides.
- **Cross-platform determinism verification**: Hash full physics state
  every frame. Send hashes. If they diverge, desync bug. Primary debug tool.

**The final boss.** Combines EVERY previous concept plus computational
geometry plus numerical methods. If you can build this, you can build
anything.

**Reference:** Glenn Fiedler's "Networked Physics in Virtual Reality"
and Networked Physics series. Erin Catto's GDC talks. Rapier physics
engine source (Rust).

---

## ✅ Essential Reading List

Read these in order, before or alongside the projects:

| #   | Resource                                             | What It Teaches                                                                      |
| --- | ---------------------------------------------------- | ------------------------------------------------------------------------------------ |
| 1   | Glenn Fiedler — gafferongames.com (ALL articles)     | Everything. Start with "UDP vs TCP", "Fix Your Timestep!", Networked Physics series. |
| 2   | Gabriel Gambetta — Fast-Paced Multiplayer (4 parts)  | Client-server, prediction, reconciliation, interpolation. Has a live demo.           |
| 3   | Valve Developer Wiki — Source Multiplayer Networking | How Half-Life/CS implements networking. Tick rate, interpolation, lag comp.          |
| 4   | Jimmy's Blog — outof.pizza/posts/rollback/           | Practical rollback implementation with code.                                         |
| 5   | GGPO — ggpo.net                                      | The rollback networking SDK, theory and implementation.                              |
| 6   | Erin Catto — GDC talks                               | Constraint solving, Box2D internals.                                                 |

---

## ⏳ Key Open-Source Projects to Study

| Project                               | Language | What to Learn                                                                           |
| ------------------------------------- | -------- | --------------------------------------------------------------------------------------- |
| `cBournhonesque/lightyear`            | Rust     | Production Bevy multiplayer networking. Prediction, interpolation, interest management. |
| `simgine/bevy_replicon`               | Rust     | Server-authoritative replication for Bevy. Clean API design.                            |
| `gschup/ggrs`                         | Rust     | GGPO rollback implementation.                                                           |
| `johanhelsing/matchbox`               | Rust     | P2P WebRTC for Bevy games (works in browser).                                           |
| `pond3r/ggpo`                         | C++      | The original rollback SDK.                                                              |
| `lsalzman/enet`                       | C        | The OG game networking library. Simple, battle-tested UDP reliability.                  |
| `ValveSoftware/GameNetworkingSockets` | C++      | Valve's production networking library.                                                  |
| `veloren/veloren`                     | Rust     | Open-world voxel RPG. Full multiplayer, ECS, massive codebase.                          |
| `andrewgazelka/hyperion`              | Rust     | High-perf Minecraft server. Bevy ECS. Insane optimization.                              |

---

## ✅ Summary: What Each Project Teaches

| #   | Project             | Core Concept                         | Company Relevance                       |
| --- | ------------------- | ------------------------------------ | --------------------------------------- |
| 1   | `rawnet`            | UDP sockets + binary protocol        | Foundation — nothing works without this |
| 2   | `ticktock`          | Game loop + fixed timestep           | The heartbeat of all games              |
| 3   | `authserver`        | Authoritative server + interpolation | How real multiplayer games work         |
| 4   | `predict`           | Client prediction + reconciliation   | Why modern games feel responsive        |
| 5   | `tinecs`            | ECS from scratch                     | Data-oriented design, 10-100x perf      |
| 6   | `rollback-fighters` | Rollback netcode                     | Fighting game industry standard         |
| 7   | `netproto`          | Custom reliable UDP protocol         | What every networking lib does          |
| 8   | `voxelworld`        | Interest management + spatial data   | Scaling game worlds                     |
| 9   | `arenanet`          | Game infra + matchmaking             | Production game backend systems         |
| 10  | `physworld`         | Deterministic networked physics      | The final boss of game networking       |

**Recommended path:** Start with 1-2-3-4 in order (~2-3 months). Then
choose based on what excites you or what the company needs. Project 5 (ECS)
can be done anytime. Projects 6 and 7 are the most portfolio-worthy.
Project 10 separates you from everyone else in the room.
