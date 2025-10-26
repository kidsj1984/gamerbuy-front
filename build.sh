#!/bin/bash

git pull --force

yarn build:prod

# rm -rf ../gamebug-fe-deloy/*

# cp -r dist/* ../gamebug-fe-deloy/
# cp -r src/static ../gamebug-fe-deloy/