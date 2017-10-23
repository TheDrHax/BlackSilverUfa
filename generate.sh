#!/bin/sh

find templates -name \*.sh | while read line; do
    sh "$line"
done
