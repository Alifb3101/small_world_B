#!/bin/sh
# usage: snap.sh name  -> decodes latest CDP screenshot into _preview/name.jpg
cd "$(dirname "$0")" && python3 shot.py "$PWD/$1.png" >/dev/null && sips -s format jpeg -s formatOptions 72 "$1.png" --out "$1.jpg" >/dev/null && rm "$1.png" && echo "$PWD/$1.jpg"
