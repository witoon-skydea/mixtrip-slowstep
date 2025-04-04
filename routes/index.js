const express = require('express');
const router = express.Router();

// @desc    Landing/home page
// @route   GET /
router.get('/', (req, res) => {
  res.render('index', {
    title: 'MixTrip - Plan & Share Travel Itineraries',
    description: 'Create, share, and explore travel itineraries with MixTrip'
  });
});

// @desc    About page
// @route   GET /about
router.get('/about', (req, res) => {
  res.render('about', {
    title: 'About MixTrip',
    description: 'Learn more about MixTrip and how it works'
  });
});

module.exports = router;