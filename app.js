
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const graphqlHttp = require('express-graphql')

const graphqlSchema = require('./graphql/schema')
const graphqlResolver = require('./graphql/resolvers')
/* const auth = require('./middleware/auth') */
const cors = require('cors')

const app = express()

app.use(bodyParser.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    )
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200)
    }
    next()
})

app.use(cors({
    origin: '*',
  }))

/* app.use(auth) */


app.use(
    '/graphql',
    graphqlHttp({
        schema: graphqlSchema,
        rootValue: graphqlResolver,
        graphiql: true,
        formatError(err) {
            if(!err.originalError){
                return err
            }
            const data = err.originalError.data
            const message = err.message || 'An error has occurred'
            const code = err.originalError.code || 500
            return { message: message, status: code, data: data }
        }
    })
)

app.use((error, req, res, next) => {
    console.log(error)
    const status = error.statusCode || 500
    const message = error.message
    const data = error.data
    res.status(status).json({ message: message, data: data })
})

let port = process.env.port
if (port == null || port == ''){
    port = 8000
}

mongoose
    .connect(
        'mongodb+srv://FLC:1td29W3fP2SQP4iC@cluster0-74x5c.mongodb.net/test?retryWrites=true&w=majority'
    )
    .then( result => {
        app.listen(port, () =>{
            console.log(`Server is running on port ${port}`)
        })
    })
    .catch(err => console.log(err))