const mongoose = require('mongoose')

exports.generateID = () => {
    return mongoose.Types.ObjectId().toString()
}