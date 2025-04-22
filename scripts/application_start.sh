#!/bin/bash
set -e

APP_DIR="/opt/svelte-app"
APP_NAME="svelte-app"
APP_USER="ec2-user"
LOG_DIR="/var/log/svelte-app"
ENV_FILE="/etc/svelte-app/app.env"

echo "Running ApplicationStart hook..."
cd "$APP_DIR"

# Ensure log directory exists and has correct permissions
# The EC2 init should create this, but double-check/create defensively
sudo mkdir -p "$LOG_DIR"
sudo chown "$APP_USER":"$APP_USER" "$LOG_DIR"
sudo chmod 755 "$LOG_DIR"
export $(cat "$ENV_FILE" | xargs)

# Load environment variables from the file if it exists
# PM2's systemd service *might* inherit them, but sourcing explicitly is safer
# However, PM2's `start --env` or `reload --update-env` is usually preferred.
# We rely on the PM2 systemd service and --update-env below.

# Check if the app is already managed by PM2
if sudo -u "$APP_USER" pm2 describe "$APP_NAME" >/dev/null 2>&1; then
  echo "Application $APP_NAME exists. Reloading..."
  # Reload the existing process. --update-env merges existing env with system/new env
  sudo -u "$APP_USER" pm2 reload "$APP_NAME" --update-env --log "$LOG_DIR/app.log" --error "$LOG_DIR/error.log" --output "$LOG_DIR/out.log"
else
  echo "Starting new application $APP_NAME..."
  # Start the application using the built index.js
  # PM2 running as a service under $APP_USER should pick up system env vars
  # The node process itself will read from process.env (populated via ENV_FILE by systemd/shell)
  PORT=80 sudo -u "$APP_USER" pm2 start "build/index.js" \
    --name "$APP_NAME" \
    -i max \
    --log "$LOG_DIR/app.log" \
    --error "$LOG_DIR/error.log" \
    --output "$LOG_DIR/out.log" \
    --env production
  # If env vars from ENV_FILE are *not* picked up automatically by PM2 service:
  # You might need to source it first OR use a PM2 ecosystem file
  # Example (less common): source "$ENV_FILE" && sudo -E -u "$APP_USER" pm2 start ...
  # Recommended: Ensure PM2 systemd unit loads user environment correctly

fi

# Ensure PM2 saves the process list to restart automatically after reboot
sudo -u "$APP_USER" pm2 save --force

echo "ApplicationStart hook finished."
exit 0
