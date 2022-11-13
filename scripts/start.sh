#!/bin/bash

# This script runs in the project root

term_handler() {
    echo "SIGTERM received"
    exit 0;
}
trap term_handler SIGTERM

/usr/bin/node ./dist/index.js
