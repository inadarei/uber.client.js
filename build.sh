#! /bin/sh

asciidoc -b html5 -n index.txt
git add index.*
