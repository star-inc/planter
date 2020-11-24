#!/bin/bash

# Check variable
if [ -z "$CONFIG_SOURCE_URL" ]; then
    echo "\$CONFIG_SOURCE_URL is not exists"
    exit
elif [ -z "$INSTALL_DEPENDENCIES" ]; then
    INSTALL_DEPENDENCIES=true
fi

# Download config
curl $CONFIG_SOURCE_URL -o config.yaml

# Install dependencies
if $INSTALL_DEPENDENCIES; then
    npm install --save
fi

# Build
npm run build
