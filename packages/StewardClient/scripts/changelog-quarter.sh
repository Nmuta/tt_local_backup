#!/bin/bash
echo $(date +%Y)-Q$(( ($(date +%-m)-1)/3+1 ))
