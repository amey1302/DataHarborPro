const express = require('express');
const router = express.Router();
const EventModel = require('../../model/adddatamodel');
const HostEventModel = require('../../model/host-event-model');
 // Assuming this model is for hosting events

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

router.get('/', async (req, res) => {
  try {
    // Check if the user is logged in
    if (!req.session || !req.session.adminUser) {
      return res.redirect('/login');
    }

    const adminUser = req.session.adminUser;

    // Fetch user-specific events from the database
    const userEvents = await EventModel.find({ adminUser: adminUser._id });

    // Fetch upcoming hosting events specific to the logged-in user from the database
    const hostingEvents = await HostEventModel.aggregate([
      { $match: { adminUser: adminUser._id } }, // Filter events by admin user
      {
        $group: {
          _id: '$eventName',
          eventDate: { $first: '$eventDate' },
          location: { $first: '$location' },
          flyer: { $first: '$flyer' },
          count: { $sum: 1 }
        }
      }
        // Filter for events with dates greater than or equal to today
      ]);


  console.log(hostingEvents);

    // Fetch category-wise event counts
    const categoryCounts = await EventModel.aggregate([
      { $match: { adminUser: adminUser._id } }, // Filter events by admin user
      { $group: { _id: '$activityDetails', count: { $sum: 1 } } } // Group events by category and count
    ]);

    // Render the template with all the fetched data
    res.render('backend/admin-home-file', {
      userEvents,
      hostingEvents,
      adminUser,
      categoryCounts,
      getRandomColor: getRandomColor
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
