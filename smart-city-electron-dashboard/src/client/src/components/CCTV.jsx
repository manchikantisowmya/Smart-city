import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import 'leaflet/dist/leaflet.css';
import axios from 'axios'; // Use Axios to fetch data from backend

export default function CCTVDashboard() {
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch all cameras from MongoDB
  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/cameras`);
        console.log(response.data);  // Log the fetched data
        setCameras(response.data);
      } catch (error) {
        console.error('Error fetching cameras', error);
      }
    };
    fetchCameras();
  }, []);

  // Handle camera selection and fetch its details
  const handleCameraClick = async (camera_id) => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/cameras/${camera_id}`);
      setSelectedCamera(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching camera details', error);
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Side Panel */}
      <Box sx={{ width: '300px', backgroundColor: '#1a1a3d', color: 'white', overflowY: 'auto', p: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Camera List */}
        <Box>
          <Typography variant="h6" align="center" sx={{ py: 2 }}>
            CCTV Cameras
          </Typography>
          {loading ? (
            <CircularProgress color="inherit" sx={{ display: 'block', margin: 'auto' }} />
          ) : cameras.length === 0 ? (
            <Typography>No cameras found</Typography>
          ) : (
            <List sx={{ p: 0 }}>
              {cameras.map((camera) => (
                <ListItem
                  key={camera.camera_id}
                  button
                  onClick={() => handleCameraClick(camera.camera_id)}
                  sx={{
                    backgroundColor: selectedCamera?.camera_id === camera.camera_id ? '#808080' : 'transparent',
                    '&:hover': { backgroundColor: '#383858' },
                    color: 'white',
                    margin: 0,
                    padding: '8px 12px',
                  }}
                >
                  <ListItemText
                    primary={camera.camera_name}
                    secondary={`Location: ${camera.nearby_place}`}
                    sx={{ color: 'white', '& .MuiListItemText-secondary': { color: 'white' } }}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>

        {/* Camera Details Section */}
        <Box sx={{ backgroundColor: '#121212', padding: 2, color: 'white' }}>
          <Typography variant="h6" color="primary">
            Camera Details
          </Typography>
          {loading ? (
            <CircularProgress />
          ) : selectedCamera ? (
            <>
              <Typography>ID: {selectedCamera.camera_id}</Typography>
              <Typography>Route: {selectedCamera.route}</Typography>
              <Typography>Location: {selectedCamera.nearby_place}</Typography>
              
            </>
          ) : (
            <Typography>Select a camera to view details</Typography>
          )}
        </Box>
      </Box>

      {/* Main Map Area */}
      <Box sx={{ flexGrow: 1, position: 'relative', marginLeft: 0 }}>
        <iframe
          src="https://cwwp2.dot.ca.gov/vm/iframemap.htm"
          style={{ height: '100%', width: '100%', border: 'none' }}
          title="CCTV Map"
        />
      </Box>
    </Box>
  );
}
