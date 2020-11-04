#!/bin/sh
#
# GIT hooks setup script for new devs working on repo

ln GitHooks/pre-commit.sh .git/hooks/pre-commit

echo 'Finished setting up GIT hooks.'
