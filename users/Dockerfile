FROM node:alpine

WORKDIR /users

COPY . .

RUN npm install --force

EXPOSE 50051

CMD ["node", "usersMicroservice.js"]
