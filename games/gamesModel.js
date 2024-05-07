const mongoose = require('mongoose');

const gamesSchema = new mongoose.Schema({
    title: String,
    description: String,
    type:String,
    prix:String
});

const games = mongoose.model('games', gamesSchema);

module.exports = games;