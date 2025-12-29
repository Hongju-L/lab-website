#!/bin/sh -e
rsync -avP index.en.html index.ko.html static webfonts vps:/var/www/mirdita.org/
