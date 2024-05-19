// routes/admin/adddata.js
const express = require('express');
const multer = require('multer');
const router = express.Router();
const adddatamodel = require('../../model/adddatamodel');
const mongoose = require('mongoose');

const storage = multer.diskStorage({
    destination: 'public/backend/image',
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// Handle GET request for '/admin-home/adddata'
router.get('/', (req, res) => {
    // Check if the user is logged in
    if (!req.session || !req.session.adminUser) {
        return res.redirect('/login');
    }

    // Render your adddata.ejs or perform any other logic for GET request
    res.render('backend/adddata-file', { adminUser: req.session.adminUser });
});

router.post('/', upload.single('photo'), (req, res) => {
    // Check if the user is logged in
    if (!req.session || !req.session.adminUser) {
        return res.status(401).send('Unauthorized');
    }

    const adminUserFromForm = req.session.adminUser;

    let dataToAdd = {
        adminUser: new mongoose.Types.ObjectId(adminUserFromForm._id), // Assuming adminUser has _id property
        activityDetails: req.body.Activity_Details,
        nameOfActivity: req.body.Name_Of_Activity,
        academicYear: req.body.Academic_Year,
        startDateOfActivityHeld: req.body.Start_Date_of_Activity_Held,
        endDateOfActivityHeld: req.body.End_Date_of_Activity_Held,
        time: req.body.Time,
        noOfDays: req.body.Number_of_Days,
        typeOfActivity: req.body.Type_of_Activity,
        resourcePerson: req.body.Resource_Person,
        detailsOfResourcePerson: req.body.Professional_Details_of_Resource_Person,
        yearClass: req.body.Year_Class,
        noOfStudents: req.body.Number_of_students,
        activityIncharge: req.body.Activity_In_charge,
        descriptionOfActivity: req.body.Description_of_Activity_in_Brief
        // ... (other fields)
    };

    if (req.file) {
        dataToAdd.photo = req.file.filename;
    }

    adddatamodel.create(dataToAdd)
        .then(result => {
            console.log(result);
            res.send("<script>alert('Data added successfully'); window.location.href='/admin-home';</script>");
        })
        .catch(error => {
            console.error(error);
            res.send("<script>alert('Internal Server Error'); window.location.href='/admin-home/adddata';</script>");
        });
});

module.exports = router;
