FROM node:14.15.4
ARG SERVE
ENV SERVE_TYPE ${SERVE}
WORKDIR /app
COPY .. .
ENV PATH /app/node_modules/.bin:$PATH
RUN npm install
CMD npm run $SERVE_TYPE

EXPOSE 8080
