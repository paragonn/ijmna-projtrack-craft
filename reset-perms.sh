#!/bin/sh
chown -R master:www-data .
find * -type f -exec chmod 774 {} +
find * -type d -exec chmod 775 {} +
chown -R master:master .git
chown master:master reset-perms.sh
chmod +x craft
chmod +x reset-perms.sh
