// resolvers.js
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
// Charger les fichiers proto pour les films et les séries TV
const gameProtoPath = "games.proto";
const orderProtoPath = "orders.proto";
const { Kafka } = require('kafkajs');
const bcrypt = require('bcrypt');


const gameProtoDefinition = protoLoader.loadSync(gameProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const orderProtoDefinition = protoLoader.loadSync(orderProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const kafka = new Kafka({
    clientId: 'projet',
    brokers: ['0.0.0.0:9092']
});
const producer = kafka.producer();

const gameProto = grpc.loadPackageDefinition(gameProtoDefinition).game;
const orderProto = grpc.loadPackageDefinition(orderProtoDefinition).order;

// Définir les résolveurs pour les requêtes GraphQL
const resolvers = {
    Query: {
        user: async (_, { id }) => {
            try {
                await producer.connect();
                await producer.send({
                    topic: 'user_topic',
                    messages: [{ value: JSON.stringify({ action: 'getUser', userId: id }) }]
                });
                await producer.disconnect();
                return ('User query sent to Kafka');
            } catch (error) {
                console.error('Error publishing message to Kafka:', error);
                throw new Error('Failed to query user');
            }
        },
        deleteUser: async (_, { id }) => {
            try {
                await producer.connect();
                await producer.send({
                    topic: 'user_topic',
                    messages: [{ value: JSON.stringify({ action: 'deleteUser', userId: id }) }]
                });
                await producer.disconnect();
                return ('User delete query sent to Kafka');
            } catch (error) {
                console.error('Error publishing message to Kafka:', error);
                throw new Error('Failed to query user');
            }
        },
        addUser: async (_, { username, nom, prenom, age, password }) => {
            try {
                await producer.connect();
                salt = bcrypt.genSaltSync(10);
                password = bcrypt.hashSync(password, salt);
                userData = {
                    username: username,
                    nom: nom,
                    prenom: prenom,
                    age: age,
                    password: password
                }
                await producer.send({
                    topic: 'user_topic',
                    messages: [{ value: JSON.stringify({ action: 'addUser', userData }) }]
                });
                await producer.disconnect();
                return ('Add user request sent to Kafka');
            } catch (error) {
                console.error('Error publishing message to Kafka:', error);
                throw new Error('Failed to add user');
            }
        },
        loginUser: async (_, { username, password }) => {
            try {
                await producer.connect();
                const userData = {
                    username: username,
                    password: password
                };
                await producer.send({
                    topic: 'user_topic',
                    messages: [{ value: JSON.stringify({ action: 'loginUser', userData }) }]
                });

                await producer.disconnect();

                return ('Login user request sent to Kafka');
            } catch (error) {
                console.error('Error publishing message to Kafka:', error);
                throw new Error('Failed to login user');
            }
        },

        updateUser: async (_, { id, nom, prenom, age }) => {
            try {
                await producer.connect();

                await producer.send({
                    topic: 'user_topic',
                    messages: [{ value: JSON.stringify({ action: 'updateUser', id, nom, prenom, age }) }]
                });
                await producer.disconnect();
                return ('Update user request sent to Kafka');
            } catch (error) {
                console.error('Error publishing message to Kafka:', error);
                throw new Error('Failed to add user');
            }
        },
        users: async () => {
            try {
                await producer.connect();
                await producer.send({
                    topic: 'user_topic',
                    messages: [{ value: JSON.stringify({ action: 'searchUsers' }) }]
                });
                await producer.disconnect();
                return ('Searching for all users');
            } catch (error) {
                console.error('Error publishing message to Kafka:', error);
                throw new Error('Failed to Searching users');
            }
        },
        addGame: async (_, { title, description, type, prix }) => {
            try {
                await producer.connect();
                const gameData = {
                    title: title,
                    description: description,
                    type: type,
                    prix: prix
                };
                await producer.send({
                    topic: 'game_topic',
                    messages: [{ value: JSON.stringify({ action: 'addGame', gameData }) }]
                });
                await producer.disconnect();
                return ('Add game request sent to Kafka');
            } catch (error) {
                console.error('Error publishing message to Kafka:', error);
                throw new Error('Failed to add game');
            }
        },
        game: async (_, { id }) => {
            try {
                await producer.connect();
                await producer.send({
                    topic: 'game_topic',
                    messages: [{ value: JSON.stringify({ action: 'getGame', gameId: id }) }]
                });
                await producer.disconnect();
                return ('Game query sent to Kafka');
            } catch (error) {
                console.error('Error publishing message to Kafka:', error);
                throw new Error('Failed to query game');
            }
        },
        games: async () => {
            try {
                await producer.connect();
                await producer.send({
                    topic: 'game_topic',
                    messages: [{ value: JSON.stringify({ action: 'searchGames' }) }]
                });
                await producer.disconnect();
                return ('Searching for all games');
            } catch (error) {
                console.error('Error publishing message to Kafka:', error);
                throw new Error('Failed to search games');
            }
        },

        addOrder: async (_, { idUser, idGames, total }) => {
            try {
                await producer.connect();
                orderData = {
                    idUser: idUser,
                    idGames: idGames,
                    total: total,
                }
                await producer.send({
                    topic: 'order_topic',
                    messages: [{ value: JSON.stringify({ action: 'addOrder', orderData }) }]
                });
                await producer.disconnect();
                return ('Add order request sent to Kafka');
            } catch (error) {
                console.error('Error publishing message to Kafka:', error);
                throw new Error('Failed to add order');
            }
            // Effectuer un appel gRPC au microservice de films
            /* const client = new orderProto.OrderService('localhost:50053',
                 grpc.credentials.createInsecure());
             return new Promise((resolve, reject) => {
                 client.addOrder({ idUser: idUser, idGames: idGames, total: total }, (err, response) => {
                     if (err) {
                         reject(err);
                     } else {
                         resolve(response.order);
                     }
                 });
             });*/
        },
        order: async (_, { id }) => {
            try {
                await producer.connect();
                await producer.send({
                    topic: 'order_topic',
                    messages: [{ value: JSON.stringify({ action: 'getOrder', orderId: id }) }]
                });
                await producer.disconnect();
                return ('Order query sent to Kafka');
            } catch (error) {
                console.error('Error publishing message to Kafka:', error);
                throw new Error('Failed to query order');
            }
            // Effectuer un appel gRPC au microservice de séries TV
            /*const client = new orderProto.OrderService('localhost:50053',
                grpc.credentials.createInsecure());
            return new Promise((resolve, reject) => {
                client.getOrder({ order_id: id }, (err, response) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(response.order);
                    }
                });
            });*/
        },
        orders: async () => {
            try {
                await producer.connect();
                await producer.send({
                    topic: 'order_topic',
                    messages: [{ value: JSON.stringify({ action: 'searchOrders' }) }]
                });
                await producer.disconnect();
                return ('Searching for all orders');
            } catch (error) {
                console.error('Error publishing message to Kafka:', error);
                throw new Error('Failed to Searching orders');
            }
            // Effectuer un appel gRPC au microservice de séries TV
            /*const client = new orderProto.OrderService('localhost:50053',
                grpc.credentials.createInsecure());
            return new Promise((resolve, reject) => {
                client.searchOrders({}, (err, response) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(response.orders);
                    }
                });
            });*/
        },
    },
};
module.exports = resolvers;