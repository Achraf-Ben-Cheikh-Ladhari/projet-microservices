ARG VERSION

FROM node:alpine

LABEL version=$VERSION

WORKDIR /gateway

COPY . .
RUN npm install --force

EXPOSE 3000

CMD ["node", "apiGateway.js"]
