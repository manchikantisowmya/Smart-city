const mongoose = require('mongoose');

const droneMissionSchema = new mongoose.Schema({
  drone_id: { type: String, required: true }, // Drone ID associated with the mission
  mission_type: { type: String, required: true }, // Type of mission
  mission_locations: { type: String, required: true }, // Mission location
  mission_distance: { type: String, default: '' }, // Mission distance, can be empty
  mission_waypoints: { type: Array, default: [] }, // Waypoints in the mission (Array)
  mission_id: { type: String, required: true, unique: true }, // Unique mission ID
  mission_status: { type: String, enum: ['Pending', 'Ongoing', 'Completed'], default: 'Pending' }, // Status of the mission
  telemetry: { type: Array, default: [] }, // Telemetry data (Array)
  lineCords: { type: Array, default: [] }, // Line coordinates (Array)
  user_id: { type: String, required: true }, // User ID (email of the user who created the mission)
  mission_description: { type: String, default: '' }, // Description of the mission
  mission_start_time: { type: Date, required: true }, // Mission start time
  mission_end_time: { type: Date, required: true }, // Mission end time
  mission_global_settings: { type: Object, default: {} }, // Global settings for the mission (Object)
  created_at: { type: Date, default: Date.now }, // Automatically set created time
  updated_at: { type: Date, default: Date.now } // Automatically set updated time
},{ collection: 'DroneMissions' });


// droneMissionSchema.pre('save', function (next) {
//   this.updated_at = new Date();
//   next();
// });

const DroneMissions = mongoose.model('DroneMissions', droneMissionSchema);

module.exports = DroneMissions;
