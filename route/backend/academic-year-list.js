// Import necessary modules
const express = require('express');
const router = express.Router();
const YourModel = require('../../model/adddatamodel'); // Import your Mongoose model

// Define a route to fetch data from the collection
router.get('/', async (req, res) => {
    try {
        // Fetch all data from the collection
        const data = await YourModel.find();

        // Render the data in a table format
        res.render('backend/academic-year-list-file', { data }); // Assuming you have a 'table.ejs' view file
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
