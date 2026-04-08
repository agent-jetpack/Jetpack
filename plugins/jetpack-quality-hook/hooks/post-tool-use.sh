#!/bin/bash
# PostToolUse hook: run quick quality checks after file edits.
# Advisory only — always exits 0 so it doesn't block Claude.
# Reports issues to stderr for Claude to see.

WORK_DIR="${JETPACK_WORK_DIR:-.}"

# Read the tool input from stdin to get the file path
INPUT=$(cat /dev/stdin 2>/dev/null || true)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty' 2>/dev/null)

# Skip if no file path or not a TypeScript/JavaScript file
if [ -z "$FILE_PATH" ]; then
  exit 0
fi

case "$FILE_PATH" in
  *.ts|*.tsx|*.js|*.jsx)
    ;;
  *)
    exit 0
    ;;
esac

ISSUES=""

# Run typecheck (fast, no emit)
TYPE_RESULT=$(cd "$WORK_DIR" && npx tsc --noEmit 2>&1 | tail -10)
TYPE_EXIT=$?

if [ $TYPE_EXIT -ne 0 ]; then
  ISSUES="${ISSUES}\nTYPE ERRORS:\n${TYPE_RESULT}"
fi

# Run lint on the specific file
LINT_RESULT=$(cd "$WORK_DIR" && npx eslint "$FILE_PATH" 2>&1 | tail -10)
LINT_EXIT=$?

if [ $LINT_EXIT -ne 0 ]; then
  ISSUES="${ISSUES}\nLINT ERRORS:\n${LINT_RESULT}"
fi

# Report results if any issues found
if [ -n "$ISSUES" ]; then
  echo "--- Jetpack Quality Check ---" >&2
  echo -e "$ISSUES" >&2
  echo "---" >&2
fi

exit 0
