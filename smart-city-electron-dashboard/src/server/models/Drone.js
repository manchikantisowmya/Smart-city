const mongoose = require('mongoose');

const droneSchema = new mongoose.Schema({
  drone_id: { type: String, required: true },
  name: { type: String, required: true },
  model: { type: String, required: true },
  type: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true }, // Store price as a number
  weight: { type: Number, required: true }, // Weight in grams
  dimensions: {
    range: { type: Number, required: true }, // In kilometers
    max_speed: { type: Number, required: true }, // In meters per second or mph
    battery_life: { type: Number, required: true } // In minutes
  },
  lidar: {
    lidar: { type: Boolean, default: false } // Boolean for LIDAR support
  },
  created_at: { type: Date, default: Date.now }, // Auto-set the created date
  updated_at: { type: Date, default: Date.now }, // Auto-set the updated date
  last_known_lat: { type: Number }, // Latitude (GPS coordinates)
  last_known_lon: { type: Number }, // Longitude (GPS coordinates)
  last_known_status: { type: String, enum: ['Stopped', 'Flying', 'Charging', 'Inactive'], default: 'Inactive' },
  battery_capacity: { type: Number, required: true }, // Battery capacity in mAh
  service: { type: [String], default: [] }, // Array of service records
},{ collection: 'Drone' });


const Drone = mongoose.model('Drone', droneSchema);

module.exports = Drone;
