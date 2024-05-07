FROM node:alpine

WORKDIR /games

COPY . .

RUN npm install @grpc/grpc-js --force


EXPOSE 50052

CMD ["node", "gamesMicroservice.js"]
