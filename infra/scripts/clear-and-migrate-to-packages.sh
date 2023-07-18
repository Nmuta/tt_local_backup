#!/bin/bash
rm -r packages/StewardClient/node_modules
rm -r packagesx/StewardClient-Cypress/node_modules
git add -A
git reset --hard
../Web-Steward/infra/scripts/migrate-to-packages.sh