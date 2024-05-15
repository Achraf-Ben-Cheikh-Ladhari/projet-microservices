#!/bin/bash

echo "GAME MICROSERVICES REQUESTS GRAPHQL!"


curl --request POST \
    --header 'content-type: application/json' \
    --url http://localhost:3000/ \
    --data '{"query":"query ExampleQuery($title: String!, $description: String!, $type: String!, $prix: String!) {\n  addGame(title: $title, description: $description, type: $type, prix: $prix)\n}","variables":{"title":"cs go","description":"Valve game","type":"FPS","prix":"120.0"}}'

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


echo "USERS MICROSERVICES REQUESTS REST!"
echo "Register a user!"
echo "\n"


curl -X 'POST' \
  'http://0.0.0.0:3000/register' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "username": "nour",
  "nom": "achraf",
  "prenom": "ladhari",
  "age": "25",
  "password": "ladhari"
}'


echo "\n"

echo "All Users!"
echo "\n"

response=$(curl -X 'GET' 'http://0.0.0.0:3000/users' -H 'accept: application/json')
last_id=$(jq -r '.[-1].id' <<< "$response")
last_id_objectid=$(sed 's/"//g' <<< "$last_id")
last_username=$(jq -r '.[-1].username' <<< "$response")
password="ladhari"
echo $response
echo $last_username
echo $password
echo "\n"
echo "Get User By Id!"
echo "\n"
curl -X 'GET' \
  "http://0.0.0.0:3000/users/$last_id" \
  -H 'accept: application/json'
echo "\n"

echo "Login a user!"
echo "\n"

curl -X 'POST' \
  'http://0.0.0.0:3000/login' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "username": "'"$last_username"'",
  "password": "'"$password"'"
}'
echo "\n"
echo "Update a user!"
echo "\n"
curl -X 'PUT' \
  "http://0.0.0.0:3000/users/$last_id" \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "nom": "nour",
  "prenom": "sbaa",
  "age": "23"
}'


echo "\n"

echo "Delete a user!"

curl -X 'DELETE' \
  "http://0.0.0.0:3000/users/$last_id" \
  -H 'accept: application/json'

echo "\n"
echo "GAMES MICROSERVICES REQUESTS REST!"
echo "\n"
echo "Add a new Games!"
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
echo "All Games!"
echo "\n"
response=$(curl -X 'GET' 'http://0.0.0.0:3000/games' -H 'accept: application/json')
last_id=$(jq -r '.[-1].id' <<< "$response")
last_id_objectid=$(sed 's/"//g' <<< "$last_id")
echo $response
echo "\n"
echo "Get a game by id!"
echo "\n"

curl -X 'GET' \
  "http://0.0.0.0:3000/games/$last_id" \
  -H 'accept: application/json'

echo "\n"


echo "ORDERS MICROSERVICES REQUESTS REST!"
echo "\n"
echo "Add New Order!"
echo "\n"

curl -X 'POST' \
  'http://0.0.0.0:3000/orders' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "idUser": "6639579f7aa0e2a833a81a57",
  "idGames": ["663956bd4346aca220e74577", "663956a34346aca220e74575"],
  "total": "30.0"
}'


echo "All Orders!"
echo "\n"

response=$(curl -X 'GET' 'http://0.0.0.0:3000/orders' -H 'accept: application/json')
last_id=$(jq -r '.[-1].id' <<< "$response")
last_id_objectid=$(sed 's/"//g' <<< "$last_id")
echo $response
echo "\n"

echo "\n"

echo "Get an order by id!"
echo "\n"
curl -X 'GET' \
  "http://0.0.0.0:3000/orders/$last_id" \
  -H 'accept: application/json'
