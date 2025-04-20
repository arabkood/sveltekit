#!/bin/bash
set -e

APP_DIR="/opt/svelte-app"
APP_USER="ec2-user"

echo "Running AfterInstall hook..."
cd "$APP_DIR"

echo "Setting ownership for $APP_DIR to $APP_USER..."
sudo chown -R "$APP_USER":"$APP_USER" "$APP_DIR"

echo "Installing production dependencies..."
# sudo chown -R $APP_USER:$APP_USER $APP_DIR
sudo -u "$APP_USER" npm install --loglevel error

echo "AfterInstall hook finished."
exit 0
