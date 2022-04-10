require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 8080
const { connectDB } = require('./config/database')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(morgan('tiny'))

app.use('/api/auth', require('./routes/auth'))

connectDB(process.env.MONGO_URI)
app.listen(port, () => console.log(`Live on http://localhost:${port}`))