const express = require('express');
const router = express.Router();
const EventModel = require('../../model/adddatamodel'); // Assuming you have a model for events

// Route for category events page
router.get('/:activityDetails', async (req, res) => {
    const activityDetails = req.params.activityDetails;
    const searchTerm = req.query.searchTerm ? req.query.searchTerm.trim() : '';

    try {
        // Fetch events based on the activity details
        const events = await EventModel.find({ activityDetails: activityDetails });

        // Fetch events from the database that match the search term
        const searchResults = await EventModel.find({ adminUser: req.session.adminUser._id, $or: [
            { nameOfActivity: { $regex: searchTerm, $options: 'i' } },
            
            // Add more fields as needed for searching
        ]});

        // Render the category list template with the fetched events
        res.render('backend/category-list-file', { events: events, activityDetails: activityDetails, searchResults: searchResults, searchTerm: searchTerm });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
