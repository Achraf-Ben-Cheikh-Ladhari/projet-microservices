// orderMicroservice.js
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
// Charger le fichier order.proto
const orderProtoPath = 'orders.proto';
const mongoose = require('mongoose');
const Order = require('./ordersModel');
const { Kafka } = require('kafkajs');

const orderProtoDefinition = protoLoader.loadSync(orderProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});


const orderProto = grpc.loadPackageDefinition(orderProtoDefinition).order;
const url = 'mongodb://0.0.0.0:27017/orders';

// Create Kafka consumer
const kafka = new Kafka({
    clientId: 'projet',
    brokers: ['0.0.0.0:9092']
});
mongoose.connect(url)
    .then(() => {
        console.log('connected to database!');
    }).catch((err) => {
        console.log(err);
})

const consumer = kafka.consumer({ groupId: 'order-group' });
const runConsumer = async () => {
    try {
        await consumer.connect();
        console.log('Connected to Kafka');
        await consumer.subscribe({ topic: 'order_topic' });
        console.log('Subscribed to order_topic');
        await consumer.subscribe({topic:'users_orders_topic'});
        console.log('Subscribed to users_orders_topic');
        await consumer.subscribe({topic:'games_orders_topic'});
        console.log('Subscribed to games_orders_topic');
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                const { action, orderData } = JSON.parse(message.value.toString());
                console.log("Logging from kafka! from topic: ",topic);
                if (action === 'addOrder') {
                    try {
                        const { idUser, idGames, total } = orderData;
                        const newOrder = new Order({ idUser, idGames, total });
                        const savedOrder = await newOrder.save();
                        console.log('Added new order:', savedOrder);
                    } catch (error) {
                        console.error('Error occurred while adding order:', error);
                    }
                }
                if (action === 'searchOrders') {
                    try {
                        const orders = await Order.find({}).exec();
                        console.log('Users : ', orders);
                    } catch (error) {
                        console.error('Error occurred while fetching orders:', error);
                    }

                }
                if (action === 'getOrder') {
                    try {
                        const { orderId } = JSON.parse(message.value.toString());
                        const order = await Order.findOne({ _id: orderId }).exec();
                        console.log('Order : ', order);
                    } catch (error) {
                        console.error('Error occurred while fetching order:', error);

                    }
                }
                if (action==='sendUser'){
                    const { token } = JSON.parse(message.value.toString());
                    console.log("user token is ",token);
                }
                if (action==='getGame'){
                    const { gameId } = JSON.parse(message.value.toString());
                    console.log("game id received from games microservice is ",gameId);
                }
            },
        });
    } catch (error) {
        console.error('Error while setting up Kafka consumer:', error);
    }
};

runConsumer().catch(console.error);



const orderService = {
    getOrder: async (call, callback) => {
        console.log("Logging from gRPC!");
        try {
            const orderId = call.request.order_id;
            //console.log(call.request);
            const order = await Order.findOne({ _id: orderId }).exec();
            /*await producer.connect();
            await producer.send({
                topic: 'tv-shows-topic',
                messages: [{ value: 'Searched for order id : '+orderId.toString() }],
            });*/

            if (!order) {
                callback({ code: grpc.status.NOT_FOUND, message: 'Order not found' });
                return;
            }
            callback(null, { order });

        } catch (error) {
            /*await producer.connect();
            await producer.send({
                topic: 'tv-shows-topic',
                messages: [{ value: `Error occurred while fetching orders: ${error}` }],
            });*/
            callback({ code: grpc.status.INTERNAL, message: 'Error occurred while fetching order' });
        }


    },
    searchOrders: async (call, callback) => {
        console.log("Logging from gRPC!");
        try {
            const orders = await Order.find({}).exec();

            /*await producer.connect();
            await producer.send({
                topic: 'tv-shows-topic',
                messages: [{ value: 'Searched for TV shows' }],
            });*/

            callback(null, { orders });
        } catch (error) {
            /*  await producer.connect();
              await producer.send({
                  topic: 'tv-shows-topic',
                  messages: [{ value: `Error occurred while fetching orders: ${error}` }],
              });*/

            callback({ code: grpc.status.INTERNAL, message: 'Error occurred while fetching orders' });
        }
    },

    addOrder: async (call, callback) => {
        console.log("Logging from gRPC!");
        const { idUser, idGames, total } = call.request;
       // console.log(call.request);
        const newOrder = new Order({ idUser, idGames, total });

        try {
            /*   await producer.connect();
   
               await producer.send({
                   topic: 'tv-shows-topic',
                   messages: [{ value: JSON.stringify(newOrder) }],
               });
   
               await producer.disconnect();*/
            console.log(newOrder);
            const savedOrder = await newOrder.save();

            callback(null, { order: savedOrder });
        } catch (error) {
            callback({ code: grpc.status.INTERNAL, message: 'Error occurred while adding order' });
        }
    }


};



// Créer et démarrer le serveur gRPC
const server = new grpc.Server();
server.addService(orderProto.OrderService.service, orderService);
const port = 50053;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(),
    (err, port) => {
        if (err) {
            console.error('Échec de la liaison du serveur:', err);
            return;
        }
        console.log(`Le serveur s'exécute sur le port ${port}`);
        server.start();
    });
console.log(`Microservice de facture en cours d'exécution sur le port
${port}`);