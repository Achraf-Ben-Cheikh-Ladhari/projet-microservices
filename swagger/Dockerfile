ARG VERSION

FROM node:alpine

LABEL version=$VERSION

WORKDIR /swagger

COPY . .

RUN npm install --force

EXPOSE 4000

CMD ["node", "swagger.js"]
