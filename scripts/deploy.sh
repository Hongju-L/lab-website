#!/bin/sh -e
rsync -avP index.html index.en.html index.ko.html static webfonts vps:/var/www/mirdita.org/
