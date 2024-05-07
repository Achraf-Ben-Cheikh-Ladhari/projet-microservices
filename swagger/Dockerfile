FROM node:alpine

WORKDIR /swagger

COPY . .

RUN npm install --force

EXPOSE 4000

CMD ["node", "swagger.js"]
