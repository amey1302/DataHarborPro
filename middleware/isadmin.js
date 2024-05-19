// middleware/is-admin.js
const AdminModel = require('../model/admin-model');

// Middleware to check if the user is an admin
const isAdmin = async (req, res, next) => {
  const { username, password } = req.session.adminUser;

  try {
    const admin = await AdminModel.findOne({ username, password });

    if (admin) {
      // User is an admin, proceed to the next middleware/route
      next();
    } else {
      // User is not an admin, redirect to the login page
      res.status(401).send('Unauthorized');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};
