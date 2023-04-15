#!/usr/bin/env sh

# abort on errors


# build


# navigate into the build output directory

scp /Users/zyb/development/trade-dapp/dist.zip root@174.129.214.112:/data/exchange
ssh root@174.129.214.112
cd /data/exchange
rm -rf dist
unzip dist.zip