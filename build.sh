#!/bin/bash

git pull --force

yarn
yarn build:prod

rm -rf ../www.gamerbuy.cc/*
cp -rf dist/* ../www.gamerbuy.cc/
cp -rf src/static ../www.gamerbuy.cc/

# cp -r dist/* ../gamebug-fe-deloy/
# cp -r src/static ../gamebug-fe-deloy/