const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Load models
const Trip = require('../models/Trip');
const User = require('../models/User');

// Load middleware
const { ensureAuthenticated } = require('../middleware/auth');

// @desc    Explore trips page
// @route   GET /trips
router.get('/', async (req, res) => {
  try {
    // ในอนาคตจะแสดงทริปสาธารณะทั้งหมด แต่ตอนนี้เราแค่แสดงหน้าว่าง
    res.render('trips/explore', {
      title: 'สำรวจทริป - MixTrip',
      description: 'ค้นพบและสำรวจทริปจากผู้ใช้ทั่วโลก'
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('500', {
      title: '500 - Server Error',
      description: 'Something went wrong on our end'
    });
  }
});

// @desc    Create trip page
// @route   GET /trips/create
router.get('/create', ensureAuthenticated, (req, res) => {
  res.render('trips/create', {
    title: 'สร้างทริปใหม่ - MixTrip',
    description: 'สร้างแผนการเดินทางของคุณด้วย MixTrip'
  });
});

// @desc    Handle create trip
// @route   POST /trips/create
router.post('/create', ensureAuthenticated, [
  check('title', 'กรุณาระบุชื่อทริป').notEmpty(),
  check('startDate', 'กรุณาระบุวันที่เริ่มต้น').notEmpty(),
  check('endDate', 'กรุณาระบุวันที่สิ้นสุด').notEmpty()
], async (req, res) => {
  const { 
    title, 
    description, 
    isPublic, 
    startDate, 
    endDate, 
    coverImage,
    locations,
    days
  } = req.body;
  
  // Validate inputs
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.render('trips/create', {
      title: 'สร้างทริปใหม่ - MixTrip',
      description: 'สร้างแผนการเดินทางของคุณด้วย MixTrip',
      errors: errors.array(),
      trip: {
        title,
        description,
        isPublic: isPublic === 'true',
        startDate,
        endDate,
        coverImage,
        locations: locations ? JSON.parse(locations) : [],
        days: days ? JSON.parse(days) : []
      }
    });
  }
  
  try {
    // Create new trip
    const newTrip = new Trip({
      title,
      description,
      creator: req.user.id,
      isPublic: isPublic === 'true',
      startDate,
      endDate,
      coverImage: coverImage || '',
      locations: locations ? JSON.parse(locations) : [],
      days: days ? JSON.parse(days) : []
    });
    
    // Save trip
    const savedTrip = await newTrip.save();
    
    req.flash('success_msg', 'สร้างทริปสำเร็จแล้ว');
    res.redirect(`/trips/${savedTrip._id}`);
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'เกิดข้อผิดพลาดในการสร้างทริป กรุณาลองใหม่อีกครั้ง');
    res.redirect('/trips/create');
  }
});

// @desc    Add activity to trip day
// @route   POST /trips/:id/days/:dayIndex/activities
router.post('/:id/days/:dayIndex/activities', ensureAuthenticated, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    
    // Check if trip exists
    if (!trip) {
      req.flash('error_msg', 'ไม่พบทริปที่ต้องการ');
      return res.redirect('/users/profile');
    }
    
    // Check if user is the creator
    if (trip.creator.toString() !== req.user.id) {
      req.flash('error_msg', 'คุณไม่มีสิทธิ์แก้ไขทริปนี้');
      return res.redirect('/trips/' + req.params.id);
    }
    
    const dayIndex = parseInt(req.params.dayIndex);
    
    // Check if day exists
    if (!trip.days[dayIndex]) {
      req.flash('error_msg', 'ไม่พบวันที่ต้องการ');
      return res.redirect('/trips/' + req.params.id);
    }
    
    const { title, description, startTime, endTime, location, notes } = req.body;
    
    // Create new activity
    const newActivity = {
      title,
      description,
      startTime,
      endTime,
      location: JSON.parse(location),
      notes,
      photos: []
    };
    
    // Add activity to day
    trip.days[dayIndex].activities.push(newActivity);
    trip.updatedAt = Date.now();
    
    await trip.save();
    
    req.flash('success_msg', 'เพิ่มกิจกรรมสำเร็จแล้ว');
    res.redirect('/trips/' + req.params.id);
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'เกิดข้อผิดพลาดในการเพิ่มกิจกรรม กรุณาลองใหม่อีกครั้ง');
    res.redirect('/trips/' + req.params.id);
  }
});

// @desc    Trip detail page
// @route   GET /trips/:id
router.get('/:id', async (req, res) => {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).render('404', {
        title: '404 - Page Not Found',
        description: 'The page you are looking for does not exist'
      });
    }

    const trip = await Trip.findById(req.params.id).populate('creator', 'username displayName profilePicture');
    
    // Check if trip exists
    if (!trip) {
      return res.status(404).render('404', {
        title: '404 - Page Not Found',
        description: 'The page you are looking for does not exist'
      });
    }
    
    // Check if trip is public or user is the creator
    if (!trip.isPublic && (!req.user || trip.creator._id.toString() !== req.user.id)) {
      req.flash('error_msg', 'คุณไม่มีสิทธิ์เข้าถึงทริปนี้');
      return res.redirect('/trips');
    }
    
    // Increment view count
    trip.viewCount += 1;
    await trip.save();
    
    res.render('trips/detail', {
      title: `${trip.title} - MixTrip`,
      description: trip.description || `ทริปโดย ${trip.creator.displayName}`,
      trip,
      user: req.user,
      isCreator: req.user && trip.creator._id.toString() === req.user.id
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('500', {
      title: '500 - Server Error',
      description: 'Something went wrong on our end'
    });
  }
});

// @desc    Edit trip page
// @route   GET /trips/:id/edit
router.get('/:id/edit', ensureAuthenticated, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    
    // Check if trip exists
    if (!trip) {
      req.flash('error_msg', 'ไม่พบทริปที่ต้องการ');
      return res.redirect('/users/profile');
    }
    
    // Check if user is the creator
    if (trip.creator.toString() !== req.user.id) {
      req.flash('error_msg', 'คุณไม่มีสิทธิ์แก้ไขทริปนี้');
      return res.redirect('/trips/' + req.params.id);
    }
    
    res.render('trips/edit', {
      title: `แก้ไขทริป ${trip.title} - MixTrip`,
      description: 'แก้ไขรายละเอียดทริปของคุณ',
      trip,
      user: req.user
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('500', {
      title: '500 - Server Error',
      description: 'Something went wrong on our end'
    });
  }
});

// @desc    Handle edit trip
// @route   PUT /trips/:id
router.put('/:id', ensureAuthenticated, [
  check('title', 'กรุณาระบุชื่อทริป').notEmpty(),
  check('startDate', 'กรุณาระบุวันที่เริ่มต้น').notEmpty(),
  check('endDate', 'กรุณาระบุวันที่สิ้นสุด').notEmpty()
], async (req, res) => {
  const { 
    title, 
    description, 
    isPublic, 
    startDate, 
    endDate, 
    coverImage,
    locations,
    days
  } = req.body;
  
  // Validate inputs
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    try {
      const trip = await Trip.findById(req.params.id);
      return res.render('trips/edit', {
        title: `แก้ไขทริป ${trip.title} - MixTrip`,
        description: 'แก้ไขรายละเอียดทริปของคุณ',
        errors: errors.array(),
        trip: {
          _id: req.params.id,
          title,
          description,
          isPublic: isPublic === 'true',
          startDate,
          endDate,
          coverImage,
          creator: trip.creator,
          locations: locations ? JSON.parse(locations) : trip.locations,
          days: days ? JSON.parse(days) : trip.days
        },
        user: req.user
      });
    } catch (err) {
      console.error(err);
      req.flash('error_msg', 'เกิดข้อผิดพลาดในการแก้ไขทริป กรุณาลองใหม่อีกครั้ง');
      return res.redirect('/trips/' + req.params.id);
    }
  }
  
  try {
    const trip = await Trip.findById(req.params.id);
    
    // Check if trip exists
    if (!trip) {
      req.flash('error_msg', 'ไม่พบทริปที่ต้องการ');
      return res.redirect('/users/profile');
    }
    
    // Check if user is the creator
    if (trip.creator.toString() !== req.user.id) {
      req.flash('error_msg', 'คุณไม่มีสิทธิ์แก้ไขทริปนี้');
      return res.redirect('/trips/' + req.params.id);
    }
    
    // Update trip
    trip.title = title;
    trip.description = description;
    trip.isPublic = isPublic === 'true';
    trip.startDate = startDate;
    trip.endDate = endDate;
    if (coverImage) {
      trip.coverImage = coverImage;
    }
    if (locations) {
      trip.locations = JSON.parse(locations);
    }
    if (days) {
      trip.days = JSON.parse(days);
    }
    trip.updatedAt = Date.now();
    
    await trip.save();
    
    req.flash('success_msg', 'แก้ไขทริปสำเร็จแล้ว');
    res.redirect('/trips/' + req.params.id);
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'เกิดข้อผิดพลาดในการแก้ไขทริป กรุณาลองใหม่อีกครั้ง');
    res.redirect('/trips/' + req.params.id + '/edit');
  }
});

// @desc    Delete trip
// @route   DELETE /trips/:id
router.delete('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    
    // Check if trip exists
    if (!trip) {
      req.flash('error_msg', 'ไม่พบทริปที่ต้องการ');
      return res.redirect('/users/profile');
    }
    
    // Check if user is the creator
    if (trip.creator.toString() !== req.user.id) {
      req.flash('error_msg', 'คุณไม่มีสิทธิ์ลบทริปนี้');
      return res.redirect('/trips/' + req.params.id);
    }
    
    // Delete trip
    await Trip.findByIdAndDelete(req.params.id);
    
    req.flash('success_msg', 'ลบทริปสำเร็จแล้ว');
    res.redirect('/users/profile');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'เกิดข้อผิดพลาดในการลบทริป กรุณาลองใหม่อีกครั้ง');
    res.redirect('/trips/' + req.params.id);
  }
});

// @desc    Get user trips
// @route   GET /trips/user/:userId
router.get('/user/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      req.flash('error_msg', 'ไม่พบผู้ใช้');
      return res.redirect('/');
    }
    
    // Find public trips for this user or all trips if it's the logged-in user
    const query = { creator: req.params.userId };
    if (!req.user || req.user.id !== req.params.userId) {
      query.isPublic = true;
    }
    
    const trips = await Trip.find(query).sort({ createdAt: -1 });
    
    res.render('trips/user-trips', {
      title: `ทริปของ ${user.displayName} - MixTrip`,
      description: `ดูทริปทั้งหมดของ ${user.displayName}`,
      trips,
      profileUser: user,
      isOwnProfile: req.user && req.user.id === req.params.userId
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('500', {
      title: '500 - Server Error',
      description: 'Something went wrong on our end'
    });
  }
});

module.exports = router;
