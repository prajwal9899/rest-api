import express from 'express'
import {PORT} from './config'
import errorHandler from './middlewares/errorHandler'
import routes from './routes'
import {DATABASE_URL} from './config'
import mongoose from 'mongoose'
import path  from 'path'
const app = express()

// database connection
mongoose.connect(DATABASE_URL).then(() => {
    console.log('database connected successfully ');
}).catch((err) => {
    console.log(err);
})

global.appRoot = path.resolve(__dirname)

// accept multipart data
app.use(express.urlencoded({extended: false}))

// accept json data
app.use(express.json())


// errorHandler
app.use(errorHandler)

// routes
app.use('/api',routes)

app.use('/uploads', express.static('uploads'))

app.listen(PORT,() => {
    console.log(`listening on the port ${PORT}`);
})
