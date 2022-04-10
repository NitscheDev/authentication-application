const User = require('../models/user')

exports.getUser = (query) => {
    return new Promise((resolve,reject) => {
        User.findOne(query, (error,user) => {
            if (error) reject(error)
            resolve(user)
        })
    })
}