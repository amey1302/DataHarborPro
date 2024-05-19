// routes/backend/view-event.js

const express = require('express');
const router = express.Router();
const EventModel = require('../../model/adddatamodel');

// Route for viewing event details based on event ID
router.get('/:eventId', async (req, res) => {
    
    try {
        // Extract the event ID from the request parameters
        const eventId = req.params.eventId;
        console.log('Event ID:', eventId); // Add this line for debugging

        // Fetch the event details from the database based on the event ID
        const event = await EventModel.findById(eventId);

        // Check if the event exists
        if (!event) {
            // If the event doesn't exist, render a 404 page or an error message
            return res.status(404).send('Event not found');
        }

        // Render a view template with the event details
        res.render('backend/view-event-file', { event });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
