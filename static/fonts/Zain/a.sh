#!/usr/bin/env bash

set -e

for font in *.ttf; do
	name="${font%.ttf}"

	echo "Processing $font"

	# Create WOFF
	fontforge -lang=ff -c "Open(\"$font\"); Generate(\"$name.woff\")"

	# Create WOFF2
	woff2_compress "$font"

	echo "Created $name.woff and $name.woff2"
done

echo "Done."
