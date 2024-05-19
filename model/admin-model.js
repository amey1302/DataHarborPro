// models/admin-model.js
const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  adminUser: {type: String,required: true},
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  department: { type: String, required: true },
});

const AdminModel = mongoose.model('rohit', adminSchema);

module.exports = AdminModel;
