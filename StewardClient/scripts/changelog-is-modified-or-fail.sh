#!/bin/bash
GIT_CHANGES=$(git diff-tree --no-commit-id --name-status -r HEAD origin/main)
echo $GIT_CHANGES;
SUB='StewardClient/src/CHANGELOG.component.html'
if [[ "$GIT_CHANGES" == *"$SUB"* ]]; then
  exit 0 # success
else
  exit 500 # failure
fi