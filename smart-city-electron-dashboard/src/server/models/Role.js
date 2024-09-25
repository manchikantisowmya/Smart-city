const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const roleSchema = new mongoose.Schema({
  roled_id: {
    type: Number,
    required: false,  // Not required for login
  },
  role_name: {
    type: String,
    required: false,  // Not required for login
  }
},{ collection: 'Role' });



const Role = mongoose.model('Role', roleSchema);
module.exports = Role;
