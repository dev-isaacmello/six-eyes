# Examples

---

# Good Example: Thin Controller

```ts
export async function createUser(req, res) {
  const result =
    await userService.create(req.body);

  return res.json(result);
}
```


# Bad Example: Business Logic Inside Controller

```ts
export async function createUser(req, res) {
  const existing =
    await db.users.findFirst();

  if (existing) {
    throw new Error();
  }

  const hashed =
    await bcrypt.hash(req.body.password);

  await db.users.create({
    data: {
      ...
    }
  });

  return res.json();
}
```

---

# Good Example: Context-Grounded Refactor

```txt
1. Read .sixeyes/runtime/context-window.json.
2. Inspect top-ranked service, repository, and domain files.
3. Move orchestration into application layer without changing domain entities.
4. Run tests and then rerun six-eyes review.
```

# Bad Example: Context-Free Rewrite

```txt
1. Guess architecture from README.
2. Rewrite controllers, services, and repositories together.
3. Skip dependency graph comparison.
```
