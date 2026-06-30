#!/usr/bin/env bash

# 1. Source the web role env file to grab the S3 secrets
set -a
source "$HOME/.kamal/apps/akood/env/roles/web.env"
set +a

# 2. Execute pg_dump using the variables natively inside the db container
# 3. Stream through gzip
# 4. Upload using the S3 variables mapped to what AWS CLI expects
docker exec akood-pg bash -c 'pg_dump -U $POSTGRES_USER $POSTGRES_DB' |
	gzip |
	docker run --rm -i \
		-e AWS_ACCESS_KEY_ID="$S3_ACCESS_KEY_ID" \
		-e AWS_SECRET_ACCESS_KEY="$S3_SECRET_ACCESS_KEY" \
		-e AWS_DEFAULT_REGION="$S3_REGION" \
		amazon/aws-cli \
		--endpoint-url "https://$S3_ENDPOINT" \
		s3 cp - "s3://$S3_PV_BUCKET_NAME/backup-$(date +%F).sql.gz"
