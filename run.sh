#!/bin/sh

export DATABASE_URL="postgresql://postgres:admin@192.168.1.69:5432/arabkood_0?sslmode=disable"

export AKOOD_DATABASE_DBNAME="arabkood_3"
export AKOOD_DATABASE_USER="postgres"
export AKOOD_DATABASE_HOST="192.168.1.69"
export AKOOD_DATABASE_PASSWORD="admin"
export AKOOD_DATABASE_PORT="5432"

export AWS_S3_TOPICS_BUCKET_NAME="hellotopics"
export PUBLIC_APP_ENV="local"
export PUBLIC_AWS_S3_PUBLIC_BUCKET_NAME="helloassets"
export PUBLIC_AWS_REGION="me-central-1"

export AWS_ACCESS_KEY_ID_LOCAL="test"
export AWS_SECRET_ACCESS_KEY_LOCAL="test"

pnpm dev -- --open --host --port 80
