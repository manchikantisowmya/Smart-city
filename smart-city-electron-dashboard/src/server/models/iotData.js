const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IoTDataSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  "Latitude": {
    type: Number
  },
  "Longitude": {
    type: Number
  },
  "Location": {
    type: String
  },
  "Current Speed": {
    type: Number
  },
  "Free Flow Speed": {
    type: Number
  },
  "Jam Factor": {
    type: Number
  },
  "city": {
    type: String,
  },
  State: {
    type: String,
  },
  Zipcode: {
    type: Number,
  },
}, { collection: 'IoTData' });

const IoTData = mongoose.model('IoTData', IoTDataSchema);

module.exports = IoTData;
