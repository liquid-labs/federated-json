#!/usr/bin/env bash

function real_path {
  local FILE="${1:-}"
  if [[ -z "$FILE" ]]; then
    echo "'real_path' requires target file specified." >&2
    return 1
  elif [[ ! -e "$FILE" ]]; then
    echo "Target file '$FILE' does not exist." >&2
    return 1
  fi

  function trim_slash {
    # sed adds a newline ()
    printf "$1" | sed 's/\/$//' | tr -d '\n'
  }
  # [[ -h /foo/link_dir ]] works, but [[ -h /foo/link_dir/ ]] does not!
  FILE=`trim_slash "$FILE"`

  if [[ -h "$FILE" ]]; then
    function resolve_link {
      local POSSIBLE_REL_LINK="${1:-}"
      local APPEND="${2:-}"
      if [[ "$POSSIBLE_REL_LINK" == /* ]]; then
        # for some reason 'echo -n' was echoing the '-n' when this was used
        # included in the catalyst-scripts. Not sure why, and don't know how
        # to test, but 'printf' does what we need.
        printf "$POSSIBLE_REL_LINK${APPEND}"
      else
        # Now we go into the dir containg the link and then navigate the possibly
        # relative link to the real dir. The subshell preserves the caller's PWD.
        (cd "$(dirname "$FILE")"
        cd "$POSSIBLE_REL_LINK"
        printf "${PWD}${APPEND}")
      fi
    }

    if [[ ! -d "$FILE" ]]; then
      # we need to get the real path to the real file
      local REAL_FILE_LINK_PATH="$(readlink "$FILE")"
      resolve_link "$(dirname "$REAL_FILE_LINK_PATH")" "/$(basename "$REAL_FILE_LINK_PATH")"
    else
      # we need to get the real path of the linked directory
      resolve_link "$(readlink "$FILE")"
    fi
  else
    printf "$FILE"
  fi
}

MY_DIR="$(dirname "$(real_path ${0})")" # this will be the package dist dir
NODE="/usr/bin/env node"

${NODE} -e "const fjson = require('${MY_DIR}'); console.log(JSON.stringify(fjson.read('${1}'), null, 2))"
