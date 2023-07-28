#!/bin/bash
# This was showing something incorrect. "triple-dot" syntax fixes it https://stackoverflow.com/questions/37763836/how-to-make-git-diff-show-the-same-result-as-githubs-pull-request-diff
git diff --name-only origin/main...HEAD | grep packages/StewardClient-Cypress/cypress/e2e | grep .spec.ts | sed 's/packages\/StewardClient-Cypress\///'