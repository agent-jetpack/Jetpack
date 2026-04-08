---
description: Start the Jetpack swarm (web UI + coordinator + agents)
disable-model-invocation: true
---

Start the Jetpack swarm. This launches the web UI, coordinator, and agents.

```bash
pnpm jetpack start --dir "${JETPACK_WORK_DIR:-.}"
```

Pass through any options the user specified:
- `--agents <n>` or `-a <n>` — number of agents to spawn
- `--mock` — use mock adapters (no API key needed)
- `--no-web` — skip the web UI
- `--no-browser` — don't auto-open the browser
- `--port <port>` or `-p <port>` — web UI port
- `--strategy <strategy>` — claim strategy (first-fit, best-fit, round-robin, load-balanced)
