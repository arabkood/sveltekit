#!/bin/bash
set -

APP_NAME="svelte-app"
APP_USER="ec2-user"

echo "Attempting to stop application $APP_NAME..."

# Check if pm2 is available for the user
if ! sudo -u "$APP_USER" pm2 -v >/dev/null 2>&1; then
  echo "PM2 command not found for user $APP_USER. Skipping stop."
  exit 0
fi

# Check if the application exists in PM2
if sudo -u "$APP_USER" pm2 describe "$APP_NAME" >/dev/null 2>&1; then
  echo "Stopping $APP_NAME..."
  sudo -u "$APP_USER" pm2 stop "$APP_NAME" || true   # Allow failure if already stopped
  sudo -u "$APP_USER" pm2 delete "$APP_NAME" || true # Remove from PM2 list
  sudo -u "$APP_USER" pm2 save --force || true       # Persist the change
else
  echo "$APP_NAME is not running or managed by PM2. Skipping stop."
fi

echo "ApplicationStop hook finished."
exit 0
