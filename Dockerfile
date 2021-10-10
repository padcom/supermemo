FROM node:16 as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build


FROM alpine as runtime

RUN apk add --no-cache tini busybox-extras
WORKDIR /var/www/html
ENTRYPOINT [ "/sbin/tini", "-g", "--" ]
CMD ["httpd", "-v", "-f", "-p", "8000" ]
EXPOSE 8000


FROM runtime

COPY --from=build /app/dist/ /var/www/html
