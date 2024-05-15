// Définir le schéma GraphQL
const typeDefs = `#graphql
type User {
id: String!
username: String!
nom: String!
prenom: String!
age: String!
password:String!
}
type Game {
id: String!
title: String!
description: String!
type: String!
prix: String!
}
type Order {
    id: String!
    idUser: String!
    idGames: [String]!
    total: String!
}
type Query {
user(id: String!): String!
users: String!
game(id: String!): String!
games: String!
order(id: String!): String!
orders: String!
addUser(username:String!, nom: String!, prenom: String!, age:String!,password: String!): String!
addGame(title: String!, description: String!, type:String! , prix:String!): String!
addOrder(idUser: String!, idGames: [String]! , total:String!): String!
deleteUser(id: String!): String!
updateUser(id:String!,nom: String!, prenom: String!, age:String!): String!
loginUser(username:String! ,password: String!): String!
}
`;
module.exports = typeDefs