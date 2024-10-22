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

export const getDroneStations = async () => {
  try {
    // return true;
    const response = await axios.get(`${BASE_URL}/dronesStations`);
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

export const getDroneStatistics = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/droneStatistics`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const getHighwaysWithExits = async () => {
  try {
    // return true;
    const response = await axios.get(`${BASE_URL}/highwaysWithExits`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

// Add Drone from DroneManagement
export const addDrone = async (droneData) => {
  try {
    const response = await axios.post(`${BASE_URL}/drones`, droneData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

// Delete Drone from DroneManagement
export const deleteDrone = async (drone_id) => {
  try {
    console.log(drone_id); 
    const response = await axios.delete(`${BASE_URL}/drones/${drone_id}`); 
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
  
export const getAllDroneMissions = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/allDroneMissions`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }

