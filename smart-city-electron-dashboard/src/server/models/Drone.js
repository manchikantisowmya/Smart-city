
const mongoose = require('mongoose');
//const Drone = mongoose.model('Drone', droneSchema);


const droneSchema = new mongoose.Schema({
  drone_id: {
    type: String,
    unique: true,    // Ensure drone_id is unique
  },
  name: {
    type: String,
    //required: true,  // Drone Name is required
  },
  type: {
    type: String,
    //required: true,  // Drone Type is required
  },
  manufacturer: {
    type: String,
    //required: true,  // Manufacturer is required
  },
  description: {
    type: String,
  },
  price: {
    type: String,  // Price as a string to accommodate currency symbols
  },
  weight: {
    type: String,  // Weight as a string to accommodate units (gm, kg, etc.)
  },
  range: {
    type: String,  // Range as a string to accommodate units (miles, km, etc.)
  },
  max_speed: {
    type: String,  // Max speed as a string to accommodate units (mph, km/h)
  },
  battery_life: {
    type: String,  // Battery life as a string to accommodate time units (minutes, hours, etc.)
  },
  lidar: {
    type: String,  // Yes/No for Lidar presence
  },
  battery_capacity: {
    type: String,  // Battery capacity as a string to accommodate units (mAh, etc.)
  },
  service: {
    type: String,  // Yes/No for whether the drone is serviceable
  }
}, { collection: 'Drone' });  // Specify the collection name

// Pre-save hook to auto-generate drone_id
droneSchema.pre('save', async function(next) {
  if (!this.drone_id) {
    try {
      //const lastDrone = await DroneTypes.findOne().sort({ drone_id: -1 }).exec();
      
      const lastDrone = await Drone.findOne().sort({ drone_id: -1 }).exec();

      // Extract the numeric part of the drone_id and increment it
      const lastIdNum = lastDrone ? parseInt(lastDrone.drone_id.replace('D', '')) : 0;
      const newIdNum = lastIdNum + 1;

      // Format the new drone_id as D0XX
      this.drone_id = `D${newIdNum.toString().padStart(3, '0')}`;
      
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

const DroneTypes = mongoose.model('Drone', droneSchema);

module.exports = DroneTypes;