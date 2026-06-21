---
title: "Before mmap and ELF: Learning C Memory by Building Tiny Utilities"
date: "2026-06-17"
tags: ["c", "memory", "systems", "learning"]
summary: "Before jumping into mmap, ELF files, and operating system internals, I wanted to understand how my own C data structures own and grow memory."
readingTime: "6 min read"
---

Low-level programming has a way of pulling you toward the dramatic stuff.

ELF files. Assembly. `mmap`. File descriptors. System calls. Debuggers. Memory sanitizers.

All of that is exciting, but I have been trying to slow down and ask a smaller question first:

**Do I actually understand how my own C data structures own memory?**

So I started building a small personal C utility library. Nothing fancy. No arena allocator yet. No hash map. No logger. Just small tools that force me to touch the basics directly.

The first two modules I built were a dynamic array and a string builder. They are common enough to look boring, but implementing them made C memory feel much less abstract.

## The Heap Is Where Growable Storage Lives

A normal local variable has a fixed size.

```c
int x;
```

A struct also has a fixed size.

```c
typedef struct {
    char *data;
    size_t length;
    size_t capacity;
} StringBuilder;
```

That struct will never grow. It is just a small control object. The growable part is the memory pointed to by `data`.

```text
StringBuilder
  data --------> heap buffer
```

That was an important shift for me. A dynamic array is not magic. A string builder is not magic. They are small structs that track heap memory.

When more space is needed, the internal buffer is resized.

```c
char *new_data = realloc(sb->data, new_capacity);
```

The struct stays the same size. The buffer it points to changes. That is the core pattern.

## realloc Is Useful, But It Has Teeth

At first, it is tempting to write this:

```c
sb->data = realloc(sb->data, new_capacity);
```

It looks clean, but it has a problem.

If `realloc` fails, it returns `NULL`. If I assign that directly into `sb->data`, I lose the original pointer. Now I cannot free the old memory anymore.

So the safer pattern is:

```c
char *new_data = realloc(sb->data, new_capacity);

if (new_data == NULL)
    return 0;

sb->data = new_data;
```

This looks like a small detail, but it changed how I think about C.

In C, memory operations are not just operations. They are ownership transitions.

You have to ask: if this fails, do I still own the old memory? Can I still free it? Did I lose the only pointer?

That one temporary variable carries a lot of responsibility.

## A String Builder Has One Sacred Rule

A dynamic array can store arbitrary bytes. A string builder has an extra responsibility: it must always remain a valid C string.

That means after every append, this must be true:

```c
sb->data[sb->length] = '\0';
```

The null terminator is not decoration. It is how C string functions know where the string ends.

If I forget it, the buffer may still contain my characters, but it is no longer safe to treat it like a string.

That made me appreciate something simple: **in C, a string is not just characters. It is characters plus a stopping rule.**

A string builder is really a growable buffer that preserves that stopping rule after every change.

## APIs Tell You Who Owns What

My dynamic array uses this kind of API:

```c
DynArray *da_create(size_t item_size);
void da_free(DynArray *array);
```

`da_create` allocates the `DynArray` struct itself. The caller receives a pointer and later gives it back to `da_free`.

The string builder API is different:

```c
StringBuilder sb_create(void);
void sb_free(StringBuilder *sb);
```

Here, the struct is returned by value.

```c
StringBuilder sb = sb_create();

sb_append(&sb, "hello");
sb_free(&sb);
```

The `StringBuilder` struct can live on the stack, while its internal `char *data` still points to heap memory.

That difference helped me understand that API design is not just naming functions. The API decides the ownership model.

When a function returns a pointer, I ask: who allocated this, and who frees it?

When a function accepts a pointer, I ask: is it borrowing this, will it modify it, or will it take ownership?

C does not answer those questions for you. Your API has to make them clear.

## Tests Are Memory Questions Written Down

The tests I wrote were simple. Append a string. Append a character. Clear the builder. Reuse it. Append enough text to force growth.

But those tests were really checking deeper rules:

- Does appending preserve the string?
- Does clearing keep the builder reusable?
- Does growth preserve old data?
- Does invalid input fail safely?

That is another small mindset shift.

Tests are not only about expected output. For C code, they are also about checking memory invariants.

I am not trying to prove the code is perfect. I am trying to catch the obvious ways I might break ownership, growth, or null termination.

## What I Understand Better Now

This project is small, but it taught me useful things.

I understand why growable data lives behind pointers. I understand why `realloc` should be handled carefully. I understand why a C string must always preserve its null terminator. I understand that an API quietly defines ownership.

And most importantly, I understand that these simple utilities are not separate from lower-level programming. They are preparation for it.

Before I can really understand `mmap`, file descriptors, binary formats, or memory debuggers, I need to be comfortable with the smaller memory decisions inside my own code.

So this is where I am starting. Not with a kernel. Not with an allocator. Just a dynamic array, a string builder, and a lot more respect for `malloc`.
