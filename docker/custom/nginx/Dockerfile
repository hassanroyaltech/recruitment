FROM node:21.1.0 as builder

WORKDIR /app

COPY . .

COPY ./example.env.staging ./.env

RUN npm install -f --max_old_space_size=8000

RUN npm run-script --max_old_space_size=8000 build

FROM nginx:1.22.0

RUN  apt-get update \
  && apt-get install -y wget openssl build-essential \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . .

COPY ./ssl-elevatustesting/ /etc/nginx/ssl/

RUN openssl dhparam -out /etc/nginx/dhparam.pem 128

COPY ./docker/custom/nginx/default.conf /etc/nginx/conf.d/default.conf

COPY ./docker/custom/nginx/nginxconfig /etc/nginx/nginxconfig

COPY ./docker/custom/nginx/nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /app/build /app/build

EXPOSE 80 443

ENTRYPOINT ["nginx","-g","daemon off;"]