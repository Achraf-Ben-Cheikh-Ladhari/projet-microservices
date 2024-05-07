ARG VERSION

FROM node:alpine

LABEL version=$VERSION

WORKDIR /users

COPY . .

RUN npm install --force

EXPOSE 50051

CMD ["node", "usersMicroservice.js"]
