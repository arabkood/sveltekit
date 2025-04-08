#!/bin/sh

export DATABASE_URL="postgresql://postgres:admin@192.168.1.69:5432/arabkood_0?sslmode=disable"
bun dev -- --open --host --port 80
