#!/usr/bin/env bash

MY_DIR="$(dirname "${0}")" # this will be the package dist dir
NODE="/usr/bin/env node"

${NODE} -e "const fjson = require('.'); console.log(JSON.stringify(fjson.read('${1}'), null, 2))"
