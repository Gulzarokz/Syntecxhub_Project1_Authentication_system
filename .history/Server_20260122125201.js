import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/Database.js';
import userRoutes from './routes/routes.user.js';



dotenv.config();
connectDB();

const app = express();


// const PORT = process.env.PORT || 3000;
const PORT = 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user", userRoutes);


app.listen(PORT, () => {
    console.log(`Server is listen on ${PORT}`);

})