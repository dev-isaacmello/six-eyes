# OpenAI Prompts

OpenAI prompts should pass Six Eyes maps as structured context whenever
possible:

```json
{
  "objective": "<task>",
  "contextWindow": ".sixeyes/runtime/context-window.json",
  "semanticMap": ".sixeyes/maps/semantic-map.json",
  "dependencyGraph": ".sixeyes/graph/dependency-graph.json",
  "protocol": "protocols/<mode>/protocol.md",
  "skill": "skills/<expertise>/skill.md"
}
```
