const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HighwaySchema = new Schema({
  highway_id: {
    type: Number,
    required: true,
    unique: true
  },
  highway_number: {
    type: String,
    required: true
  },
  start_location: {
    type: String,
    required: true
  },
  end_location: {
    type: String,
    required: true
  },
  available_lanes: {
    type: Number,
    required: true
  }
},{ collection: 'HighwayInfo' });

const Highway = mongoose.model('HighwayInfo', HighwaySchema);
module.exports = Highway;
