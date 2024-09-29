import axios from 'axios';
import config from '../../config.json'; // Import JSON config

// Get the appropriate BASE_URL based on environment
const env = process.env.NODE_ENV || 'development';
const BASE_URL = config[env].BASE_URL;

export const loginUser = async (email, password) => {
  try {
    // return true;
    const response = await axios.post(`${BASE_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

