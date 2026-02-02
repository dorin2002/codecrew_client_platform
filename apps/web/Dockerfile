FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /workspace

# Copy workspace configuration files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Copy all package.json files to leverage Docker caching
COPY apps/web/package.json ./apps/web/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies for the entire workspace
RUN pnpm install --filter web... --frozen-lockfile

# Copy source files
COPY apps/web ./apps/web
COPY packages/shared ./packages/shared

EXPOSE 3000
CMD ["pnpm", "--filter", "web", "run", "dev"]
