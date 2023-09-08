FROM hub.lumigame.com/base/node:16.19-alpine
WORKDIR /app
ENV NODE_ENV production

COPY configs.json ./configs.json
COPY game-settings.json ./game-settings.json
COPY public ./public
COPY .next ./.next
COPY node_modules ./node_modules
COPY package.json ./package.json
COPY next-i18next.config.js ./next-i18next.config.js
COPY next.config.js ./next.config.js
COPY configs/missing-configuration.js ./public/c.js

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
RUN chown -R nextjs:nodejs /app/.next
USER nextjs

EXPOSE 5000
CMD ["yarn", "start"]