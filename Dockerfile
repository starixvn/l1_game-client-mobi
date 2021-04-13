FROM registry.nexdev.net:5050/docker/node:14.16-alpine AS builder
WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn install
COPY . .
RUN npm run build

FROM git3.nexdev.net:5050/lumi-ops/docker-images/nginx:1.19-alpine
COPY ./.nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/.next /usr/share/nginx/html

