#!/bin/bash

set -e

DRIZZLE_OUT_DIR="./src/lib/server/db/generated/drizzle"

pnpm drizzle-kit pull

echo "Applying patch for 'class' keyword..."

find "$DRIZZLE_OUT_DIR" -type f -name "*.ts" | while read -r file; do
  echo "  - Patching $file"

  sed -i.bak \
    -e 's/export const class = pgSchema("class")/export const classSchema = pgSchema("class")/g' \
    -e 's/\bclass\b\.table/classSchema.table/g' \
    -e 's/relations(\bclass\b,/relations(classSchema,/g' \
    -e "s/timestamp(\([^,]*\), { withTimezone: true, mode: \x27string\x27 })/timestamp(\1, { withTimezone: true, mode: \x27date\x27 })/g" \
    -e "s/date()/date({ mode: 'date' })/g" \
    "$file"

  rm "${file}.bak"
done

echo "Done. Your schema is ready to use."
