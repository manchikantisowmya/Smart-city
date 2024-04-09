import axios from 'axios';

const BASE_URL = 'http://your-api-url';


export const signupUser = async (userData) => {
  try {
    return true;
    const response = await axios.post(`${BASE_URL}/signup`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
