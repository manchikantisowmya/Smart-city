
// This is form accident analysis table


const mongoose = require('mongoose');

const accidentSchema = new mongoose.Schema({
  emergencyType: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  month: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  day: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  county: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  primarySituation: {
    type: String,
    required: true,
  },
  vehiclesInvolved: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

const AccidentData = mongoose.model('Accident_Analysis', accidentSchema);

module.exports = AccidentData;

