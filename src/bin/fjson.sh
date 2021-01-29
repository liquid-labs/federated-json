#!/usr/bin/env bash

import real_path

MY_DIR="$(dirname "$(real_path ${0})")" # this will be the package dist dir
NODE="/usr/bin/env node"

${NODE} -e "const fjson = require('${MY_DIR}'); console.log(JSON.stringify(fjson.read('${1}'), null, 2))"
