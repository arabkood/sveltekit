#!/bin/bash
set -e

APP_USER="ec2-user"
APP_NAME="svelte-app"
PORT=$(grep '^PORT=' /etc/svelte-app/app.env | cut -d '=' -f2)
PORT=${PORT:-3000}

MAX_RETRIES=5
RETRY_DELAY=5 # seconds

echo "Running ValidateService hook..."

# 1. Check PM2 status
echo "Checking PM2 status for $APP_NAME..."
if ! sudo -u "$APP_USER" pm2 describe "$APP_NAME" | grep -q 'status.*online'; then
  echo "Error: PM2 process $APP_NAME is not online."
  exit 1
fi
echo "PM2 status OK."

# 2. Check if the service is responding locally (basic health check)
echo "Checking service on localhost:$PORT..."
for ((i = 1; i <= MAX_RETRIES; i++)); do
  if wget -q -O /dev/null --timeout=5 --server-response localhost:$PORT 2>&1 | grep -q "HTTP/1.1 [23]"; then
    echo "Success!"
    exit 0
  fi

  echo "Attempt $i/$MAX_RETRIES failed"
  [ $i -lt $MAX_RETRIES ] && sleep $RETRY_DELAY
done

echo "Error: Service validation failed after $MAX_RETRIES attempts."
exit 1
