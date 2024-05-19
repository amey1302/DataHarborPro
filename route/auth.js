const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const AdminModel = require('../model/admin-model');

const router = express.Router();

// Use body-parser middleware to parse request bodies
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
 // Assuming you have configured dotenv to load environment variables

// Add more timeout to the MongoDB connection
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
  socketTimeoutMS: 45000,          // Close sockets after 45 seconds of inactivity
  connectTimeoutMS: 30000,         // Timeout after 30 seconds trying to connect
};

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, options)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit the process with an error code
  });
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
