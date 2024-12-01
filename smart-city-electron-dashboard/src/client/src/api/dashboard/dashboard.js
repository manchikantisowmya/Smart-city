import axios from 'axios';
import config from '../../config.json'; // Import JSON config

// Get the appropriate BASE_URL based on environment
const env = process.env.NODE_ENV || 'development';
const BASE_URL = config[env].BASE_URL;

export const getDashboardDroneInfo = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/dashboardDroneInfo`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const getDashboardCCTVInfo = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/dashboardCCTVInfo`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

