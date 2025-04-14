#!/bin/sh

NUM_STRINGS=32
n=0
while [ $n -lt 1 ]; do
    dd if=/dev/urandom bs=1 count=${NUM_STRINGS} 2>/dev/null | base64 | tr -d '\n' | cut -c1-${NUM_STRINGS}
    n=$((n + 1))
done
