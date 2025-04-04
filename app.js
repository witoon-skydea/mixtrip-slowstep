const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const methodOverride = require('method-override');
const connectDB = require('./config/db');
const session = require('express-session');
const MongoStore = require('connect-mongo');

// Load env variables
dotenv.config();

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

// Set global variables
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Set view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Set up express-ejs-layouts
app.use(require('express-ejs-layouts'));
app.set('layout', 'layouts/main');

// Routes
app.use('/', require('./routes/index'));

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