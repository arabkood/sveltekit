#!/usr/bin/env bash

# 1. Hardcode the clear text variables from deploy.yml (Kamal doesn't put these in the .env file)
S3_ENDPOINT="fsn1.your-objectstorage.com"
S3_PV_BUCKET_NAME="akood-pv"
S3_REGION="eu-central"

# 2. Source the web role env file to grab the actual secrets (S3 keys)
set -a
source "$HOME/.kamal/apps/akood/env/roles/web.env"
set +a

# 3. Execute pg_dump and upload
docker exec akood-pg bash -c 'pg_dump -U $POSTGRES_USER $POSTGRES_DB' | \
  gzip | \
  docker run --rm -i \
    -e AWS_ACCESS_KEY_ID="$S3_ACCESS_KEY_ID" \
    -e AWS_SECRET_ACCESS_KEY="$S3_SECRET_ACCESS_KEY" \
    -e AWS_DEFAULT_REGION="$S3_REGION" \
    amazon/aws-cli \
    --endpoint-url "https://$S3_ENDPOINT" \
    s3 cp - "s3://$S3_PV_BUCKET_NAME/backup-$(date +%F).sql.gz"
