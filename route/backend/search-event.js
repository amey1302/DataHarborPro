const express = require('express');
const router = express.Router();
const EventModel = require('../../model/adddatamodel');

// GET route for rendering the search event page
router.get('/', async (req, res) => {
    try {
        // Check if the user is logged in
        if (!req.session || !req.session.adminUser) {
            return res.redirect('/login');
        }

        // Extract the search term from the query parameters
        const searchTerm = req.query.searchTerm ? req.query.searchTerm.trim() : '';

        // Fetch events from the database that match the search term
        const searchResults = await EventModel.find({ adminUser: req.session.adminUser._id, $or: [
            { activityDetails: { $regex: searchTerm, $options: 'i' } },
            // Add more fields as needed for searching
        ]});

        // Render the search results page with the matching events and the search term
        res.render('backend/search-event-file', { searchResults, searchTerm });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// DELETE route for deleting an event
router.delete('/:eventId', async (req, res) => {
    const eventId = req.params.eventId;

    try {
        // Find the event by ID and delete it
        await EventModel.findByIdAndDelete(eventId);
        res.status(200).json({ message: "Event deleted successfully" });
    } catch (err) {
        console.error("Error deleting event:", err);
        res.status(500).json({ error: "An error occurred while deleting the event" });
    }
});

module.exports = router;
