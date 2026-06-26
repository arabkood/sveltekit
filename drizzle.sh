#!/bin/bash

# === Database Credentials ===
POSTGRES_USER=solo
POSTGRES_PASSWORD=YOUR_VERY_STRONG_PASSWORD_HERE
POSTGRES_DB=akood-mvp
POSTGRES_HOST=0.0.0.0
POSTGRES_PORT=5432

# === Application Connection String ===
export DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}?ssl_mode=disable"

pnpm drizzle-kit "$@"
