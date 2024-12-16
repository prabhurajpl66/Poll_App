import express from 'express'
import dotenv from "dotenv";
import { connectDB } from './config/db.js';
import userRouter from './routes/auth.route.js';
import pollRouter from './routes/poll.route.js';
import { authenticateToken } from './middleware/authentication.js';

dotenv.config()
const app = express();
app.use(express.json())
app.use('/api', userRouter);
app.use('/api',authenticateToken, pollRouter);

app.listen(process.env.PORT,()=>{
    console.log("Server running strated........")
    connectDB()
})