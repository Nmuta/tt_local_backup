#!/bin/bash
echo \# Context
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
echo Working dir: $(pwd)
echo Script dir: $SCRIPT_DIR
chmod +x $SCRIPT_DIR/changelog-quarter.sh
CHANGELOG_QUARTER=$($SCRIPT_DIR/changelog-quarter.sh)
echo Changelog Quarter: $CHANGELOG_QUARTER
SRC_PATH='packages/StewardClient/src'
CHANGELOG_FILENAME=$CHANGELOG_QUARTER-LATEST.changelog.ts
SUB="$SRC_PATH/environments/app-data/changelog/$CHANGELOG_FILENAME"
echo Changelog Filename: $CHANGELOG_FILENAME
echo
echo \# Git Changes
echo Checking for:
echo $SUB
echo

GIT_CHANGES=$(git diff --name-only origin/main...HEAD)
echo Changes Found:
echo "$GIT_CHANGES"

echo
echo \# Pass/Fail?

if [[ "$GIT_CHANGES" == *"$SUB"* ]]; then
  echo Pass
  exit 0 # success
else
  echo Fail
  exit 500 # failure
fi