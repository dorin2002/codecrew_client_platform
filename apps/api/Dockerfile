FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /workspace

# Copy workspace configuration files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Copy all package.json files to leverage Docker caching
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies for the entire workspace
RUN pnpm install --filter api... --frozen-lockfile

# Copy source files
COPY apps/api ./apps/api
COPY packages/shared ./packages/shared

# Build shared package
RUN pnpm --filter @codecrew/shared run build

EXPOSE 4000
CMD ["pnpm", "--filter", "api", "run", "start:dev"]
