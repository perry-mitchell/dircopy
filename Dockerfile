FROM node:18

WORKDIR /app

COPY source /app/source
COPY package.json package-lock.json tsconfig.json scripts/start.sh /app

RUN npm install --also=dev \
    && npm run build \
    && rm -rf source \
    && npm prune --production

CMD ["start.sh"]
