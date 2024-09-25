import axios from 'axios';
import config from '../../config.json'; // Import JSON config

// Get the appropriate BASE_URL based on environment
const env = process.env.NODE_ENV || 'development';
const BASE_URL = config[env].BASE_URL;


export const signupUser = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/signup`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const fetchSignUpRoles =async()=>{
  try {
    const response = await axios.get(`${BASE_URL}/fetchSignUpRoles`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}