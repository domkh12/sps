FROM node AS builder
WORKDIR /app
COPY ./package.json /app/
COPY ./dist /app/
RUN npm install
RUN npm run build
COPY . .
FROM nginx
WORKDIR /var/www/html
COPY --from=builder /app/dist /var/www/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]