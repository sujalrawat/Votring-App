import dotenv from 'dotenv';
import mongoose from 'mongoose'
import {app} from './app.js'

//congiguration of environment variables
dotenv.config();

//connecting database
mongoose.connect(process.env.DATABASE).then(() => {
    console.log(`Database connected successfully`)
}).catch(err => {
    console.log(`Error: ${err}`)
})

const PORT = process.env.PORT || 3000;
app.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}`)
})