import axios from 'axios';

const BASE_URL = 'http://your-api-url';

export const loginUser = async (username, password) => {
  try {
    return true;
    const response = await axios.post(`${BASE_URL}/login`, { username, password });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

