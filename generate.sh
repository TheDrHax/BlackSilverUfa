#!/bin/sh

find . -name \*.template | while read line; do
    sh "$line"
done
