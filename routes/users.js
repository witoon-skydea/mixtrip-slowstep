const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { check, validationResult } = require('express-validator');

// Load models
const User = require('../models/User');
const Trip = require('../models/Trip');

// Load middleware
const { ensureAuthenticated, ensureGuest } = require('../middleware/auth');

// @desc    Register page
// @route   GET /users/register
router.get('/register', ensureGuest, (req, res) => {
  res.render('users/register', {
    title: 'สมัครสมาชิก - MixTrip',
    description: 'สร้างบัญชีผู้ใช้ MixTrip เพื่อเริ่มวางแผนการเดินทางของคุณ'
  });
});

// @desc    Handle register
// @route   POST /users/register
router.post('/register', [
  check('username', 'กรุณาระบุชื่อผู้ใช้').notEmpty(),
  check('email', 'กรุณาระบุอีเมล').notEmpty(),
  check('email', 'กรุณาระบุอีเมลที่ถูกต้อง').isEmail(),
  check('password', 'กรุณาระบุรหัสผ่าน').notEmpty(),
  check('password', 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร').isLength({ min: 6 }),
  check('confirmPassword', 'กรุณายืนยันรหัสผ่าน').notEmpty(),
  check('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('รหัสผ่านไม่ตรงกัน');
    }
    return true;
  })
], async (req, res) => {
  const { username, email, password, confirmPassword, displayName } = req.body;
  
  // Validate inputs
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.render('users/register', {
      title: 'สมัครสมาชิก - MixTrip',
      description: 'สร้างบัญชีผู้ใช้ MixTrip เพื่อเริ่มวางแผนการเดินทางของคุณ',
      errors: errors.array(),
      username,
      email,
      displayName
    });
  }
  
  try {
    // Check if email already exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    
    if (userExists) {
      if (userExists.email === email) {
        req.flash('error_msg', 'อีเมลนี้ถูกใช้งานแล้ว');
      } else {
        req.flash('error_msg', 'ชื่อผู้ใช้นี้ถูกใช้งานแล้ว');
      }
      return res.render('users/register', {
        title: 'สมัครสมาชิก - MixTrip',
        description: 'สร้างบัญชีผู้ใช้ MixTrip เพื่อเริ่มวางแผนการเดินทางของคุณ',
        username,
        email,
        displayName
      });
    }
    
    // Create new user
    const newUser = new User({
      username,
      email,
      password,
      displayName: displayName || username
    });
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);
    
    // Save user
    await newUser.save();
    
    req.flash('success_msg', 'คุณได้ลงทะเบียนสำเร็จแล้ว สามารถเข้าสู่ระบบได้ทันที');
    res.redirect('/users/login');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'เกิดข้อผิดพลาดในการลงทะเบียน กรุณาลองใหม่อีกครั้ง');
    res.redirect('/users/register');
  }
});

// @desc    Login page
// @route   GET /users/login
router.get('/login', ensureGuest, (req, res) => {
  res.render('users/login', {
    title: 'เข้าสู่ระบบ - MixTrip',
    description: 'เข้าสู่ระบบ MixTrip เพื่อเข้าถึงแผนการเดินทางของคุณ'
  });
});

// @desc    Handle login
// @route   POST /users/login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/users/profile',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// @desc    Logout
// @route   GET /users/logout
router.get('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    req.flash('success_msg', 'คุณได้ออกจากระบบเรียบร้อยแล้ว');
    res.redirect('/users/login');
  });
});

// @desc    User profile
// @route   GET /users/profile
router.get('/profile', ensureAuthenticated, async (req, res) => {
  try {
    // ในอนาคตอาจจะดึงจำนวนทริปมาแสดงตรงนี้
    res.render('users/profile', {
      title: 'โปรไฟล์ - MixTrip',
      description: 'จัดการโปรไฟล์และแผนการเดินทางของคุณ',
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

// @desc    Get user trips API for profile
// @route   GET /users/trips
router.get('/trips', ensureAuthenticated, async (req, res) => {
  try {
    const trips = await Trip.find({ creator: req.user.id }).sort({ createdAt: -1 });
    
    res.render('trips/user-trips', {
      title: `ทริปของ ${req.user.displayName} - MixTrip`,
      description: `ดูทริปทั้งหมดของ ${req.user.displayName}`,
      trips,
      profileUser: req.user,
      isOwnProfile: true,
      layout: false
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('เกิดข้อผิดพลาดในการโหลดทริป');
  }
});

// @desc    Edit profile
// @route   GET /users/edit-profile
router.get('/edit-profile', ensureAuthenticated, (req, res) => {
  res.render('users/edit-profile', {
    title: 'แก้ไขโปรไฟล์ - MixTrip',
    description: 'แก้ไขข้อมูลส่วนตัวของคุณ',
    user: req.user
  });
});

// @desc    Handle edit profile
// @route   POST /users/edit-profile
router.post('/edit-profile', ensureAuthenticated, [
  check('displayName', 'กรุณาระบุชื่อที่แสดง').notEmpty(),
], async (req, res) => {
  const { displayName, bio, profilePicture } = req.body;
  
  // Validate inputs
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.render('users/edit-profile', {
      title: 'แก้ไขโปรไฟล์ - MixTrip',
      description: 'แก้ไขข้อมูลส่วนตัวของคุณ',
      errors: errors.array(),
      user: req.user
    });
  }
  
  try {
    // Update user
    const user = await User.findById(req.user.id);
    
    user.displayName = displayName;
    user.bio = bio;
    if (profilePicture) {
      user.profilePicture = profilePicture;
    }
    user.updatedAt = Date.now();
    
    await user.save();
    
    req.flash('success_msg', 'อัพเดตโปรไฟล์สำเร็จ');
    res.redirect('/users/profile');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'เกิดข้อผิดพลาดในการแก้ไขโปรไฟล์ กรุณาลองใหม่อีกครั้ง');
    res.redirect('/users/edit-profile');
  }
});

module.exports = router;