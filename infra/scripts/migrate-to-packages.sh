#!/bin/bash

# execute this in '../Web-Steward-Alt/'
# - Web-Steward-Alt is a folder of the latest changes, on which you are creating a branch
# - Web-Steward is a folder of valid build setup for Steward

echo
echo \# Context
echo PWD: $(pwd)

templateBase='../Web-Steward'
echo "template base = "$templateBase

###############################################
# move all the old files into their new homes #
###############################################
mkdir packages

## Main C# movement
###################

stewardApi='packages/StewardApi'
echo 
echo \# Main C# movement to $stewardApi
mkdir $stewardApi
mv ./StewardApi $stewardApi/StewardApi
mv ./StewardApiTest $stewardApi/StewardApiTest
mv ./StewardGitApi $stewardApi/StewardGitApi
# C# supporting files
mv ./.editorconfig $stewardApi
mv ./.vs $stewardApi
mv ./.runsettings $stewardApi
mv ./nuget.config $stewardApi
mv ./StewardApi.sln $stewardApi
mv ./StewardApi.sln.DotSettings $stewardApi

## Cypress Movement + Upgrade
###############################
stewardCypress='packages/StewardClient-Cypress'
echo 
echo \# Cypress movement to $stewardCypress
mkdir $stewardCypress
mv ./StewardClient/cypress $stewardCypress
# add cypress supporting files
cp $templateBase/packages/StewardClient-Cypress/*.* $stewardCypress
cp $templateBase/packages/StewardClient-Cypress/.* $stewardCypress
cp -r $templateBase/packages/StewardClient-Cypress/cypress/configs $stewardCypress/cypress
rm $stewardCypress/cypress/configs/*.json
mkdir $stewardCypress/cypress/e2e
mv $stewardCypress/cypress/integration $stewardCypress/cypress/e2e
rmdir $stewardCypress/cypress/integration

## Angular Movement
###################
stewardClient='packages/StewardClient'
echo 
echo \# Angular movement to $stewardClient
mv ./StewardClient packages
cp $templateBase/packages/StewardClient/package.json $stewardClient
cp $templateBase/packages/StewardClient/yarn.lock $stewardClient
cp $templateBase/packages/StewardClient/.eslintrc.js $stewardClient

## New Build Setup
##################
echo 
echo \# New build setup in $(pwd)
cp -r $templateBase/steward-all-ci-2.yml .
cp -r $templateBase/steward-all-pr-2.yml .
cp -r $templateBase/steward-all-scanning-2.yml .
cp -r $templateBase/infra .