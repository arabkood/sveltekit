ARG NODE_IMAGE=node:24-alpine

# --- Build stage ---
FROM ${NODE_IMAGE} AS builder
WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy over package manager config and required manifest files
COPY package.json pnpm-lock.yaml ./

# Install dependencies fresh using pnpm
RUN pnpm install --frozen-lockfile

# Copy the rest of the source files
COPY . .

# Build the SvelteKit app
RUN rm -rf build && (pnpm run build || test -d build) && \
	find build -name "*.map" -delete

# --- Runtime stage ---
FROM --platform=linux/amd64 ${NODE_IMAGE} AS runtime

# Upgrade base Alpine Linux packages and install curl
RUN apk upgrade -U && apk add curl

WORKDIR /app

# Enable pnpm for runtime step
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy only necessary config and manifest files
COPY --chown=node:node package.json pnpm-lock.yaml ./

# Install production dependencies only using pnpm
RUN pnpm install --frozen-lockfile --prod && \
	# Remove unnecessary files and folders from node_modules
	find node_modules \( \
	-type d -empty \
	-o -iname "license*" \
	-o -name "*.md" \
	-o -name "*.txt" \
	-o -name "*.map" \
	-o -name ".git*" \
	-o -name "*.yml" \
	-o -name "*.yaml" \
	-o -name "*.json" -path "*/test/*" \
	-o -name "*.json" -path "*/tests/*" \
	-o -name "test" -type d \
	-o -name "tests" -type d \
	-o -name "__tests__" -type d \
	-o -name "coverage" -type d \
	-o -name ".nyc_output" -type d \
	\) -delete && \
	# Remove leftover tmp and cache files
	rm -rf /tmp/* /var/cache/apk/* /root/.npm /root/.local/share/pnpm/store

# Copy build artifacts from the builder stage
COPY --from=builder --chown=node:node /app/build ./build
COPY --from=builder --chown=node:node /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=builder --chown=node:node /app/src/lib/server/db/migrations ./src/lib/server/db/migrations

# Make extra sure build sourcemaps are deleted
RUN find build -name "*.map" -delete

# Switch to non-root user
USER node

# Set environment variables
ENV NODE_ENV=production
ENV ADDRESS_HEADER="X-Forwarded-For"
ENV XFF_DEPTH="1"

# Expose the port the app will run on
EXPOSE 3000

# Define the default command to launch the built app
CMD ["node", "build"]
