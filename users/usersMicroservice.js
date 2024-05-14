const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const mongoose = require('mongoose');
const User = require('./usersModel');
const { Kafka } = require('kafkajs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userProtoPath = "users.proto";
const userProtoDefinition = protoLoader.loadSync(userProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const userProto = grpc.loadPackageDefinition(userProtoDefinition).user;

// MongoDB connection URL
const url = 'mongodb://0.0.0.0:27017/users';

// Connect to MongoDB
mongoose.connect(url)
    .then(() => {
        console.log('Connected to database!');
    }).catch((err) => {
        console.log(err);
    });

// Create Kafka consumer
const kafka = new Kafka({
    clientId: 'projet',
    brokers: ['0.0.0.0:9092']
});
const consumer = kafka.consumer({ groupId: 'user-group' });

const producer = kafka.producer();

const runConsumer = async () => {
    try {
        await consumer.connect();
        console.log('Connected to Kafka');
        await consumer.subscribe({ topic: 'user_topic' });
        console.log('Subscribed to user_topic');

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                const { action, userData } = JSON.parse(message.value.toString());
                console.log("Logging from kafka! ");
                if (action === 'addUser') {
                    try {
                        const { username, nom, prenom, age, password } = userData;
                        const newUser = new User({ username, nom, prenom, age, password });
                        const savedUser = await newUser.save();
                        console.log('Added new user:', savedUser);
                    } catch (error) {
                        console.error('Error occurred while adding user:', error);
                    }
                }
                if (action === 'searchUsers') {
                    try {
                        const users = await User.find({}).exec();
                        console.log('Users : ', users);
                    } catch (error) {
                        console.error('Error occurred while fetching users:', error);
                    }

                }
                if (action === 'getUser') {
                    try {
                        const { userId } = JSON.parse(message.value.toString());
                        //const userId = userID;
                        //console.log(userId);
                        const user = await User.findOne({ _id: userId }).exec();
                        console.log('User : ', user);
                    } catch (error) {
                        console.error('Error occurred while fetching user:', error);

                    }


                }
                if (action === 'deleteUser') {
                    try {
                        const { userId } = JSON.parse(message.value.toString());
                        const deletedUser = await User.findByIdAndDelete(userId);
                        console.log('User : ', deletedUser);
                    } catch (error) {
                        console.error('Error occurred while fetching user:', error);

                    }
                }
                if (action === 'updateUser') {
                    try {
                        const { id, nom, prenom, age } = JSON.parse(message.value.toString());
                        const updatedUser = await User.findByIdAndUpdate(id, { nom, prenom, age }, { new: true });
                        console.log('User : ', updatedUser);
                    } catch (error) {
                        console.error('Error occurred while fetching user:', error);

                    }
                }
                if (action === 'loginUser') {
                    try {
                        await producer.connect();
                        const { username, password } = userData;
                        //console.log(userData);
                        const user = await User.findOne({ username });
                        if (!user) {
                            console.log('Email or password is invalid!');
                            return;
                        }
                        const valid = bcrypt.compareSync(password, user.password);
                        if (!valid) {
                            console.log('Email or password is invalid!');
                            return;
                        }
                        const payload = {
                            _id: user.id,
                            username: user.username,
                            fullname: `${user.nom} ${user.prenom}`
                        };
                        
                        const token = jwt.sign(payload, '123456789');
                        await producer.send({
                            topic: 'users_orders_topic',
                            messages: [{ value: JSON.stringify({ action: 'sendUser', token: token }) }]
                        });
                        console.log("send token to orders microservice!");
                        await producer.disconnect();
                        console.log('User logged in successfully:', user, ' his token is : ', token);
                        // Send token or perform additional actions after successful login
                    } catch (error) {
                        console.error('Error occurred during login:', error);
                    }
                }
            },
        });
    } catch (error) {
        console.error('Error while setting up Kafka consumer:', error);
    }
};

runConsumer().catch(console.error);

// gRPC service definition for user service
const userService = {
    // gRPC method to get user by ID
    getUser: async (call, callback) => {
        console.log("Logging from gRPC!");
        try {
            const userId = call.request.user_id;
            const user = await User.findOne({ _id: userId }).exec();
            if (!user) {
                callback({ code: grpc.status.NOT_FOUND, message: 'User not found' });
                return;
            }
            callback(null, { user });
        } catch (error) {
            callback({ code: grpc.status.INTERNAL, message: 'Error occurred while fetching user' });
        }
    },
    // gRPC method to search users
    searchUsers: async (call, callback) => {
        console.log("Logging from gRPC!");
        try {

            const users = await User.find({}).exec();
            callback(null, { users });
        } catch (error) {
            callback({ code: grpc.status.INTERNAL, message: 'Error occurred while fetching Users' });
        }
    },
    // gRPC method to add a new user
    addUser: async (call, callback) => {
        console.log("Logging from gRPC!");
        const { username, nom, prenom, age, password } = call.request;
        //console.log(call.request);
        const newUser = new User({ username, nom, prenom, age, password });
        try {
            const savedUser = await newUser.save();
            callback(null, { user: savedUser });
        } catch (error) {
            callback({ code: grpc.status.INTERNAL, message: 'Error occurred while adding User' });
        }
    },

    loginUser: async (call, callback) => {
        console.log("Logging from gRPC!");
        await producer.connect();
        const { username, password } = call.request;
        try {
            const user = await User.findOne({ username });

            if (!user) {
                 callback(null, { token: 'Username invalid!' });
                 return;
            }
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                 callback(null, { token: 'Password is invalid!' });
                 return;
            }
            
            const payload = {
                _id: user.id,
                username: user.username,
                fullname: `${user.nom} ${user.prenom}`
            };
            
            const token = jwt.sign(payload, '123456789');
            await producer.send({
                topic: 'users_orders_topic',
                messages: [{ value: JSON.stringify({ action: 'sendUser', token: token }) }]
            });
            console.log("send token to orders microservice!");
            await producer.disconnect();
            callback(null, { token:token });
        } catch (error) {
           // console.error('Error occurred while logging in:', error);
            callback({ code: grpc.status.INTERNAL, token: 'Error occurred while logging in' });
        }
    },    
    // gRPC method to delete a user
    deleteUser: async (call, callback) => {
        const { id } = call.request;
        console.log("Logging from gRPC!");
        try {
            // Find the user by id and delete it
            const deletedUser = await User.findByIdAndDelete(id);
            if (!deletedUser) {
                callback({ code: grpc.status.NOT_FOUND, message: 'User not found' });
                return;
            }
            callback(null, { message: 'User deleted successfully', user: deletedUser });
        } catch (error) {
            console.error('Error occurred while deleting User:', error);
            callback({ code: grpc.status.INTERNAL, message: 'Error occurred while deleting User' });
        }
    },
    // gRPC method to update a user
    updateUser: async (call, callback) => {
        console.log("Logging from gRPC!");
        const { id, nom, prenom, age } = call.request;
        const _id = id
        try {
            // Find the user by id and update its fields
            const updatedUser = await User.findByIdAndUpdate(_id, { nom, prenom, age }, { new: true });
            if (!updatedUser) {
                callback({ code: grpc.status.NOT_FOUND, message: 'User not found' });
                return;
            }
            callback(null, { user: updatedUser });
        } catch (error) {
            console.error('Error occurred while updating User:', error);
            callback({ code: grpc.status.INTERNAL, message: 'Error occurred while updating User' });
        }
    }

};

// Create gRPC server
const server = new grpc.Server();
server.addService(userProto.UserService.service, userService);
const port = 50051;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(),
    (err, port) => {
        if (err) {
            console.error('Failed to bind server:', err);
            return;
        }
        console.log(`Server is running on port ${port}`);
        server.start();
    });
console.log(`User microservice is running on port ${port}`);
