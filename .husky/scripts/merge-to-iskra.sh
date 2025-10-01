#!/usr/bin/env bash
set -euo pipefail

REMOTE=origin
MAIN_BRANCH=master
TEST_BRANCH=iskra

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Проверка чистоты
if [[ -n "$(git status --porcelain)" ]]; then
  echo "Working tree is dirty — commit or stash changes before running this hook."
  exit 1
fi

echo ">>> Merging $MAIN_BRANCH and $CURRENT_BRANCH into $TEST_BRANCH..."

git fetch "$REMOTE" --prune

TMP_BRANCH="tmp/merge-${CURRENT_BRANCH//\//-}-$(date +%s)"
git checkout -b "$TMP_BRANCH" "$REMOTE/$TEST_BRANCH" || {
  echo "Remote $REMOTE/$TEST_BRANCH not found — creating from $REMOTE/$MAIN_BRANCH"
  git checkout -b "$TMP_BRANCH" "$REMOTE/$MAIN_BRANCH"
}

# Merge master
if ! git merge --no-edit "$REMOTE/$MAIN_BRANCH"; then
  echo "Conflict with $MAIN_BRANCH — aborting."
  git merge --abort || true
  git checkout "$CURRENT_BRANCH"
  git branch -D "$TMP_BRANCH" || true
  exit 1
fi

# Merge текущей ветки
if ! git merge --no-edit "$CURRENT_BRANCH"; then
  echo "Conflict with $CURRENT_BRANCH — aborting."
  git merge --abort || true
  git checkout "$CURRENT_BRANCH"
  git branch -D "$TMP_BRANCH" || true
  exit 1
fi

echo ">>> Pushing to $REMOTE/$TEST_BRANCH..."
git push "$REMOTE" "HEAD:$TEST_BRANCH"

git checkout "$CURRENT_BRANCH"
git branch -D "$TMP_BRANCH" || true

echo ">>> Done! Merged into $REMOTE/$TEST_BRANCH"
