const mongoose = require('mongoose');

const droneMissionSchema = new mongoose.Schema({
  drone_id: { type: String, required: true },
  mission_type: { type: String}, 
  mission_locations: { type: String }, 
  mission_distance: { type: String, default: '' }, 
  mission_waypoints: { type: Array, default: [] }, 
  mission_id: { type: String, unique: true }, 
  mission_status: { type: String, enum: ['Pending', 'Ongoing', 'Completed'], default: 'Pending' }, // Status of the mission
  telemetry: { type: Array, default: [] }, // Telemetry data (Array)
  lineCords: { type: Array, default: [] }, // Line coordinates (Array)
  user_id: { type: String }, 
  mission_description: { type: String, default: '' }, // Description of the mission
  mission_start_time: { type: Date }, // Mission end time
  mission_global_settings: { type: Object, default: {} }
},{ collection: 'DroneMissions' });


// droneMissionSchema.pre('save', function (next) {
//   this.updated_at = new Date();
//   next();
// });

const DroneMissions = mongoose.model('DroneMissions', droneMissionSchema);

module.exports = DroneMissions;
