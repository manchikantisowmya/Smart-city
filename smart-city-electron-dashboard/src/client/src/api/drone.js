import axios from 'axios';
import config from '../config.json'; // Import JSON config

// Get the appropriate BASE_URL based on environment
const env = process.env.NODE_ENV || 'development';
const BASE_URL = config[env].BASE_URL;

export const getDrones = async () => {
  try {
    // return true;
    const response = await axios.get(`${BASE_URL}/drones`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};


export const getDroneMissions = async (drone_id) => {
  try {
    // return true;
    const response = await axios.get(`${BASE_URL}/droneMissions/${drone_id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
