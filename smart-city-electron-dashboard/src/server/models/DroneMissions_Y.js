const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const CoordsSchema = new mongoose.Schema({
  latitude: Number,
  longitude: Number,
  altitude: Number,
  speed: Number,
  camera_actions: Number,
  delay: Number
});

const GlobalDefaultSettingsSchema = new mongoose.Schema({
  aircraftType: String,
  defaultTerrainAlt: Number,
  defaultHeading: Number,
  defaultSpeed: Number,
  defaultFrame: Number
});

const droneMissionSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4,
  },
  drone_id: { type: String },
  drone_station_id: { type: String },
  mission_type: { type: String },
  mission_locations: { type: String },
  mission_distance: { type: Number, default: '' },
  mission_waypoints: { type: [CoordsSchema], default: undefined },
  mission_global_settings: { type: GlobalDefaultSettingsSchema, default: undefined },
  mission_id: { type: String, unique: true },
  mission_status: { type: String }, // Status of the mission
  telemetry: { type: Array, default: [] }, // Telemetry data (Array)
  lineCords: { type: Array, default: [] }, // Line coordinates (Array)
  user_id: { type: String },
  mission_description: { type: String, default: '' }, // Description of the mission
  mission_start_time: { type: Date },
  mission_end_time: { type: Date },
}, { collection: 'DroneMissions_Y' });


const DroneMissions_Y = mongoose.model('DroneMissions_Y', droneMissionSchema);

module.exports = DroneMissions_Y;
