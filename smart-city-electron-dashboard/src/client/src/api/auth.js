import axios from 'axios';

const BASE_URL = '/api/auth'; // Since backend and frontend are in the same project

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    throw new Error('Invalid credentials');
  }
};

export const signupUser = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/signup`, userData);
    return response.data;
  } catch (error) {
    throw new Error('Error signing up');
  }
};
