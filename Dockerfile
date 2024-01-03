FROM oven/bun

WORKDIR /app

COPY package*.json ./
COPY bun.lockb ./

RUN bun install --production

COPY src src
COPY tsconfig.json .
COPY config.ts .
COPY .env .
# COPY public public

# ENV NODE_ENV='production'
# ENV PORT=3002

EXPOSE 3002

CMD ["bun", "src/index.ts"]
