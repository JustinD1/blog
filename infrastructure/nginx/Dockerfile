FROM nginx:1.25-alpine

RUN apk add --no-cache curl
COPY default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s CMD curl -f -H "Host: jdonohoe.net" http://localhost && curl -f -H "Host: api.jdonohoe.net" http://localhost || exit 1
