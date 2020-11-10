#!/bin/sh
#
# Pre-commit script that runs the prettier format command

( cd StewardClient && exec npm run format )
