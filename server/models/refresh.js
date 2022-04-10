const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    userId: String,
    token: String
})

module.exports = mongoose.model('refresh', Schema, 'refresh_tokens')