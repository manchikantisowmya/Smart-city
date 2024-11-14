// Added by yukta from frontend.
// " this is the testing change"
const express = require('express');
// const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');
const Drone = require('../models/Drone');
const DroneMissions = require('../models/DroneMissions');
const CaltransCamera = require('../models/CaltransCamera');
const IoTData = require('../models/iotData');
const router = express.Router();
const DroneStations_Y = require('../models/DroneStations_Y');
const Highway = require('../models/highway');
const Exit = require('../models/exits');

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
  const { firstName, lastName, email, password, role_id, role_name } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({
      lname: lastName,
      fname: firstName,
      role_id: role_id,
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
    // console.log('User found:',user);
    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }

    // Compare the plain-text passwords
    if (password !== user.password) {
      console.log('Invalid password for user:', email);
      return res.status(400).json({ message: 'Invalid Password' });
    }
    const role_id = user.role_id;
    const role = await Role.findOne({ role_id });
    // console.log('role found:',role);
    user.role_id = role.role_id;
    user.role_name = role.role_name;
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

// API to fetch dashboard data
router.get('/dashboard', async (req, res) => {
  try {
    const noOfDrones = await Drone.countDocuments(); // Count drones
    const noOfMissions = await DroneMissions.countDocuments(); // Count missions
    const noOfUsers = await User.countDocuments(); // Count users


    const droneStatus = await Drone.aggregate([
      { $group: { _id: '$last_known_status', count: { $sum: 1 } } } // Group by status (Active, Inactive, Charging)
    ]);

    const missionsPerDay = await DroneMissions.aggregate([
      {
        // Match documents where mission_start_time exists and is not an empty string
        $match: {
          mission_start_time: { $ne: '' }
        }
      },
      {
        // Add a field that converts the mission_start_time string to a date
        $addFields: {
          mission_start_date: {
            $dateFromString: {
              dateString: '$mission_start_time',
              format: '%Y-%m-%d %H:%M:%S', // Define the format of your date string
              onError: null, // If conversion fails, set the value to null
              onNull: null // Handle cases where the field is null
            }
          }
        }
      },
      {
        // Match only documents where the date conversion was successful
        $match: { mission_start_date: { $ne: null } }
      },
      {
        // Group by the day of the week
        $group: {
          _id: { $dayOfWeek: '$mission_start_date' }, // Extract day of week from the converted date
          count: { $sum: 1 }
        }
      }
    ]);

    // console.log(missionsPerDay);
    res.json({
      noOfDrones,
      noOfMissions,
      noOfUsers,
      droneStatus,
      missionsPerDay,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to get all cameras
router.get('/cameras', async (req, res) => {
  try {
    const cameras = await CaltransCamera.find();
    res.json(cameras);
  } catch (err) {
    console.error('Error fetching cameras:', err);
    res.status(500).send('Error fetching cameras');
  }
});

// Route to get camera by ID
router.get('/camerabyId/:camera_id', async (req, res) => {
  const { camera_id } = req.params; // Get camera_id from the URL parameters
  try {
    const camera = await CaltransCamera.findOne({ camera_id }); // Find the camera by its camera_id
    if (camera) {
      res.json(camera);
    } else {
      res.status(404).send('Camera not found');
    }
  } catch (err) {
    console.error('Error fetching camera details:', err);
    res.status(500).send('Error fetching camera details');
  }
});
// Added by Yukta

// View Drones
router.get('/drones', async (req, res) => {
  try {
    const drones = await Drone.find();
    res.json(drones);
  } catch (err) {
    console.error('Error fetching drones:', err);
    res.status(500).send('Error fetching drones');
  }
});

// Add Drones
router.post('/drones', async (req, res) => {
  const newDrone = req.body;  // Get the new drone data from the request body
  console.log("newDrone")
  try {
    const savedDrone = await Drone.create(newDrone);  // Save it to the database
    res.status(201).json(savedDrone);  // Send the saved drone as the response
  } catch (error) {
    res.status(500).json(error);
  }
});

// Delete Drone on Drone ID
router.delete('/drones/:drone_id', async (req, res) => {  // Add :drone_id to the route path
  const droneId = req.params.drone_id;  // Get the drone_id from the route parameter
  console.log("drones from auth.js")
  console.log(droneId);
  try {
    const deletedDrone = await Drone.findOneAndDelete({ drone_id: droneId });  // Delete drone by drone_id
    if (!deletedDrone) {
      return res.status(404).json({ message: 'Drone not found' });
    }
    res.status(200).json({ message: 'Drone deleted successfully', drone: deletedDrone });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting drone', error });
  }
});

// End

router.get('/iotData', async (req, res) => {
  try {
    const iotdata = await IoTData.find();
    res.json(iotdata);
  } catch (err) {
    console.error('Error fetching IotData :', err);
    res.status(500).send('Error fetching IotData ');
  }
});

router.get('/droneMissions/:drone_id', async (req, res) => {
  const { drone_id } = req.params;
  try {
    const drones = await DroneMissions.find({ drone_id });
    res.json(drones);
  } catch (err) {
    console.error('Error fetching drones:', err);
    res.status(500).send('Error fetching drones');
  }
});

router.get('/droneStatistics', async (req, res) => {
  try {
    const noOfDrones = await Drone.countDocuments(); // Count drones
    const droneStatus = await Drone.aggregate([
      { $group: { _id: '$last_known_status', count: { $sum: 1 } } } // Group by status (Active, Inactive, Charging)
    ]);
    // console.log(missionsPerDay);
    res.json({
      noOfDrones,
      droneStatus
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching  droneStatistics' });
  }
});

router.get('/highwaysWithExits', async (req, res) => {
  try {
    const highwaysWithExits = await Highway.aggregate([
      {
        $lookup: {
          from: "exits",
          localField: "highway_id",
          foreignField: "highway_id",
          as: "exits"
        }
      },
      {
        $project: {
          highway_number: 1,
          start_location: 1,
          end_location: 1,
          available_lanes: 1,
          exits: 1
        }
      }
    ]);

    res.json(highwaysWithExits);
  } catch (err) {
    console.error('Error fetching highways with exits:', err);
    res.status(500).send('Server error');
  }
});

router.get('/dronesStations', async (req, res) => {
  try {
    const drones = await DroneStations_Y.aggregate([
      {
        $lookup: {
          from: "Drone",
          localField: "drone_id",
          foreignField: "drone_id",
          as: "drone_info"
        }
      },
      {
        $unwind: "$drone_info"
      },
      {
        $project: {
          station_id: 1,
          Latitude: 1,
          Longitude: 1,
          Location: 1,
          Inservice: 1,
          drone_id: 1,
          Address:1,
          City:1,
          State:1,
          ZipCode:1,
          "drone_info.name": 1,
          "drone_info.model": 1,
          "drone_info.manufacturer": 1,
          "drone_info.last_known_lat": 1,
          "drone_info.last_known_lon": 1,
          "drone_info.last_known_status": 1
        }
      }
    ]);
    res.json(drones);
  } catch (err) {
    console.error('Error fetching drones:', err);
    res.status(500).send('Error fetching drones');
  }
});


module.exports = router;


// })
// module.exports = router;
