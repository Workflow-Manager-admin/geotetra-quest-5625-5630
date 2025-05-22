#!/bin/bash
cd /home/kavia/workspace/code-generation/geotetra-quest-5625-5630/geo_tetra_quest
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

