module.exports = {
  // ตรวจสอบว่าผู้ใช้เข้าสู่ระบบแล้วหรือไม่
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'กรุณาเข้าสู่ระบบเพื่อเข้าถึงหน้านี้');
    res.redirect('/users/login');
  },
  
  // ตรวจสอบว่าผู้ใช้ยังไม่ได้เข้าสู่ระบบ
  ensureGuest: function(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/users/profile');
  }
};