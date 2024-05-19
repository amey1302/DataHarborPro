const express = require('express');
const router = express.Router();
const Event = require('../../model/adddatamodel'); // Assuming you have a model for events

// Route for category events page
router.get('/:activityDetails', async (req, res) => {
    const activityDetails = req.params.activityDetails;
    const searchTerm = req.query.searchTerm ? req.query.searchTerm.trim() : '';

    try {
        // Fetch events based on the activity details
        const events = await Event.find({ activityDetails: activityDetails });

        // Fetch events from the database that match the search term
        const searchResults = await Event.find({ $or: [
            { nameOfActivity: { $regex: searchTerm, $options: 'i' } },
            // Add more fields as needed for searching
        ]});

        // Render the category list template with the fetched events
        res.render('backend/general-category-list-file', { events: events, activityDetails: activityDetails, searchResults: searchResults, searchTerm: searchTerm });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
