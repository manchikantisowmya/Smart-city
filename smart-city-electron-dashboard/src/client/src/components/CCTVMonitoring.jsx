import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, FormControl, InputLabel, Select, MenuItem, Grid, Paper, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import CloseIcon from '@mui/icons-material/Close';
import VideocamIcon from '@mui/icons-material/Videocam'; // Import the filled MUI camera icon
import 'leaflet/dist/leaflet.css';
import { getCameras } from '../api/cctv';
import L from 'leaflet';
import ReactDOMServer from 'react-dom/server';

export default function CCTVMonitoring() {
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [route, setRoute] = useState('');
  const [zip, setZip] = useState('');
  const [cameras, setCameras] = useState([]);
  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [zips, setZips] = useState([]);
  const [filteredCameras, setFilteredCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
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

        setCities([...new Set(cameraData.map(camera => camera.nearby_place))]);
        setCountries([...new Set(cameraData.map(camera => camera.country))]);
        setRoutes([...new Set(cameraData.map(camera => camera.route))]);
        setZips([...new Set(cameraData.map(camera => camera.zip))]);
      } catch (error) {
        console.error('Error fetching cameras:', error);
      }
    };
    fetchCamerasData();
  }, []);

  // Generate icon based on status
  const getStatusIcon = (status) => {
    let color;

    // Set color based on status
    switch (status) {
      case 'Active':
        color = '#00FF00'; // Green for Active
        break;
      case 'Inactive':
        color = '#FF0000'; // Red for Inactive
        break;
      case 'Maintenance':
        color = '#000000'; // Black for Maintenance
        break;
      default:
        color = '#CCCCCC'; // Gray for unknown status
    }

    return new L.divIcon({
      html: ReactDOMServer.renderToString(
        <VideocamIcon style={{ fontSize: '24px', color: color }} />
      ),
      className: '', // Prevents default Leaflet styling
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12],
    });
  };

  // Filter cameras based on selected filters
  const handleSearch = () => {
    const filtered = cameras.filter(camera =>
      (city ? camera.nearby_place === city : true) &&
      (country ? camera.country === country : true) &&
      (route ? camera.route === route : true) &&
      (zip ? camera.zip === zip : true)
    );
    setFilteredCameras(filtered);

    if (filtered.length > 0) {
      const firstCamera = filtered[0];
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
    setOpenVideoModal(true);
  };

  // Handle camera button click to show details
  const handleCameraButtonClick = (camera) => {
    setSelectedCamera(camera);
  };

  // Close video modal
  const handleCloseVideoModal = () => {
    setOpenVideoModal(false);
    setVideoSrc('');
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', flexDirection: 'row', padding: 2 }}>
      {/* Left Panel for Filters */}
      <Box sx={{ width: '30%', paddingRight: 2 }}>
        <Typography variant="h6" sx={{ color: '#fff', marginBottom: 2 }}>Search by Location</Typography>
        
        {/* Country and City Row */}
        <Grid container spacing={2} sx={{ marginBottom: 2 }}>
          <Grid item xs={6}>
            <FormControl fullWidth size="small">
              <InputLabel sx={{ color: '#fff' }}>Country</InputLabel>
              <Select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                sx={{ color: 'white', backgroundColor: '#121212' }}
              >
                {countries.map((countryValue, index) => (
                  <MenuItem key={index} value={countryValue}>{countryValue}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth size="small">
              <InputLabel sx={{ color: '#fff' }}>City</InputLabel>
              <Select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                sx={{ color: 'white', backgroundColor: '#121212' }}
              >
                {cities.map((cityValue, index) => (
                  <MenuItem key={index} value={cityValue}>{cityValue}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Route, Zip, and Search Button Row */}
        <Grid container spacing={2} sx={{ marginBottom: 2 }}>
          <Grid item xs={4}>
            <FormControl fullWidth size="small">
              <InputLabel sx={{ color: '#fff' }}>Route</InputLabel>
              <Select
                value={route}
                onChange={(e) => setRoute(e.target.value)}
                sx={{ color: 'white', backgroundColor: '#121212' }}
              >
                {routes.map((routeValue, index) => (
                  <MenuItem key={index} value={routeValue}>{routeValue}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth size="small">
              <InputLabel sx={{ color: '#fff' }}>Zip Code</InputLabel>
              <Select
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                sx={{ color: 'white', backgroundColor: '#121212' }}
              >
                {zips.map((zipValue, index) => (
                  <MenuItem key={index} value={zipValue}>{zipValue}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <Button onClick={handleSearch} fullWidth sx={{ marginTop: 1, backgroundColor: '#3f51b5', color: '#fff' }}>
              Search
            </Button>
          </Grid>
        </Grid>

        {/* Display buttons for filtered cameras */}
        {filteredCameras.length > 0 && (
          <Box sx={{ marginTop: 2 }}>
            <Typography variant="h6" sx={{ color: '#fff', marginBottom: 1 }}>
              Cameras in {city || country || route || zip}
            </Typography>
            {filteredCameras.map((camera) => (
              <Button
                key={camera.camera_id}
                variant="outlined"
                sx={{ marginBottom: 1, color: '#fff', borderColor: '#fff', width: '100%' }}
                onClick={() => handleCameraButtonClick(camera)}
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
            <Typography><strong>Status:</strong> {selectedCamera.status}</Typography>
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
              icon={getStatusIcon(camera.status)} // Get icon based on status
              eventHandlers={{
                click: () => handleMarkerClick(camera),
              }}
            >
              <Popup>
                {camera.camera_name}<br />
                Nearby: {camera.nearby_place}<br />
                Status: {camera.status}
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
