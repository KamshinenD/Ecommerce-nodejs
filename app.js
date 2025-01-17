const express = require("express");
const connectDB = require("./db/connect");
require("dotenv").config();
require("express-async-errors");
const app = express();
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const morgan= require('morgan');
const cors= require('cors')
const authRouter= require('./routes/authRoutes')
const userRouter= require('./routes/userRoutes')
const productRouter= require('./routes/productRoute')
const reviewRouter= require('./routes/reviewRoutes')
const orderRouter=require('./routes/orderRoutes')

const cookieParser = require("cookie-parser");
const fileUpload= require('express-fileupload');
const rateLimiter= require('express-rate-limit');
const helmet= require('helmet');
const xss = require('xss-clean');
const mongoSanitize= require('express-mongo-sanitize');

app.set('trust proxy', 1);
app.use(rateLimiter({
  windowMs:15*60*100,
  max:60,
}));
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());

// app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET)); //sign cookie
app.use(cors());

app.use(express.static('./public'));
app.use(fileUpload());


// app.get("/", (req, res) => {
//   res.send("E Commerce App");
// });
// app.get("/api/v1", (req, res) => {
//   res.send("E Commerce App");
//   // console.log(req.cookies)
//   console.log('app', req.cookies)
// });

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/orders', orderRouter);


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
