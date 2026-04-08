---
description: Create a new task in the Jetpack swarm from a natural language description
---

The user wants to create a task in the Jetpack swarm. Parse their input to extract:

1. **Title** — First sentence or up to 80 characters of their description
2. **Description** — The full text if longer than the title
3. **Priority** — Infer from context:
   - "critical", "urgent", "asap", "blocker" → `critical`
   - "important", "high priority" → `high`
   - "low priority", "nice to have", "when you can" → `low`
   - Default: `medium`
4. **Skills** — Infer from technologies mentioned:
   - "React", "CSS", "frontend", "UI" → `react,frontend`
   - "API", "server", "backend", "database" → `backend,nodejs`
   - "test", "testing" → `testing`
   - "docs", "documentation" → `documentation`

Then run:

```bash
pnpm jetpack task --title "<title>" --desc "<description>" --priority <priority> --skills "<skills>" --dir "${JETPACK_WORK_DIR:-.}"
```

Show the created task ID and details to the user.
