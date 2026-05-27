# Execution Model

```txt
scanner
 -> semantic-engine
 -> dependency-engine
 -> enforce-engine
 -> memory-engine
 -> context-engine
 -> provider-runtime
```

Commands call compatibility wrappers in `core/*.js`, while new modules live in focused directories.

CLI surfaces:

- `scan`: build semantic and memory maps
- `graph`: build dependency intelligence
- `context`: print ranked agent context
- `enforce`: validate architecture governance
- `protocols`: list operation protocols
- `skills`: list available expertise packs
- `review`: run scan, graph, and context together
