ARG NODE_VERSION=node:18.12.1-alpine

FROM $NODE_VERSION AS dependency-base

ENV NODE_OPTIONS='--max-old-space-size=32768'
WORKDIR /app

# code
COPY . .
ARG VITE_ZABBIX_SCHEMA
ARG VITE_ZABBIX_DOMAIN
ARG VITE_ZABBIX_ACCOUNT
ARG VITE_ZABBIX_PASSWORD
ARG VITE_SALT
ARG VITE_ISS_DOMAIN
ARG VITE_CONFIG_PASSWORD
ARG VITE_ACTIVE_DATE

# install
# RUN npm config set registry https://registry.npm.taobao.org \
#   && npm config set sass_binary_site=https://npm.taobao.org/mirrors/node-sass
RUN npm install

# build
RUN npm run build

FROM nginx:1.23.3-alpine AS production

COPY --from=dependency-base /app/dist /app/dist
COPY --from=dependency-base --chmod=644 /app/dist/*.svg /app/dist/

RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./nginx-service.conf /etc/nginx/conf.d/nginx-service.conf

EXPOSE 3000
CMD ["/bin/sh", "-c", "nginx -g 'daemon off;'"]
