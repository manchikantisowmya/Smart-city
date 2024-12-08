const express = require('express');
// const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');
const Drone = require('../models/Drone');
const DroneMissions_Y = require('../models/DroneMissions_Y');
const CaltransCamera = require('../models/CaltransCamera');
const IoTData = require('../models/iotData');
const router = express.Router();
const DroneStations_Y = require('../models/DroneStations_Y');
const Highway = require('../models/highway');
const Exit = require('../models/exits');
const { v4: uuidv4 } = require('uuid');

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
router.get('/dashboardDroneInfo', async (req, res) => {
  try {
    const noOfDrones = await Drone.countDocuments(); // Count drones
    const noOfMissions = await DroneMissions_Y.countDocuments(); // Count missions
    const noOfUsers = await User.countDocuments(); // Count users


    const droneStatus = await Drone.aggregate([
      { $group: { _id: '$last_known_status', count: { $sum: 1 } } } // Group by status (Active, Inactive, Charging)
    ]);

    const missionsPerDay = await DroneMissions_Y.aggregate([
      {
        // Match documents where mission_start_time exists and is a valid date
        $match: {
          mission_start_time: { $exists: true, $ne: null }
        }
      },
      {
        // Group by the day of the week from the mission_start_time field
        $group: {
          _id: { $dayOfWeek: "$mission_start_time" },
          count: { $sum: 1 }
        }
      },
      {
        // Map day numbers (1 = Sunday, ..., 7 = Saturday) to day names
        $project: {
          day: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id", 1] }, then: "Sunday" },
                { case: { $eq: ["$_id", 2] }, then: "Monday" },
                { case: { $eq: ["$_id", 3] }, then: "Tuesday" },
                { case: { $eq: ["$_id", 4] }, then: "Wednesday" },
                { case: { $eq: ["$_id", 5] }, then: "Thursday" },
                { case: { $eq: ["$_id", 6] }, then: "Friday" },
                { case: { $eq: ["$_id", 7] }, then: "Saturday" }
              ],
              default: null
            }
          },
          count: 1
        }
      },
      {
        // Sort by day of the week
        $sort: { _id: 1 }
      }
    ]);
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
    const cameras = await CaltransCamera.find(); // Use the correct model name
    res.json(cameras);
  } catch (err) {
    console.error('Error fetching cameras:', err);
    res.status(500).send('Error fetching cameras');
  }
});

// Route to get camera by ID
router.get('/camerabyId/:camera_id', async (req, res) => {
  const { camera_id } = req.params;
  console.log("Fetching camera with ID:", camera_id);  // Debugging statement
  try {
    const camera = await CaltransCamera.findOne({ camera_id });
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

// Drones
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
    const drones = await DroneMissions_Y.find({ drone_id });
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
          Address: 1,
          City: 1,
          State: 1,
          ZipCode: 1,
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

router.get('/getonemission1/:mission_id', async (req, res) => {
  const { mission_id } = req.params;
  try {
    const drone = await DroneMissions_Y.findOne({ mission_id });
    res.json(drone);
  } catch (err) {
    console.error('Error fetching drones:', err);
    res.status(500).send('Mission not found');
  }
});

router.get('/allDroneMissions', async (req, res) => {
  try {
    const drones = await DroneMissions_Y.find({});
    res.json(drones);
  } catch (err) {
    console.error('Error fetching all drone missions:', err);
    res.status(500).send('Earror fetching all drone missions');
  }
});

router.post('/addUpdateMission', async (req, res) => {
  try {
    const {
      drone_id,
      tenant_id,
      // mission_id,
      mission_distance,
      mission_name,
      items,
      defaults,
      service_type,
      mission_description,
      mission_start_time,
      mission_end_time
    } = req.body;

    let mission_id = req.body.mission_id; // Get mission_id from request body
    // console.log(mission_id);

    // If mission_id is not provided in the request body, generate a new one for creating a new mission
    // if (!mission_id) {
    let _id = uuidv4();
    //}

    // Map items to mission_waypoints format
    const mission_waypoints = items.map(item => ({
      latitude: item.coordinates[0],
      longitude: item.coordinates[1],
      altitude: item.coordinates[2],
      speed: item.speed || null,
      camera_actions: item.cameraAction == 0 ? item.cameraAction : item.cameraAction ? item.cameraAction : null,
      delay: item.delay || null
    }));

    // Add defaults to mission_global_settings
    const globalSettings = {
      aircraftType: defaults.aircraftType || null,
      defaultTerrainAlt: defaults.defaultTerrainAlt || null,
      defaultHeading: defaults.defaultHeading || null,
      defaultSpeed: defaults.defaultSpeed || null,
      defaultFrame: defaults.defaultFrame || null
    };

    // Check if mission with the given mission_id already exists
    let existingMission = await DroneMissions_Y.findOne({ mission_id });
    console.log(existingMission);
    // If mission exists, update it; otherwise, create a new mission
    if (existingMission) {
      // Update the existing mission
      existingMission = await DroneMissions_Y.findOneAndUpdate(
        { mission_id },
        {
          drone_id,
          mission_type: service_type,
          mission_location: mission_name,
          mission_waypoints,
          mission_distance,
          mission_global_settings: globalSettings,
          user_id: tenant_id,
          mission_description,
          mission_start_time,
          mission_end_time
        },
        { new: true } // Return the updated document
      );
    } else {
      // Create a new mission instance
      existingMission = new DroneMissions_Y({
        _id,
        drone_id,
        mission_id,
        mission_type: service_type,
        mission_location: mission_name,
        mission_status: 'Planned', // Assuming mission status starts as pending
        mission_waypoints,
        mission_distance,
        mission_global_settings: globalSettings,
        user_id: tenant_id,
        mission_description,
        mission_start_time,
        mission_end_time
      });
      // Save the new mission to the database
      await existingMission.save();
    }

    res.status(201).json({ message: 'Mission created/updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }

})

router.get('/dashboardCCTVInfo', async (req, res) => {
  try {

    const camera_data = await CaltransCamera.find();

    const routeCounts = {};
    const cameraLocations = [];


    camera_data.forEach((camera) => {
      // Group cameras by route
      if (!routeCounts[camera.route]) {
        routeCounts[camera.route] = { active: 0, inactive: 0 };
      }
      if (camera.inService) {
        routeCounts[camera.route].active += 1;
      } else {
        routeCounts[camera.route].inactive += 1;
      }
      cameraLocations.push({
        lat: parseFloat(camera.lat),
        lng: parseFloat(camera.lng),
      });
    });
    res.json({
      routeCounts, cameraLocations
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
