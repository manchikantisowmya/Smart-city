const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');
const mongoose = require('mongoose');
const router = express.Router();

// Route to get roles from the database
router.get('/fetchSignUpRoles', async (req, res) => {
  try {
    const roles = await Role.find(); // Fetch all roles from the database
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching roles' });
  }
});

// Signup Route
router.post('/signup', async (req, res) => {
  const { firstName,lastName, email, password, role_id, role_name} = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({
      lname:lastName,
      fname:firstName,
      role_id:role_id,
      email,
      password,
    });

    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    console.log('User found:',user);
    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }

    // Compare the plain-text passwords
    if (password !== user.password) {
        console.log('Invalid password for user:', email);
        return res.status(400).json({ message: 'Invalid Password' });
    }
    const role_id=user.role_id;
    const role = await Role.findOne({ role_id });
    console.log('role found:',role);
    user.role_id=role.role_id;
    user.role_name=role.role_name;
    // const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) {
    //   return res.status(400).json({ message: 'Invalid credentials' });
    // }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
