import axios from 'axios';
import config from '../config.json'; // Import JSON config

// Get the appropriate BASE_URL based on environment
const env = process.env.NODE_ENV || 'development';
const BASE_URL = config[env].BASE_URL;

export const getCameras = async () => {
  try {
    // return true;
    const response = await axios.get(`${BASE_URL}/cameras`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const getCameraById = async (camera_id) => {
    try {
      // return true;
      const response = await axios.get(`${BASE_URL}/camerabyId/${camera_id}`);
      return response;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };

