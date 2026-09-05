---
title: "micro1 Generalist Screen"
---

# The micro1 "Generalist" posting

Applied with the engineering resume, to a role titled "Generalist." The listed required skills are
data annotation, critical thinking, attention to detail, written and verbal communication, remote
collaboration — nothing about React or TypeScript. That's the pattern: an engineering background
as the qualifying bar for AI-training work, not a mismatch to explain away.

So Zara's screen is probably two things stitched together. [[ai-interview-resume-qa]] still covers
the first half — same resume, same ramp, same traps. This page is the second half: the questions
that come from the job title instead of the resume.

---

## Judging output, not writing it

Data annotation and critical thinking usually show up as a live task, not a question. Given a
piece of code or an AI-generated answer, is it right, and what's specifically wrong with it. This
isn't unfamiliar — it's what the parity tests and golden evaluations already do, just done out
loud instead of in CI.

**How would you tell if two answers to the same prompt are equally good?**

Compare against what the task actually needed, not against each other. Two answers can both look
fine and still both be wrong in ways that only show up against ground truth — that's the whole
argument for golden evaluations over eyeballing.

**Write a rubric for judging whether generated code is production-ready.**

Start narrow. Does it compile, does it handle the input it claims to handle, does it fail loudly
or silently when it can't. A rubric that tries to score "quality" in the abstract collapses into
vibes — the StashBase parity suite works because it asserts specific behaviors, not "does this
seem right."

---

## Attention to detail

Wants a story with a real mechanism, not a claim. Two ready-made ones:

The list/blockquote exit case in the Milkdown editor — press Enter twice inside a nested list and
the editor has to decide whether you're adding an item, dropping a nesting level, or leaving the
list entirely. Get it wrong and the file's indentation quietly changes on save. Small behavior,
but it touches every list in the library, so it shipped as its own change.

The scene-scoping tests at SamurAI — restoring a snapshot in the wrong scene overwrites frames in
another scene with no error, just silently lost work. That's the failure that was actually scary,
so the regression suite targets it hardest.

**What's a mistake you almost shipped?**

Have one where the catch was a review, not a hunch — a real "someone else looked and found it"
story reads as more honest than "I caught my own bug," which every candidate says whether or not
it's true.

---

## Communication

Less likely to be asked about directly, more likely to be tested by making you do it. Pick
something off the resume — the tldraw migration, the shared agent contract — and practice
explaining what it does and why, in under a minute, at a level a non-engineer could follow.
"Explain X to someone who's smart but not technical" is close to a real prompt.

The actual test is what gets left out. A tldraw explanation for a non-engineer doesn't need "shape
system" or "onMount race" — it needs "the drawing tool couldn't do what we needed, so we swapped
it for one that could, and had to migrate everyone's existing data over without losing anything."

---

## Remote collaboration

**How do you stay accountable with no one checking in?**

The SamurAI stretch answers this directly — three months, four codebases, commits under a work
identity that doesn't show on a public profile. Nobody was watching day to day; the storyboard
migration got done anyway because it needed to.

**What do you do with an instruction that's ambiguous and the person who wrote it isn't around to
ask?**

Make the smallest reasonable assumption, write it down, keep moving. Same instinct as building the
operator console at SamurAI — when the pipeline output looked wrong, the fix wasn't asking someone
what "wrong" meant, it was building a way to see the intermediate stages myself.

---

## The one they might ask directly

**Why apply to a Generalist role with this resume?**

Because the resume is the answer, not something to talk around. Reviewing whether an agent's
output actually did what it claimed — that's the day-to-day at StashBase, running two different
coding agents behind one contract and catching where they diverge. Data annotation is the same
skill pointed at a different pipeline.

---

## Prep list

- Resume tree first — it's the stronger asset and Zara pulls from it regardless of the job title.
- Two or three "judge this" reps: take a real diff or PR review, narrate why it's right or wrong,
  out loud, under a minute.
- One ambiguous-instructions story beyond SamurAI, in case it gets pushed past the first one.
- Say the Generalist answer straight if asked — it's a real fit, not a cover story.
