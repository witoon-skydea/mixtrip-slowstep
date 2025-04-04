const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const methodOverride = require('method-override');
const connectDB = require('./config/db');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const flash = require('connect-flash');
const expressLayouts = require('express-ejs-layouts');

// Load env variables
dotenv.config();

// Passport config
require('./config/passport')(passport);

// Initialize express app
const app = express();

// Connect to database
connectDB();

// Body parser middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Method override middleware
app.use(methodOverride('_method'));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.messages = {
    success_msg: req.flash('success_msg'),
    error_msg: req.flash('error_msg'),
    error: req.flash('error')
  };
  next();
});

// Set view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Express EJS Layouts
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// Disable caching for development
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// Set static folder with no-cache
app.use(express.static(path.join(__dirname, 'public'), {
  etag: false,
  maxAge: '0'
}));

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

// Handle 404
app.use((req, res) => {
  res.status(404).render('404', {
    title: '404 - Page Not Found',
    description: 'The page you are looking for does not exist'
  });
});

// Handle 500
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('500', {
    title: '500 - Server Error',
    description: 'Something went wrong on our end'
  });
});

// Start server
const PORT = process.env.PORT || 5678;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});