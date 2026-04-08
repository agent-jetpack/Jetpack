---
description: List current tasks in the Jetpack swarm with status and priority
disable-model-invocation: true
---

Run the following command and display the output:

```bash
pnpm jetpack tasks --dir "${JETPACK_WORK_DIR:-.}"
```

If the user specified a status filter (e.g., "show ready tasks"), add `--status <status>` to the command. Valid statuses: pending, ready, claimed, in_progress, completed, failed, blocked.
