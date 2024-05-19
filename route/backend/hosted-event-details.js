// routes/hosted-event-details.js

const express = require('express');
const router = express.Router();
const Event = require('../../model/host-event-model'); // Import your Event model

// Route to handle individual event details
router.get('/:eventId', async (req, res) => {
    const eventId = req.params.eventId;
    console.log('Event ID:', eventId);
  try {

    // Find the event by its ID in the database
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // If the event is found, render the details template with event data
    res.render('backend/hosted-event-details-file', { event });
  } catch (error) {
    // Handle any errors
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
