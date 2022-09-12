const path = require('path')
const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.use(express.static(path.join(__dirname,'../client/public')))

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname,'../client/public/index.html'))
})

module.exports = app