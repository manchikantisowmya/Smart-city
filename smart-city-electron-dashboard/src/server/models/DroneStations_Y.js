const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DroneStationSchema = new Schema({
    station_id: {
        type: String,
        unique: true
    },
    Latitude: {
        type: Number,
    },
    Longitude: {
        type: Number,
    },
    Location: {
        type: String,
    },
    Inservice: {
        type: String,
        enum: ['Yes', 'No'], // Assuming in-service is Yes or No
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    drone_id: {
        type: String,
    }
},{ collection: 'DroneStations_Y' });

// Creating the model
const DroneStations_Y = mongoose.model('DroneStations_Y', DroneStationSchema);

module.exports = DroneStations_Y;
