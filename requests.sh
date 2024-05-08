#!/bin/bash

echo "GAME MICROSERVICES REQUESTS GRAPHQL!"

curl --request POST \
    --header 'content-type: application/json' \
    --url http://localhost:3000/ \
    --data '{"query":"query ExampleQuery($title: String!, $description: String!, $type: String!, $prix: String!) {\n  addGame(title: $title, description: $description, type: $type, prix: $prix)\n}","variables":{"title":"nureazrfeazll","description":"fdsqfdsqfdsq","type":"razreazrfdzq","prix":"efaezfgerdzqrza"}}'

curl --request POST \
    --header 'content-type: application/json' \
    --url http://localhost:3000/ \
    --data '{"query":"query ExampleQuery {\n  games\n}","variables":{}}'


curl --request POST \
    --header 'content-type: application/json' \
    --url http://localhost:3000/ \
    --data '{"query":"query ExampleQuery($gameId: String!) {\n  game(id: $gameId)\n}","variables":{"gameId":"663956a34346aca220e74575"}}'



echo "USER MICROSERVICES REQUESTS GRAPHQL!"


curl --request POST \
    --header 'content-type: application/json' \
    --url http://localhost:3000/ \
    --data '{"query":"query ExampleQuery {\n  users\n}","variables":{}}'


curl --request POST \
    --header 'content-type: application/json' \
    --url http://localhost:3000/ \
    --data '{"query":"query ExampleQuery($userId: String!) {\n  user(id: $userId)\n}","variables":{"userId":"6639579f7aa0e2a833a81a57"}}'


curl --request POST \
    --header 'content-type: application/json' \
    --url http://localhost:3000/ \
    --data '{"query":"query ExampleQuery($username: String!, $nom: String!, $prenom: String!, $age: String!, $password: String!) {\n  addUser(username: $username, nom: $nom, prenom: $prenom, age: $age, password: $password)\n}","variables":{"nom":"achraf","prenom":"Ladhari","age":"25","password":"ladhari","username":"achraf.ladhari"}}'

curl --request POST \
    --header 'content-type: application/json' \
    --url http://localhost:3000/ \
    --data '{"query":"query ExampleQuery($username: String!, $password: String!) {\n  loginUser(username: $username, password: $password)\n}","variables":{"password":"ladhari","username":"achraf.ladhari"}}'

echo "ORDERS MICROSERVICES REQUESTS GRAPHQL!"

curl --request POST \
    --header 'content-type: application/json' \
    --url http://localhost:3000/ \
    --data '{"query":"query ExampleQuery {\n  orders\n}","variables":{}}'

curl --request POST \
    --header 'content-type: application/json' \
    --url http://localhost:3000/ \
    --data '{"query":"query ExampleQuery($orderId: String!) {\n  order(id: $orderId)\n}","variables":{"orderId":"6639570d97db24c1bc83d30c"}}'

curl --request POST \
    --header 'content-type: application/json' \
    --url http://localhost:3000/ \
    --data '{"query":"query ExampleQuery($idUser: String!, $idGames: [String]!, $total: String!) {\n  addOrder(idUser: $idUser, idGames: $idGames, total: $total)\n}","variables":{"idUser":"6639579f7aa0e2a833a81a57","idGames":["663956a34346aca220e74575"],"total":"30"}}'


echo "----------------------------------------------"

echo "USERS MICROSERVICES REQUESTS REST!"
echo "\n"

echo "All Users!"
echo "\n"

curl -X 'GET' \
  'http://0.0.0.0:3000/users' \
  -H 'accept: application/json'
echo "\n"

echo "Get User By Id!"
echo "\n"

curl -X 'GET' \
  'http://0.0.0.0:3000/users/6639579f7aa0e2a833a81a57' \
  -H 'accept: application/json'
echo "\n"

echo "Register a user!"
echo "\n"

curl -X 'POST' \
  'http://0.0.0.0:3000/register' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "username": "achraf.ladhari",
  "nom": "achraf",
  "prenom": "ladhari",
  "age": "25",
  "password": "ladhari"
}'
echo "\n"

echo "Login a user!"
echo "\n"

curl -X 'POST' \
  'http://0.0.0.0:3000/login' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "username": "achraf.ladhari",
  "password": "ladhari"
}'
echo "\n"

echo "GAMES MICROSERVICES REQUESTS REST!"
echo "\n"

echo "All Games!"
echo "\n"

curl -X 'GET' \
  'http://0.0.0.0:3000/games' \
  -H 'accept: application/json'
echo "\n"

echo "Add a new Games!"
echo "\n"

curl -X 'POST' \
  'http://0.0.0.0:3000/games' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "title": "Valorant",
  "description": "Riot Games FPS Games",
  "type": "FPS",
  "prix": "Free"
}'
echo "\n"

echo "Get a game by id!"
echo "\n"

curl -X 'GET' \
  'http://0.0.0.0:3000/games/663956a34346aca220e74575' \
  -H 'accept: application/json'
echo "\n"


echo "ORDERS MICROSERVICES REQUESTS REST!"
echo "\n"

echo "All Orders!"
echo "\n"

curl -X 'GET' \
  'http://0.0.0.0:3000/orders' \
  -H 'accept: application/json'
echo "\n"

echo "Add New Order!"
echo "\n"

curl -X 'POST' \
  'http://0.0.0.0:3000/orders' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "idUser": "6639579f7aa0e2a833a81a57",
  "idGames": ["663956a34346aca220e74575"],
  "total": "30.0"
}'
echo "\n"

echo "Get an order by id!"
echo "\n"
curl -X 'GET' \
  'http://0.0.0.0:3000/orders/663b7ab141b4665e9bb98a97' \
  -H 'accept: application/json'













