// import axios from 'axios';
// import config from '../config.json'; // Import JSON config

// // Get the appropriate BASE_URL based on environment
// const env = process.env.NODE_ENV || 'development';
// const BASE_URL = config[env].BASE_URL;

// export const getAccidents = async () => {
//     try {
//      console.log("In accident.js")
//       // return true;
//       //const response = await axios.get(`${BASE_URL}/accidentsdata`);
//       console.log(`Fetching from ${BASE_URL}/accidentsdata`);
//       const response = await axios.get(`${BASE_URL}/accidentsdata`);

//       return response.data;
//     } catch (error) {
//       throw new Error(error.response.data.message);
//     }
//   };
import axios from 'axios';
import config from '../config.json'; // Import JSON config

// Get the appropriate BASE_URL based on environment
const env = process.env.NODE_ENV || 'development';
const BASE_URL = config[env].BASE_URL;

export const getAccidents = async () => {
      try {
       console.log("In accident.js")
        // return true;
        //const response = await axios.get(`${BASE_URL}/accidentsdata`);
        console.log(`Fetching from ${BASE_URL}/accidentsdata`);
        const response = await axios.get(`${BASE_URL}/accidentsdata`);
  
        return response.data;
      } catch (error) {
        throw new Error(error.response.data.message);
      }
    };

export const getDroneStations = async () => {
      try {
        // return true;
        const response = await axios.get(`${BASE_URL}/dronesStations`);
        return response.data;
      } catch (error) {
        throw new Error(error.response.data.message);
      }
    };