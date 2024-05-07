const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const bodyParser = require('body-parser');
const cors = require('cors');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const bcrypt=require('bcrypt');

const userProtoPath = "users.proto";
const gameProtoPath = "games.proto";
const orderProtoPath = "orders.proto";
const resolvers = require('./resolvers');
const typeDefs = require('./schema');

// Create a new Express application
const app = express();

app.use(cors());

const userProtoDefinition = protoLoader.loadSync(userProtoPath, {
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
const gameProtoDefinition = protoLoader.loadSync(gameProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
app.use(bodyParser.json());
const userProto = grpc.loadPackageDefinition(userProtoDefinition).user;
const gameProto = grpc.loadPackageDefinition(gameProtoDefinition).game;
const orderProto = grpc.loadPackageDefinition(orderProtoDefinition).order;



// Create ApolloServer instance with imported schema and resolvers
const server = new ApolloServer({ typeDefs, resolvers });

// Apply ApolloServer middleware to Express application
server.start().then(() => {
    app.use(
        cors(),
        bodyParser.json(),
        expressMiddleware(server),
    );
});


app.get('/users', (req, res) => {
    const client = new userProto.UserService('localhost:50051',
        grpc.credentials.createInsecure());
    client.searchUsers({}, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.users);
        }
    });
});

// Update a user
app.put('/users/:id', (req, res) => {
    const client = new userProto.UserService('localhost:50051', grpc.credentials.createInsecure());
    const { id } = req.params;
    const { nom, prenom, age } = req.body;
    client.updateUser({ id, nom, prenom, age }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.user);
        }
    });
});

// Delete a user
app.delete('/users/:id', (req, res) => {
    const client = new userProto.UserService('localhost:50051', grpc.credentials.createInsecure());
    const { id } = req.params;
    client.deleteUser({ id }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.user);
        }
    });
});

app.get('/users/:id', (req, res) => {
    const client = new userProto.UserService('localhost:50051',
        grpc.credentials.createInsecure());
    const id = req.params.id;
    client.getUser({ user_id: id }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.user);
        }
    });
});
app.post('/login', (req, res) => {
    const client = new userProto.UserService('localhost:50051',
        grpc.credentials.createInsecure());
        const data = req.body;
        const username=data.username;
        const password=data.password;
            client.loginUser({ username:username,password:password }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.token);
        }
    });
});

app.post('/register', (req, res) => {
    const client = new userProto.UserService('localhost:50051',
        grpc.credentials.createInsecure());
    const data = req.body;
    const username=data.username;
    const nom =data.nom;
    const prenom = data.prenom;
    const age= data.age;
    salt=bcrypt.genSaltSync(10);
    const password=bcrypt.hashSync(data.password,salt);
    
    client.addUser({ username:username, nom:nom, prenom:prenom, age:age, password:password }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.user);
        }
    });
});

app.get('/games', (req, res) => {
    const client = new gameProto.GameService('localhost:50052',
        grpc.credentials.createInsecure());
    client.searchGames({}, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.games);
        }
    });
});

app.get('/games/:id', (req, res) => {
    const client = new gameProto.GameService('localhost:50052',
        grpc.credentials.createInsecure());
    const id = req.params.id;
    client.getGame({ game_id: id }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.game);
        }
    });
});

app.post('/games', (req, res) => {
    const client = new gameProto.GameService('localhost:50052',
        grpc.credentials.createInsecure());
    const data = req.body;
    const title =data.title;
    const description = data.description;
    const type= data.type;
    const prix= data.prix;

   // console.log(data);
    client.addGame({ title:title,description:description,type:type,prix:prix }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.game);
        }
    });
});

app.get('/orders', (req, res) => {
    const client = new orderProto.OrderService('localhost:50053',
        grpc.credentials.createInsecure());
    client.searchOrders({}, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.orders);
        }
    });
});

app.get('/orders/:id', (req, res) => {
    const client = new orderProto.OrderService('localhost:50053',
        grpc.credentials.createInsecure());
    const id = req.params.id;
    client.getOrder({ order_id: id }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.order);
        }
    });
});

app.post('/orders', (req, res) => {
    const client = new orderProto.OrderService('localhost:50053',
        grpc.credentials.createInsecure());
    const data = req.body;
   /* const titre=data.title;
    const desc= data.description*/
    //console.log(data);
    const idUser =data.idUser;
    const idGames = data.idGames;
    const total= data.total;
    client.addOrder({ idUser:idUser,idGames:idGames,total:total }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.order);
        }
    });
});


// Start Express application
const port = 3000;
app.listen(port, () => {
    console.log(`API Gateway is running on port ${port}`);
});
