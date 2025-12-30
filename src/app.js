const express = require('express')
const app = express()

const accountRoutes = require('./routes/account.routes')
const transactionRoutes = require('./routes/transaction.routes')

app.use(express.json()) // 🔥 THIS LINE IS REQUIRED

app.use('/accounts', accountRoutes)
app.use('/', transactionRoutes)

module.exports = app

