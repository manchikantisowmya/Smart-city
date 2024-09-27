const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IoTDataSchema = new Schema({
  Latitude: {
    type: Number
  },
  Longitude: {
    type: Number
  },
  Location: {
    type: String
  },
  CurrentSpeed: {
    type: Number
  },
  FreeFlowSpeed: {
    type: Number
  },
  JamFactor: {
    type: Number
  },
}, { collection: 'IoTData' });

const IoTData = mongoose.model('IoTData', IoTDataSchema);

module.exports = IoTData;
