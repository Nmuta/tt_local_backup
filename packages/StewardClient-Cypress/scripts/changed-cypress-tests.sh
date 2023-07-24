#!/bin/bash
git diff --name-only origin/main | grep packages/StewardClient-Cypress/cypress/e2e | grep .spec.ts | sed 's/packages\/StewardClient-Cypress\///'