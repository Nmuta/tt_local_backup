#!/bin/bash

CYPRESS_SAMPLE_FILE=.cypress.env.json
CYPRESS_FILE=cypress.env.json

# Error setup
################################
# exit when any command fails
set -e

# keep track of the last executed command
trap 'last_command=$current_command; current_command=$BASH_COMMAND' DEBUG
# echo an error message before exiting
trap 'echo;echo "\"${last_command}\" command filed with exit code $?."' EXIT
#################################
# End Error Setup

echo
echo "Retrieving dev secret (dev kv)"
DEV_CLIENT_SECRET=$(az keyvault secret show --subscription c4dda634-84ec-483e-9ee5-c4c43511f8f3 --vault-name steward-keyvault-dev --name aad-auth-client-secret --query value -o tsv)

echo "Retrieving prod secret (prod kv)"
PROD_CLIENT_SECRET=$(az keyvault secret show --subscription a6d4cc22-0b13-4871-b146-db7138d3e3cb --vault-name steward-keyvault-prod --name aad-auth-client-secret --query value -o tsv)

echo
echo "Copying sample file ($CYPRESS_SAMPLE_FILE -> $CYPRESS_FILE)"
cp $CYPRESS_SAMPLE_FILE $CYPRESS_FILE

echo
echo "Removing comments ($CYPRESS_FILE)"
sed -i -E "s/\/\/.*//g" $CYPRESS_FILE

echo "Removing extra newlines ($CYPRESS_FILE)"
sed -i -E -z "s/\n\n+/\n/g" $CYPRESS_FILE
sed -i -E -z "s/^\n//g" $CYPRESS_FILE

echo
echo "Adding dev secret (dev kv -> $CYPRESS_FILE)"
sed -i "s/<steward-keyvault-dev aad-auth-client-secret>/$DEV_CLIENT_SECRET/g" $CYPRESS_FILE

echo "Adding prod secret (prod kv -> $CYPRESS_FILE)"
sed -i "s/<steward-keyvault-prod aad-auth-client-secret>/$PROD_CLIENT_SECRET/g" $CYPRESS_FILE

echo
echo "$CYPRESS_FILE is ready"

# cancel exit message
trap '' EXIT