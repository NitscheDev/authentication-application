const router = require('express').Router()
const { login, signup, refresh, logout } = require('../controllers/auth')
const { verifyAuth,verifyAdminAuth } = require('../middleware/auth')

router.post('/signup', signup)
router.post('/login', login)
router.post('/refresh', refresh)
router.post('/logout', logout)
//temporary
router.get('/admin', verifyAdminAuth, (req,res) => {
    res.send('Yay, you are an admin!')
})
router.get('/user', verifyAuth, (req,res) => {
    res.send(req.user)
})

module.exports = router