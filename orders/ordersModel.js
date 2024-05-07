const mongoose = require('mongoose');

const ordersSchema = new mongoose.Schema({
    idUser: String,
    idGames: [{
        type:String
    }],
    quantity:String,
    total:String
});

const orders = mongoose.model('orders', ordersSchema);

module.exports = orders;