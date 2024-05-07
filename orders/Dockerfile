ARG VERSION

FROM node:alpine

LABEL version=$VERSION

WORKDIR /orders

COPY . .

RUN npm install --force

EXPOSE 50053

CMD ["node", "ordersMicroservice.js"]
