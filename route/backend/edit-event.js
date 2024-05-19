// Import necessary modules
const express = require('express');
const router = express.Router();
const EventModel = require('../../model/adddatamodel');

// GET route for rendering the edit event form
router.get('/:eventId', async (req, res) => {
    try {
        // Check if the user is logged in
        if (!req.session || !req.session.adminUser) {
            return res.redirect('/login');
        }

        // Get the event ID from the URL parameter
        const eventId = req.params.eventId;

        // Fetch the event details from the database using the ID
        const event = await EventModel.findById(eventId);

        // Render the edit event form with the event details
        res.render('backend/edit-event-file', { event });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// POST route for updating the event details
router.post('/:eventId', async (req, res) => {
    try {
        // Get the event ID from the URL parameter
        const eventId = req.params.eventId;

        // Extract updated event details from the request body
        const updatedEventDetails = {
            activityDetails: req.body.activityDetails,
            nameOfActivity: req.body.nameOfActivity,
            startDateOfActivityHeld: req.body.startDateOfActivityHeld,
            endDateOfActivityHeld: req.body.endDateOfActivityHeld,
            time: req.body.time,
            noOfDays: req.body.noOfDays,
            typeOfActivity: req.body.typeOfActivity,
            resourcePerson: req.body.resourcePerson,
            detailsOfResourcePerson: req.body.detailsOfResourcePerson,
            yearClass: req.body.yearClass,
            noOfStudents: req.body.noOfStudents,
            activityIncharge: req.body.activityIncharge,
            photo: req.body.photo,
            descriptionOfActivity: req.body.descriptionOfActivity
        };

        // Update the event in the database
        await EventModel.findByIdAndUpdate(eventId, updatedEventDetails);

        // Redirect to the search event page or any other appropriate page
        res.redirect('/admin-home/search-event');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
