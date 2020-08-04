const path = require('path');
const express = require('express');
const logger = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');
const productRouter = require('./routes/productRoutes');
const userRouter = require('./routes/userRoutes');
const vendorRouter = require('./routes/vendorRoutes');
const adminRouter = require('./routes/adminRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

// App started
const app = express();

// Global Middleware
// Enaeling (cross-origin-resource-sharing)
app.use(cors());

// Set security HTTP Headers
app.use(helmet());

if(process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
}
// Limits request per hour on perticular IP address
const limiter = rateLimit({
  max: 100,
  windowMs: 60*60*1000,
  message: 'Too many request from this IP. Please try again after 1hr'
});

app.use('/api', limiter);

// Reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Middleware for Nosql query injection
app.use(mongoSanitize());

// Data sanitization agaist xss
app.use(xss());

// Prevent Parameter Pollution
app.use(hpp());
// Serving Static Files
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({extended: true, limit: '10kb'}));
app.use(cookieParser());
app.use(compression());
app.use((req, res, next) => {
  req.responseTime = new Date().toLocaleString(); // for india: 'en-IN', {timeZone: 'Asia/Kolkata'}
  // eslint-disable-next-line no-console
  // console.log(req.responseTime);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.send('<h1>App started and connected with git</h1>');
});
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/vendors', vendorRouter);
app.use('/api/admins', adminRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`requested route ${req.originalUrl} has not found on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;