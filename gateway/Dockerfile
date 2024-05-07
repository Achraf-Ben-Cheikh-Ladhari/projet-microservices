FROM node:alpine

WORKDIR /gateway

COPY . .
RUN npm install --force

EXPOSE 3000

CMD ["node", "apiGateway.js"]
