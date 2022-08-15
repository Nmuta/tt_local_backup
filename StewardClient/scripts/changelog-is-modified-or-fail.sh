#!/bin/bash
GIT_CHANGES=$(git diff-tree --no-commit-id --name-status -r HEAD origin/main)
echo $GIT_CHANGES;
SRC_PATH='StewardClient/src'
SUB='StewardClient/src/environments/app-data/changelog/2022-LATEST-Q2-Q3.changelog.ts'

if [[ "$GIT_CHANGES" != *"$SRC_PATH"* ]]; then
  exit 0 # success
fi

if [[ "$GIT_CHANGES" == *"$SUB"* ]]; then
  exit 0 # success
else
  exit 500 # failure
fi