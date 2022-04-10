const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Refresh = require('../models/refresh')
const { isEmail } = require('valix')
const { getUser } = require('../helpers/auth')
const { generateID } = require('../helpers/default')
const { generateTokens } = require('../helpers/jwt')

exports.login = async (req,res) => {
    const { email,password } = req.body
    if (!email || !password) return res.status(400).json({code:'FIELDS_REQUIRED'})
    //retrive user from database
    const user = await getUser({ email }).catch(err => res.status(500).json({code:'SERVER_ERROR', err}))
    if (!user) return res.status(404).json({code:'INVALID_CREDENTIALS'})
    //compare passwords
    const passCheck = bcrypt.compareSync(password,user.password)
    if (!passCheck) return res.status(404).json({code:'INVALID_CREDENTIALS'})
    //destructure user
    const { _id,name,isAdmin } = user
    //generate tokens -> this also sets the httpOnly cookies
    await generateTokens({_id,isAdmin}, res)
    //send response
    return res.json({code: 'LOGIN_SUCCESS',user: { _id,name,email,isAdmin }})
}

exports.signup = async (req,res) => {
    const { name,email,password } = req.body
    if (!name || !email || !password) return res.status(400).json({code:'FIELDS_REQUIRED'})
    if (!isEmail(email)) return res.status(400).json({code:'INVALID_EMAIL'})
    //check if user already exist
    const user = await getUser({ email }).catch(err => res.status(500).json({code:'SERVER_ERROR', err}))
    if (user) return res.status(400).json({code:'EMAIL_TAKEN'})
    //generate data for new user
    const _id = generateID()
    const hash = bcrypt.hashSync(password,10)
    const isAdmin = false
    //Save new user to database
    User.create({_id,name,email,password:hash, isAdmin}, async (error,result) => {
        if (error) return res.status(500).json({code:'SERVER_ERROR', error})
        //generate tokens -> this also sets the httpOnly cookies
        await generateTokens({_id, isAdmin}, res)
        //send success response
        return res.json({
            code: 'ACCOUNT_CREATED',
            user:{_id: result._id,name: result.name,email: result.email, isAdmin:false}
        })
    })
}

exports.logout = async (req,res) => {
    const refresh_token = req.cookies._refresh
    if (!refresh_token) return res.status(401).json({code:'UNAUTHORIZED'})
    //decode token
    const decoded = jwt.decode(refresh_token)
    const { _id } = decoded
    //delete from database
    await Refresh.deleteOne({ userId:_id })
    //clear cookies
    res.cookie('_access', '', { maxAge: 1 })
    res.cookie('_refresh', '', { maxAge: 1 })
    //send response
    res.json({code:'LOGOUT_SUCCESS'})
}

exports.refresh = (req,res) => {
    const token = req.cookies._refresh
    if (!token) return res.status(401).json({code:'UNAUTHORIZED'})
    //verify token
    jwt.verify(token,process.env.REFRESH, async (err,decoded) => {
        if (err) return res.status(403).json({code:'INVALID_TOKEN'})
        const { _id,isAdmin } = decoded
        //check for refresh token in database
        const dbToken = await Refresh.findOne({ userId:_id }).exec()
        if (!dbToken) return res.status(403).json({code:'INVALID_TOKEN'})
        //generate new tokens
        await generateTokens({ _id,isAdmin }, res)
        //send response
        return res.json({code:'TOKENS_REFRESHED'})
    })
}