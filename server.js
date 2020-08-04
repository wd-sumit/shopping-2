const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
  console.error('Uncaught Exception! Shutting down...');
  console.error(err);
  process.exit(1);
});

dotenv.config({ path: './config.env' }); // 
const app = require('./app');

const DB = process.env.DATABASE_URL.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
// const DB = process.env.DATABASE_LOCAL || 'mongodb://127.0.0.1:27017/ecommerce';
mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
}).then(() => console.log('connected to database'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log('listening to 3000');
});

process.on('unhandledRejection', err => {
  console.error('name:', err.name, 'message:', err.message);
  console.error('Unhandled Rejection! Shutting down...');
  server.close(() => {
      process.exit(1);
  });
});
