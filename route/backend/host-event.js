// adminRoutes.js
const express = require('express');
const multer = require('multer');
const router = express.Router();
const Event = require('../../model/host-event-model'); // Import the Event model
const mongoose = require('mongoose');

// Define multer storage configuration
const storage = multer.diskStorage({
    destination: 'public/backend/flyer',
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

// Route to host an event
router.post('/', upload.single('flyer'), async (req, res) => {
    try {


        // Assuming adminUserFromForm is available in the request or session
        const adminUserFromForm = req.session.adminUser;

        // Create a new event object
        let newEvent = new Event({
            adminUser: adminUserFromForm._id,
            eventCategory:req.body.eventCategory,
            eventName:req.body.eventName,
            eventDate: req.body.eventDate,
            guideLines:req.body.guideLines,
            eventRules:req.body.eventRules,
            departmentalCoordinators : req.body.departmentalCoordinators,
            eventCoordinators:req.body.eventCoordinators,
            venue :req.body.venue,
            location:req.body.location,
            registrationLink: req.body.registrationLink
        });

        // Set flyer property if file is uploaded
        if (req.file) {
            newEvent.flyer = req.file.filename;
        }

        // Save the new event to the database
        Event.create(newEvent).then(result => {
            console.log(result);
            res.send("<script>alert('Data added successfully'); window.location.href='/admin-home';</script>");
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("<script>alert('Internal Server Error'); window.location.href='/admin-home';</script>");
    }
});

// Route to render the admin home page
router.get('/', (req, res) => {
    // Check if the user is logged in
    if (!req.session || !req.session.adminUser) {
        return res.redirect('/login');
    }

    // Render your admin home page
    res.render('backend/host-event-file', { adminUser: req.session.adminUser });
});

module.exports = router;
