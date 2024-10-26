import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, FormControl, InputLabel, Select, MenuItem, Grid, Paper, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import CloseIcon from '@mui/icons-material/Close';
import 'leaflet/dist/leaflet.css';
import { getCameras } from '../api/cctv'; 
import L from 'leaflet';

// Define camera icon for the map
const cameraIcon = L.icon({
  iconUrl: `${process.env.PUBLIC_URL}/images/cctv.png`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export default function CCTVMonitoring() {
  const [city, setCity] = useState('');
  const [cameras, setCameras] = useState([]);
  const [cities, setCities] = useState([]);
  const [filteredCameras, setFilteredCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null); // For displaying selected camera details
  const [mapCenter, setMapCenter] = useState([37.7749, -122.4194]);
  const [zoom, setZoom] = useState(12);

  // Video modal states
  const [openVideoModal, setOpenVideoModal] = useState(false);
  const [videoSrc, setVideoSrc] = useState('');

  // Fetch camera data from the backend
  useEffect(() => {
    const fetchCamerasData = async () => {
      try {
        const cameraData = await getCameras();
        setCameras(cameraData);

        const uniqueCities = [...new Set(cameraData.map(camera => camera.nearby_place))];
        setCities(uniqueCities);
      } catch (error) {
        console.error('Error fetching cameras:', error);
      }
    };
    fetchCamerasData();
  }, []);

  // Filter cameras by city and set map center
  const handleSearch = () => {
    const filteredCamerasList = cameras.filter(camera => camera.nearby_place === city);
    setFilteredCameras(filteredCamerasList);

    if (filteredCamerasList.length > 0) {
      const firstCamera = filteredCamerasList[0];
      setMapCenter([firstCamera.lat, firstCamera.lng]);
      setZoom(14);
    }
  };

  // Handle marker click to open video modal
  const handleMarkerClick = (camera) => {
    if (camera.nearby_place === "Emeryville") {
      setVideoSrc("/videos/Emeryville.mov");
    } else if (camera.nearby_place === "San Francisco") {
      setVideoSrc("/videos/SanFrancisco.mp4");
    } else {
      setVideoSrc(""); // No video available for other places
    }
    setOpenVideoModal(true); // Open the video modal
  };

  // Handle camera button click to show details
  const handleCameraButtonClick = (camera) => {
    setSelectedCamera(camera); // Set the selected camera to display its details
  };

  // Close video modal
  const handleCloseVideoModal = () => {
    setOpenVideoModal(false);
    setVideoSrc(''); // Clear video source when modal is closed
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', flexDirection: 'row', padding: 2 }}>
      {/* Left Panel for Search */}
      <Box sx={{ width: '30%', paddingRight: 2 }}>
        <Typography variant="h6" sx={{ color: '#fff', marginBottom: 2 }}>
          Search by Location
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormControl fullWidth size="small">
              <InputLabel sx={{ color: '#fff' }}>City</InputLabel>
              <Select
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setFilteredCameras([]);
                  setSelectedCamera(null); // Clear selected camera details
                }}
                sx={{ color: 'white', backgroundColor: '#121212' }}
              >
                {cities.map((cityValue, index) => (
                  <MenuItem key={index} value={cityValue}>
                    {cityValue}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Button onClick={handleSearch} sx={{ marginTop: 2 }}>Search</Button>

        {/* Display buttons for cameras after search */}
        {filteredCameras.length > 0 && (
          <Box sx={{ marginTop: 2 }}>
            <Typography variant="h6" sx={{ color: '#fff', marginBottom: 1 }}>
              Cameras in {city}
            </Typography>
            {filteredCameras.map((camera) => (
              <Button
                key={camera.camera_id}
                variant="outlined"
                sx={{ marginBottom: 1, color: '#fff', borderColor: '#fff', width: '100%' }}
                onClick={() => handleCameraButtonClick(camera)} // Show camera details when button clicked
              >
                Camera {camera.camera_id}
              </Button>
            ))}
          </Box>
        )}

        {/* Display selected camera details */}
        {selectedCamera && (
          <Paper sx={{ padding: 2, marginTop: 2, backgroundColor: '#121212', color: '#fff' }}>
            <Typography variant="h6">Camera Details</Typography>
            <Typography><strong>Camera ID:</strong> {selectedCamera.camera_id}</Typography>
            <Typography><strong>Location:</strong> {selectedCamera.camera_name}</Typography>
            <Typography><strong>Nearby:</strong> {selectedCamera.nearby_place}</Typography>
            <Typography><strong>Route:</strong> {selectedCamera.route}</Typography>
            <Typography><strong>Zip Code:</strong> {selectedCamera.zip}</Typography>
          </Paper>
        )}
      </Box>

      {/* Map Section */}
      <Box sx={{ width: '70%' }}>
        <MapContainer center={mapCenter} zoom={zoom} style={{ height: '75vh', width: '100%' }} key={mapCenter.toString()}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {filteredCameras.map((camera) => (
            <Marker
              key={camera.camera_id}
              position={[camera.lat, camera.lng]}
              icon={cameraIcon}
              eventHandlers={{
                click: () => handleMarkerClick(camera), // Trigger video modal on marker click
              }}
            >
              <Popup>
                {camera.camera_name}<br />
                Nearby: {camera.nearby_place}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Box>

      {/* Video Modal */}
      <Dialog open={openVideoModal} onClose={handleCloseVideoModal} maxWidth="md" fullWidth>
        <DialogTitle>
          Camera Video
          <IconButton
            aria-label="close"
            onClick={handleCloseVideoModal}
            sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <video width="100%" controls>
            {videoSrc && <source src={videoSrc} type="video/mp4" />}
            Your browser does not support the video tag.
          </video>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
