#!/usr/bin/env bash

cd ../sdk/wallet-sdk

rm ./jolocom-sdk-*.tgz
npm pack

cd ../../hapi-jolocom-plugin/

rm ./jolocom-sdk-*.tgz
cp ../sdk/wallet-sdk/jolocom-sdk-*.tgz .
yarn install
