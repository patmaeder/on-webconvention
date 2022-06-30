#!/bin/sh
set -Ex

function apply_path {

    echo "Check that we have ENVIROMENT_VAR vars"

    echo $YJS_HOST

    # replace all placeholder occurences with real environment variable
    find /usr/src/.output \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#%YJS_HOST%#$YJS_HOST#g"
    find /usr/src/.output \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#%SFU_HOST%#$SFU_HOST#g"
}

apply_path


npx prisma migrate dev
node .output/server/index.mjs
exec "$@"
