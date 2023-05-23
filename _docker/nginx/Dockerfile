FROM nginx:alpine

ARG CERT_COMPANY
ARG CERT_DOMAIN

ENV CERT_COMPANY=$CERT_COMPANY
ENV CERT_DOMAIN=$CERT_DOMAIN

WORKDIR /app

RUN apk add openssl

RUN mkdir -p /etc/ssl/private/
RUN mkdir -p /etc/ssl/certs/

RUN openssl req -x509 -nodes -days 3650 -subj "/C=CA/ST=QC/O=${CERT_COMPANY}/CN=${CERT_DOMAIN}" -addext "subjectAltName=DNS:${CERT_DOMAIN}" -newkey rsa:2048 -keyout /etc/ssl/private/nginx-selfsigned.key -out /etc/ssl/certs/nginx-selfsigned.crt;

CMD ["nginx"]

EXPOSE 80 443
