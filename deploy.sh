#!/bin/sh

if [[ $# -eq 0 ]] ; then
    echo '[deploy.sh] vault directory expected as first argument'
    exit 1
fi

SERVER=dig-ocean-vps
DIR=/var/www/html/tonycodes.com/digital-garden/

OBSIDIAN_VAULT_DIR="$1"



node build.js ${OBSIDIAN_VAULT_DIR} && rsync -avz --delete public/ ${SERVER}:${DIR}

exit 0
