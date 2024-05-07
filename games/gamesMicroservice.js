// gameMicroservice.js
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
// Charger le fichier game.proto
const gameProtoPath = 'games.proto';
const mongoose = require('mongoose');
const Games = require('./gamesModel');
const { Kafka } = require('kafkajs');

const gameProtoDefinition = protoLoader.loadSync(gameProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092']
});

//const producer = kafka.producer();

const gameProto = grpc.loadPackageDefinition(gameProtoDefinition).game;
const url = 'mongodb://0.0.0.0:27017/games';

mongoose.connect(url)
    .then(() => {
        console.log('connected to database!');
    }).catch((err) => {
        console.log(err);
    })

    const consumer = kafka.consumer({ groupId: 'game-group' });
    const runConsumer = async () => {
        try {
            await consumer.connect();
            console.log('Connected to Kafka');
            await consumer.subscribe({ topic: 'game_topic' });
            console.log('Subscribed to game_topic');
    
            await consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    const { action, gameData } = JSON.parse(message.value.toString());
                    if (action === 'addGame') {
                        try {
                            const { title, description, type, prix } = gameData;
                            const newGame = new Games({ title, description, type, prix });
                            const savedGame = await newGame.save();
                            console.log('Added new game:', savedGame);
                        } catch (error) {
                            console.error('Error occurred while adding game:', error);
                        }
                    }
                    if (action === 'searchGames') {
                        try {
                            const games = await Games.find({}).exec();
                            console.log('Games : ', games);
                        } catch (error) {
                            console.error('Error occurred while fetching games:', error);
                        }
    
                    }
                    if (action === 'getGame') {
                        try {
                            const { gameId } = JSON.parse(message.value.toString());
                            const game = await Games.findOne({ _id: gameId }).exec();
                            console.log('Game : ', game);
                        } catch (error) {
                            console.error('Error occurred while fetching game:', error);
    
                        }
    
    
                    }
                },
            });
        } catch (error) {
            console.error('Error while setting up Kafka consumer:', error);
        }
    };
    
    runConsumer().catch(console.error);

const gameService = {
    getGame: async (call, callback) => {
        try {
            const gameId = call.request.game_id;
            //console.log(call.request);
            const game = await Games.findOne({ _id: gameId }).exec();

            if (!game) {
                callback({ code: grpc.status.NOT_FOUND, message: 'Game not found' });
                return;
            }
            callback(null, { game });

        } catch (error) {

            callback({ code: grpc.status.INTERNAL, message: 'Error occurred while fetching game' });
        }


    },
    searchGames: async (call, callback) => {
        try {
            const games = await Games.find({}).exec();


            callback(null, { games });
        } catch (error) {
 

            callback({ code: grpc.status.INTERNAL, message: 'Error occurred while fetching games' });
        }
    },
    
    addGame: async (call, callback) => {
        const { title, description,type,prix } = call.request;

        //console.log(call.request);
        const newGame = new Games({ title, description,type,prix });

        try {
         /*   await producer.connect();

            await producer.send({
                topic: 'tv-shows-topic',
                messages: [{ value: JSON.stringify(newGame) }],
            });

            await producer.disconnect();*/
          //  console.log(newGame);
            const savedGame = await newGame.save();

            callback(null, { game: savedGame });
        } catch (error) {
            callback({ code: grpc.status.INTERNAL, message: 'Error occurred while adding game' });
        }
    }


};



// Créer et démarrer le serveur gRPC
const server = new grpc.Server();
server.addService(gameProto.GameService.service, gameService);
const port = 50052;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(),
    (err, port) => {
        if (err) {
            console.error('Échec de la liaison du serveur:', err);
            return;
        }
        console.log(`Le serveur s'exécute sur le port ${port}`);
        server.start();
    });
console.log(`Microservice de Jeux Vidéo en cours d'exécution sur le port
${port}`);