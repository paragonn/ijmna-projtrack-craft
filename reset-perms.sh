#!/bin/sh
chown -R superijmna:www-data .
find * -type f -exec chmod 774 {} +
find * -type d -exec chmod 775 {} +
chown -R superijmna:superijmna .git
chown superijmna:superijmna reset-perms.sh
chmod +x craft
chmod +x reset-perms.sh
