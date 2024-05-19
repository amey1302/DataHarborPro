const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const AdminModel = require('../model/admin-model');

const router = express.Router();

// Use body-parser middleware to parse request bodies
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await AdminModel.findOne({ username, password });

    if (admin) {
      req.session.adminUser = {
        _id: admin._id.toString(),
        // other properties...
      };
      res.redirect('/admin-home');
    } else {
      res.send('Invalid credentials'); // Handle authentication failure
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
