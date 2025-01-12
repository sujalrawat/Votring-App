import express from 'express';
import morgan from 'morgan';
import userRouter from './routes/userRoutes.js'
import candidateRouter from './routes/candidateRoute.js'

//initializing global variable
const app = express();

//middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());



app.use('/api/v1/user',userRouter)
app.use('/api/v1/candidate',candidateRouter)

export { app };