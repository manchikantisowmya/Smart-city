const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExitSchema = new Schema({
  exit_id: {
    type: Number,
    required: true,
    unique: true
  },
  highway_id: {
    type: Number,
    required: true
  },
  exit_number: {
    type: String,
    required: true
  },
  exit_destination: {
    type: String,
    required: true
  }
},{ collection: 'HighwayExists' });

const Exit = mongoose.model('HighwayExists', ExitSchema);
module.exports = Exit;
