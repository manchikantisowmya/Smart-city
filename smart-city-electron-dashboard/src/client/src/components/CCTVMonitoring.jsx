import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, FormControl, InputLabel, Select, MenuItem, Grid, Card, CardContent, Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import VideocamIcon from '@mui/icons-material/Videocam';
import CloseIcon from '@mui/icons-material/Close';
import 'leaflet/dist/leaflet.css';
import { getCameras } from '../api/cctv';
import L from 'leaflet';
import ReactDOMServer from 'react-dom/server';

export default function CCTVMonitoring() {
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [route, setRoute] = useState('');
  const [zip, setZip] = useState('');
  const [cameraId, setCameraId] = useState('');
  const [cameras, setCameras] = useState([]);
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [zips, setZips] = useState([]);
  const [filteredCameras, setFilteredCameras] = useState([]);
  const [mapCenter, setMapCenter] = useState([37.7749, -122.4194]);
  const [zoom, setZoom] = useState(12);
  const [selectedCamera, setSelectedCamera] = useState(null);

  const [openVideoModal, setOpenVideoModal] = useState(false);
  const [videoSrc, setVideoSrc] = useState('');

  const mapRef = useRef();
  const markerRefs = useRef({}); // Store references to each marker

  useEffect(() => {
    const fetchCamerasData = async () => {
      try {
        const cameraData = await getCameras();
        setCameras(cameraData);
        setFilteredCameras(cameraData);

        setCities([...new Set(cameraData.map(camera => camera.nearbyPlace))]);
        setStates([...new Set(cameraData.map(camera => camera.state))]);
        setRoutes([...new Set(cameraData.map(camera => camera.route))]);
        setZips([...new Set(cameraData.map(camera => camera.zip))]);
      } catch (error) {
        console.error('Error fetching cameras:', error);
      }
    };
    fetchCamerasData();
  }, []);

  const getStatusIcon = (inService) => {
    let color;
    switch (inService) {
      case true:
        color = '#00FF00'; // Active
        break;
      case false:
        color = '#FF0000'; // Inactive
        break;
      default:
        color = '#CCCCCC';
    }

    return new L.divIcon({
      html: ReactDOMServer.renderToString(
        <VideocamIcon style={{ fontSize: '24px', color: color }} />
      ),
      className: '',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12],
    });
  };

  const handleSearch = () => {
    const filtered = cameras.filter(camera =>
      (city ? camera.nearbyPlace === city : true) &&
      (state ? camera.state === state : true) &&
      (route ? camera.route === route : true) &&
      (zip ? camera.zip === zip : true) &&
      (cameraId ? camera.camera_id === cameraId : true)
    );
    setFilteredCameras(filtered);

    if (filtered.length > 0) {
      const firstCamera = filtered[0];
      setMapCenter([firstCamera.lat, firstCamera.lng]);
      setZoom(16);

      if (mapRef.current) {
        mapRef.current.setView([firstCamera.lat, firstCamera.lng], 16);
      }
    }
  };

  const handleViewOnMap = (camera) => {
    setSelectedCamera(camera);
    setMapCenter([camera.lat, camera.lng]);
    setZoom(18);

    if (mapRef.current) {
      mapRef.current.setView([camera.lat, camera.lng], 18);
    }

    // Open the popup for the selected camera
    const marker = markerRefs.current[camera.camera_id];
    if (marker) {
      marker.openPopup();
    }
  };

  const handleMarkerClick = (camera) => {
    if (camera.city === "Alameda") {
      setVideoSrc("/videos/Emeryville.mov");
    } else if (camera.city === "San Francisco") {
      setVideoSrc("/videos/SanFrancisco.mp4");
    } else {
      setVideoSrc("");
    }
    setOpenVideoModal(true);
  };

  const handleCloseVideoModal = () => {
    setOpenVideoModal(false);
    setVideoSrc('');
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', flexDirection: 'row', padding: 2 }}>
      <Box sx={{ width: '30%', paddingRight: 2 }}>
        <Typography variant="h6" sx={{ color: '#fff', marginBottom: 2 }}>Search by Location</Typography>

        {/* State, City, and Cam ID Row */}
        <Grid container spacing={2} sx={{ marginBottom: 2 }}>
          <Grid item xs={4}>
            <FormControl fullWidth size="small">
              <InputLabel sx={{ color: '#fff' }}>State</InputLabel>
              <Select
                value={state}
                onChange={(e) => setState(e.target.value)}
                sx={{ color: 'white', backgroundColor: '#121212' }}
              >
                {states.map((stateValue, index) => (
                  <MenuItem key={index} value={stateValue}>{stateValue}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
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
          <Grid item xs={4}>
            <FormControl fullWidth size="small">
              <InputLabel sx={{ color: '#fff' }}>Cam ID</InputLabel>
              <Select
                value={cameraId}
                onChange={(e) => setCameraId(e.target.value)}
                sx={{ color: 'white', backgroundColor: '#121212' }}
              >
                {cameras.map((camera) => (
                  <MenuItem key={camera.camera_id} value={camera.camera_id}>{camera.camera_id}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Typography variant="h6" sx={{ color: '#fff', marginBottom: 2 }}>Advanced Search</Typography>

        {/* Zip Code, Highway, and Search Button Row */}
        <Grid container spacing={2} sx={{ marginBottom: 2 }}>
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
            <FormControl fullWidth size="small">
              <InputLabel sx={{ color: '#fff' }}>Highway</InputLabel>
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
            <Button
              onClick={handleSearch}
              variant="contained"
              color="primary" // Uses the theme's primary color
              fullWidth
              sx={{
                marginTop: 1,
                color: '#fff',
                ':hover': {
                  backgroundColor: 'primary.dark', // Applies the primary dark color on hover
                }
              }}
            >
              Search
            </Button>
          </Grid>
        </Grid>

        <Box sx={{ backgroundColor: '#120639', color: 'white', height: '65vh', overflowY: 'auto', marginTop: 2 }}>
          {filteredCameras.map((camera, index) => (
            <Card key={index} sx={{ backgroundColor: '#1a1a3d', marginBottom: '5px', color: 'white' }}>
              <CardContent>
                <Typography variant="body1">Camera ID: {camera.camera_id}</Typography>
                <Typography variant="body2">City: {camera.city}</Typography>
                <Typography variant="body2">Location: {camera.locationName}</Typography>
                <Typography variant="body2">Nearby: {camera.nearbyPlace}</Typography>
                <Typography variant="body2">Status: {camera.inService ? 'Active' : 'Inactive'}</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ marginTop: '10px' }}
                  onClick={() => handleViewOnMap(camera)}
                >
                  View on Map
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      {/* Map Section with Legend */}
      <Box sx={{ width: '70%', position: 'relative' }}>
        <Box sx={{ position: 'absolute', top: 10, right: 10, backgroundColor: '#fff', padding: 1, borderRadius: 1, zIndex: 1000 }}>
          <Typography variant="body2"><span style={{ color: '#00FF00' }}>■</span> Active</Typography>
          <Typography variant="body2"><span style={{ color: '#FF0000' }}>■</span> Inactive</Typography>
        </Box>
        <MapContainer center={mapCenter} zoom={zoom} style={{ height: '75vh', width: '100%' }} ref={mapRef}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {filteredCameras.map((camera) => (
            <Marker
              key={camera.camera_id}
              position={[camera.lat, camera.lng]}
              icon={getStatusIcon(camera.inService)}
              ref={(el) => markerRefs.current[camera.camera_id] = el} // Store ref for each marker
              eventHandlers={{
                click: () => handleMarkerClick(camera),
              }}
            >
              <Popup>
                <Typography variant="body1">{camera.locationName}</Typography>
                <Typography variant="body2">Nearby: {camera.nearbyPlace}</Typography>
                <Typography variant="body2">Direction: {camera.direction}</Typography>
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
