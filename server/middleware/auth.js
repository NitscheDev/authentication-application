const jwt = require('jsonwebtoken')
const { getUser } = require('../helpers/auth')

exports.verifyAuth = (req,res,next) => {
    const token = req.cookies._access
    if (!token) return res.status(401).json({code:'UNAUTHORIZED'})
    //verify token
    jwt.verify(token,process.env.ACCESS, async (err,decoded) => {
        if (err) return res.status(403).json({code:'INVALID_TOKEN'})
        const { _id } = decoded
        //get user info
        const user = await getUser({ _id }).catch(err => res.status(500).json({code:'SERVER_ERROR', err}))
        if (!user) return res.status(403).json({code:'INVALID_TOKEN'})
        //set request user and pass on
        const { name,email,isAdmin } = user
        req.user = {_id,name,email,isAdmin}
        next()
    })
}

exports.verifyAdminAuth = (req,res,next) => {
    const token = req.cookies._access
    if (!token) return res.status(401).json({code:'UNAUTHORIZED'})
    //verify token
    jwt.verify(token,process.env.ACCESS, async (err,decoded) => {
        if (err) return res.status(403).json({code:'INVALID_TOKEN'})
        const { _id } = decoded
        //get user info
        const user = await getUser({ _id }).catch(err => res.status(500).json({code:'SERVER_ERROR', err}))
        if (!user) return res.status(403).json({code:'INVALID_TOKEN'})
        //check if user is admin
        const { name,email,isAdmin } = user
        if (isAdmin === false) return res.status(403).json({code:'NOT_ADMIN'})
        //set request user and pass on
        req.user = {_id,name,email,isAdmin}
        next()
    })
}