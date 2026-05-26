# Examples

---

# Good Example

## Thin Controller

```ts
export async function createUser(req, res) {
  const result =
    await userService.create(req.body);

  return res.json(result);
}
```


# Bad Example

## business logic inside controller

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