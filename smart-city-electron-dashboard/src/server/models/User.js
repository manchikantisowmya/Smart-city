const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  user_id: {
    type: Number,
    required: false,  // Not required for login
  },
  fname: {
    type: String,
    required: false,  // Not required for login
  },
  lname: {
    type: String,
    required: false,  // Not required for login
  },
  email: {
    type: String,
    required: true,  // Required for login
    unique: true,    // Ensure email is unique across users
  },
  password: {
    type: String,
    required: true,  // Required for login, will be hashed before saving
  },
  role_id: {
     type: Number 
    },
  role_name:{ 
    type: String 
  }
},{ collection: 'User' });

// Hash the password before saving the user model
// userSchema.pre('save', async function (next) {
//   if (this.isModified('password')) {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//   }
//   next();
// });

const User = mongoose.model('User', userSchema);
module.exports = User;
