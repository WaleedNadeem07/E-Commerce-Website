import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
const bodyParser = require('body-parser');
const connectDB = require('./db');

//import ApplyMiddlewares from './middlewares';
import router from './routes/userRoutes';
import productRouter from './routes/productRouter';
import cartRouter from './routes/cartRouter';

const app = express();
app.use(express.json());

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

mongoose.set('strictQuery', false);

app.use(cors());

app.use('/v1', router);
app.use('/product', productRouter);
app.use('/cart', cartRouter);

connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`app is listening to port ${process.env.PORT}`);
  });
});

