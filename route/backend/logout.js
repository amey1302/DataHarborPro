// routes/backend/logout.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).send('Internal Server Error');
    }

    // Redirect to the login page (or any other page you prefer)
    res.redirect('/');
  });
});

module.exports = router;
