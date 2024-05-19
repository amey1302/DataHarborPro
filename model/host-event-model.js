// Event.js
const mongoose = require('mongoose');

// Define the event schema
const eventSchema = new mongoose.Schema({
	adminUser: {type: String,required: true},
    eventCategory:{
        type: String,
        required: true
    },
    eventName: {
        type: String,
        required: true
    },
	flyer : {
        type:String,
        required:true
    },
    eventDate: {
        type: String,
        required: true
    },
    guideLines:{
        type: String,
        required: true
    }
    ,
    eventRules:{
        type: String,
        required: true
    },
    departmentalCoordinators:{
        type: String,
        required: true
    }
    ,
    eventCoordinators:{
        type: String,
        required: true
    },
    venue:{
        type:String,
        required:true
    },
    location: {
        type:String,
        required:true
    },
    registrationLink:{
        type:String,
        required:true
    }
    // Add more fields as needed
});

// Create the Event model
const HostEvent = mongoose.model('Host-Event', eventSchema);

module.exports = HostEvent;
