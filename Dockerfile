FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

COPY . .
COPY .env.production .env.production
RUN pnpm build

FROM node:20-alpine AS production
WORKDIR /app

ENV NODE_ENV production

# Install pnpm for production stage
RUN npm install -g pnpm

COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/.env.production .env.production

EXPOSE 3000

CMD ["pnpm", "start"]
