// Import necessary modules
const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const path = require('path');
const authRoutes = require('./route/auth');
const mongoose = require('mongoose');
const AdminModel = require('./model/admin-model');
const PageModel = require('./model/adddatamodel');
const HostingEvent = require('./model/host-event-model');
// Load environment variables
dotenv.config({ path: './config.env' });

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Create Express app
const app = express();

// Configure session and flash middleware
app.use(session({
  secret: 'your-secret-key',
  resave: true,
  saveUninitialized: true,
}));
app.use(flash());

// Use the authentication routes
app.use(authRoutes);

// Parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Set Cache-Control header for all routes
app.use('/', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

// Middleware to pass data to all routes
app.use(async (req, res, next) => {
  try {
    // Count total events from PageModel
    const totalCount = await PageModel.countDocuments({});
    res.locals.totalEvents = totalCount;
    next();
  } catch (err) {
    console.error('Error counting total events:', err);
    next(err);
  }
});

// Middleware to count department-wise total events
// Middleware to count admin-wise total events

// Middleware to pass data to all routes
// Middleware to pass data to all routes
// Middleware to pass data to all routes
app.use(async (req, res, next) => {
  try {
    // Count total events from PageModel
    const totalCount = await PageModel.countDocuments({});
    const activityDetailsCounts = await PageModel.aggregate([
      {
        $group: {
          _id: '$activityDetails',
          count: { $sum: 1 },
        },
      },
    ]).exec();

    // Fetch upcoming events from database
    const upcomingEvents = await HostingEvent.find({
      eventDate: { $gte: new Date() }, // Events with date greater than or equal to today
    }).sort({ eventDate: 1 }); // Sort by ascending event date

    // Fetch hosting events for the admin user

    const hostingEvents = await HostingEvent.aggregate([
     // Filter events by admin user
      {
        $group: {
          _id: '$_id',
          eventName: { $first: '$eventName' },
          eventDate: { $first: '$eventDate' },
          location: { $first: '$location' },
          flyer: { $first: '$flyer' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.locals.totalEvents = totalCount;
    res.locals.activityDetailsCounts = activityDetailsCounts;
    res.locals.upcomingEvents = upcomingEvents;
    res.locals.hostingEvents = hostingEvents; // Add hostingEvents to res.locals

    next();
  } catch (err) {
    console.error('Error counting total events or activity details:', err);
    next(err);
  }
});




// Function to generate a random color
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
function getStaticImagePath(categoryName) {
  // Map category names to their respective image paths
  const imagePaths = {
    'Dista': '/images/events.jpg',
    'Guest Lecture': '/images/guest_lecture.jpg',
    'Training': '/images/training.png',
    'Workshop': '/images/workshop.png',
    'Technosinh': '/images/technosinh.jpg',
    // Add more categories as needed
  };

  // Replace spaces with underscores

  return imagePaths[categoryName] || '/images/events.jpg';
}


// Import backend route handlers

const adminLoginRouter = require('./route/backend/admin-login');
const HostedEventDetailsRouter = require('./route/backend/hosted-event-details');
const academicYearRouter = require('./route/backend/academic-year-list');
const adminRouter = require('./route/backend/admin-home');
const categoryListRouter = require('./route/backend/category-list');
const generalCategoryListRouter = require('./route/backend/general-category-list');
const addDataRouter = require('./route/backend/adddata');
const hostEventRouter = require('./route/backend/host-event');
const searchEventRouter = require('./route/backend/search-event');
const editEventRouter = require('./route/backend/edit-event');
const logoutRouter = require('./route/backend/logout');


const viewEventRouter = require('./route/backend/view-event');

// Define route paths

app.use('/login', adminLoginRouter);
app.use('/hosted-event-details', HostedEventDetailsRouter);
app.use('/logout', logoutRouter);
app.use('/general-category-list',generalCategoryListRouter);
app.use('/admin-home', isLoggedIn, adminRouter);
app.use('/fetch-data', academicYearRouter);
app.use('/admin-home/category-list', isLoggedIn, categoryListRouter);
app.use('/admin-home/adddata', isLoggedIn, addDataRouter);
app.use('/admin-home/host-event', isLoggedIn, hostEventRouter);
app.use('/admin-home/search-event', isLoggedIn, searchEventRouter);
app.use('/admin-home/search-event/view-event',isLoggedIn, viewEventRouter);
app.use('/admin-home/search-event/edit-event',isLoggedIn, editEventRouter);

// Define the root route
app.get('/', (req, res) => {
  res.render('backend/index', {
    title: 'My Simple Index Page',
    totalEvents: res.locals.totalEvents,
    activityDetailsCounts: res.locals.activityDetailsCounts,
    getRandomColor: getRandomColor, // Pass the getRandomColor function
    getStaticImagePath: getStaticImagePath, // Pass the getStaticImagePath function
  });
});


// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/image', express.static(path.join(__dirname, 'public/backend/image')));
app.use('/flyer', express.static(path.join(__dirname, 'public/backend/flyer')));
// Parse incoming request bodies (again?)
app.use(bodyParser.urlencoded({ extended: true }));

// Handle login POST request
app.post('/login', (req, res) => {
  // Check credentials and authenticate user
  // If successful, store user information in the session
  req.session.adminUser = {
    _id: 'user-id-from-database',
    // username: req.body.username,
    // other properties...
  };
  res.redirect('/admin-home'); // Redirect to a protected route
});

// Middleware to check if the user is logged in
function isLoggedIn(req, res, next) {
  if (req.session && req.session.adminUser) {
    return next();
  } else {
    res.redirect('/login');
  }
}

// Set the port and start the server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
