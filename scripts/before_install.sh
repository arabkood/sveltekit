#!/bin/bash
set -e

# if systemctl is-active --quiet go-app; then
#   systemctl stop go-app
# fi

# Clean the deployment directory
sudo rm -rf /opt/svelte-app/*

# Optional: Ensure the directory exists
mkdir -p /opt/svelte-app

APP_USER="ec2-user"
echo "Setting ownership for /opt/svelte-app to $APP_USER..."
sudo chown -R "$APP_USER":"$APP_USER" "/opt/svelte-app"
