FROM node:12.3.0 AS builder

WORKDIR /var/www

ADD . .

RUN npm install -g @angular/cli@8.2.1 && \
npm install --save @angular-devkit/build-angular && npm install && ng build

FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /var/www/dist/ComplianceApp /usr/share/nginx/html/
