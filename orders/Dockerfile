FROM node:alpine

WORKDIR /orders

COPY . .

RUN npm install --force

EXPOSE 50053

CMD ["node", "ordersMicroservice.js"]
