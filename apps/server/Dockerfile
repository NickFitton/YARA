FROM node:20-buster AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY --chown=node:node package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY --chown=node:node prisma ./prisma
RUN pnpm prisma generate

COPY --chown=node:node . .
RUN pnpm build

USER node

FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/package.json ./package.json
COPY --chown=node:node --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --chown=node:node --from=builder /app/prisma ./prisma

RUN pnpm install --prod --frozen-lockfile

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "dist/main"]
