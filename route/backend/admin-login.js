// routes/admin/admin-login.js
const express = require('express');
const router = express.Router();
const AdminModel = require('../../model/admin-model');

// Middleware to check if the admin is already logged in
const checkAlreadyLoggedIn = (req, res, next) => {
  if (req.session && req.session.adminUser) {
    return res.redirect('/admin-home');
  }
  next();
};

router.get('/', checkAlreadyLoggedIn, (req, res) => {
  res.render('backend/admin-login-file', { error: req.flash('error') });
  
});

router.post('/', async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await AdminModel.findOne({ username, password });

    if (admin) {
      console.log('Admin found:', admin);
      req.session.adminUser = admin._id;  // Store the admin's unique identifier
      console.log('Admin User ID:', req.session.adminUser);
      return res.redirect('/admin-home');
    } else {
      console.log('Admin not found');
      req.flash('error', 'Invalid username or password');
      return res.redirect('/login');
    }
  } catch (error) {
    console.error(error);
    req.flash('error', 'Internal server error');
    return res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
