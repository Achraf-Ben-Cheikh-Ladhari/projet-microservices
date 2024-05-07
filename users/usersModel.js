const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    nom: String,
    prenom: String,
    age: String,
    password: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;