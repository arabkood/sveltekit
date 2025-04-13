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
echo "Attempting to reach service on http://localhost:$PORT/ (expecting non-5xx)..."
for ((i = 1; i <= MAX_RETRIES; i++)); do
  # Use curl to make a request to a known healthcheck endpoint or root
  # Adjust the path '/' if you have a specific /health or /status endpoint
  HTTP_STATUS=$(curl -o /dev/null -s -w "%{http_code}" --max-time 5 http://localhost:$PORT/)

  if [[ $HTTP_STATUS -ge 200 && $HTTP_STATUS -lt 500 ]]; then
    echo "Service responded with HTTP status $HTTP_STATUS. Validation successful."
    exit 0 # Success!
  else
    echo "Attempt $i/$MAX_RETRIES: Service responded with HTTP status $HTTP_STATUS or timed out."
    if [ $i -lt $MAX_RETRIES ]; then
      echo "Retrying in $RETRY_DELAY seconds..."
      sleep $RETRY_DELAY
    fi
  fi
done

echo "Error: Service validation failed after $MAX_RETRIES attempts."
exit 1
