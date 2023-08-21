#!/bin/bash
echo \# Context
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
echo Working dir: $(pwd)
echo Script dir: $SCRIPT_DIR
TARGET_CMD=${1:-run:dev}
echo Target cmd: $TARGET_CMD

echo
echo Finding changed specs:
chmod +x $SCRIPT_DIR/changed-cypress-tests.sh
CHANGED_SPECS=$($SCRIPT_DIR/changed-cypress-tests.sh)
echo "$CHANGED_SPECS"

echo
echo Reformatting argument:
CHANGED_SPECS_CSV=$(echo $CHANGED_SPECS | sed 's/ /,/g' | sed -E -z "s/\n/,/g" | sed -E -z "s/,$//g")
echo
echo "$CHANGED_SPECS_CSV"

echo
echo "Running changed specs on dev:"
yarn $TARGET_CMD --spec="$CHANGED_SPECS_CSV"
