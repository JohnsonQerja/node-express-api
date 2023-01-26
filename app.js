require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const { graphqlHTTP } = require('express-graphql');

const verifyAuth = require('./api/middleware/verify-token');

const graphqlSchema = require('./api/graphql/schema');
const graphqlResolver = require('./api/graphql/resolver');

// const productRoute = require('./api/routes/product');
// const userRoute = require('./api/routes/user');
// const photoRoute = require('./api/routes/photo');
// const likeRoute = require('./api/routes/like');
// const commentRoute = require('./api/routes/comment');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE');
    return res.status(200).json({});
  }
  next();
});

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));

app.use(verifyAuth);

app.use('/graphql', graphqlHTTP({
  schema: graphqlSchema,
  rootValue: graphqlResolver,
  graphiql: true,
}));

mongoose.set('strictQuery', true);
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('DB Connected!'));

// app.use('/product', productRoute);
// app.use('/user', userRoute);
// app.use('/photo', photoRoute);
// app.use('/like', likeRoute);
// app.use('/comment', commentRoute);

// app.use((req, res, next) => {
//   const error = new Error('Not found');
//   error.status = 404;
//   next(error);
// });

// app.use((error, req, res, next) => {
//   res.status(error.status || 500);
//   res.json({
//     error: {
//       message: error.message
//     }
//   })
// });

module.exports = app;