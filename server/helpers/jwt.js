const jwt = require('jsonwebtoken')
const Refresh = require('../models/refresh')

exports.createAccessToken = (payload) => {
    return jwt.sign(payload,process.env.ACCESS, {expiresIn: '1m'})
}

exports.createRefreshToken = async (payload) => {
    const userId = payload._id
    return new Promise(async (resolve,reject) => {
        //check if user already has token in database
        const dbToken = await Refresh.findOne({ userId }).exec()
        if (dbToken) await Refresh.deleteOne({ userId })
        //create and save new token
        const token = jwt.sign(payload,process.env.REFRESH)
        Refresh.create({userId,token}, (error,result) => {
            if (error) reject(error)
            resolve(token)
        })
    })
}

exports.generateTokens = async (payload, httpResopnse) => {
    //generate tokens
    const access = this.createAccessToken(payload)
    const refresh = await this.createRefreshToken(payload)
    //set cookies
    httpResopnse.cookie('_access',access,{ httpOnly: true })
    httpResopnse.cookie('_refresh',refresh,{ httpOnly: true })
    return
}