
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
  const [mapCenter, setMapCenter] = useState([38.256579, -122.076498]);
  const [zoom, setZoom] = useState(14);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [openVideoModal, setOpenVideoModal] = useState(false);
  const [videoSrc, setVideoSrc] = useState('');
  const mapRef = useRef();
  const markerRefs = useRef({});

  const inputStyle = {
    height: '40px',
    padding: '0',
    color: 'white',
    borderColor: 'white',
    backgroundColor: '#120639', // Match background color
  };
  
  const fieldStyle = {
    '& .MuiInputBase-root': {
      color: 'white',
      backgroundColor: '#120639', // Match background color
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'white',
      },
      '&:hover fieldset': {
        borderColor: 'white',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'white',
      },
      backgroundColor: '#120639', // Match background color for dropdown
    },
    '& .MuiInputLabel-root': {
      color: 'white',
    },
    '& .MuiSelect-icon': {
      color: 'white',
    },
    '& .MuiMenu-paper': {
      backgroundColor: '#120639', // Background color of dropdown menu items
      color: 'white',
    },
  };
  

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

  const getStatusIcon = (inService) => {
    let color;
    switch (inService) {
      case true:
        color = '#00FF00'; // Active (Green)
        break;
      case false:
        color = '#000000'; // Inactive (Black)
        break;
      case 'Incident':
        color = '#FF0000'; // Incident (Red)
        break;
      default:
        color = '#CCCCCC'; // Default (Gray)
    }
  
    return new L.divIcon({
      html: ReactDOMServer.renderToString(
        <VideocamIcon
          style={{
            fontSize: '24px',
            color: color,
            stroke: 'black', // Black outline
            strokeWidth: 1, // Thickness of the outline
          }}
        />
      ),
      className: '',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12],
    });
  };
  

  const handleViewOnMap = (camera) => {
    setSelectedCamera(camera);
    setMapCenter([camera.lat, camera.lng]);
    setZoom(18);

    if (mapRef.current) {
      mapRef.current.setView([camera.lat, camera.lng], 18);
    }

    const marker = markerRefs.current[camera.camera_id];
    if (marker) {
      marker.openPopup();
    }
  };

  const handleMarkerClick = (camera) => {
    // Map specific cities and camera IDs to their respective videos
    if (camera.city === "Alameda") {
      setVideoSrc("/videos/Emeryville.mov");
    } else if (camera.city === "San Francisco") {
      setVideoSrc("/videos/SanFrancisco.mp4");
    } else if (camera.city === "Solano" && camera.camera_id === "C018") {
      setVideoSrc("/videos/Solano.mp4");
    } else if (camera.city === "San Mateo" && camera.camera_id === "C014") {
      setVideoSrc("/videos/SanMateo.mp4");
    } else if (camera.city === "Contra Costa" && camera.camera_id === "C022") {
      setVideoSrc("/videos/ContraCosta.mp4");
    } else {
      setVideoSrc(""); // Default case, no video available
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

        <Grid container spacing={2} sx={{ marginBottom: 2 }}>
          <Grid item xs={4}>
            <FormControl fullWidth size="small" sx={fieldStyle}>
              <InputLabel sx={{ color: '#fff' }}>State</InputLabel>
              <Select
                value={state}
                onChange={(e) => setState(e.target.value)}
                sx={{ color: 'white', backgroundColor: '#121212', ...inputStyle }}
              >
                {states.map((stateValue, index) => (
                  <MenuItem key={index} value={stateValue}>{stateValue}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth size="small" sx={fieldStyle}>
              <InputLabel sx={{ color: '#fff' }}>City</InputLabel>
              <Select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                sx={{ color: 'white', backgroundColor: '#121212', ...inputStyle }}
              >
                {cities.map((cityValue, index) => (
                  <MenuItem key={index} value={cityValue}>{cityValue}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <Button
              onClick={handleSearch}
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                marginTop: 1,
                color: '#fff',
                ':hover': {
                  backgroundColor: 'primary.dark',
                }
              }}
            >
              Search
            </Button>
          </Grid>
        </Grid>

        <Typography variant="h7" sx={{ color: '#fff', marginBottom: 2 }}>Advanced Search</Typography>

        <Grid container spacing={2} sx={{ marginBottom: 2 }}>
          <Grid item xs={4}>
            <FormControl fullWidth size="small" sx={fieldStyle}>
              <InputLabel sx={{ color: '#fff' }}>Zip Code</InputLabel>
              <Select
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                sx={{ color: 'white', backgroundColor: '#121212', ...inputStyle }}
              >
                {zips.map((zipValue, index) => (
                  <MenuItem key={index} value={zipValue}>{zipValue}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth size="small" sx={fieldStyle}>
              <InputLabel sx={{ color: '#fff' }}>Highway</InputLabel>
              <Select
                value={route}
                onChange={(e) => setRoute(e.target.value)}
                sx={{ color: 'white', backgroundColor: '#121212', ...inputStyle }}
              >
                {routes.map((routeValue, index) => (
                  <MenuItem key={index} value={routeValue}>{routeValue}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth size="small" sx={fieldStyle}>
              <InputLabel sx={{ color: '#fff' }}>Cam ID</InputLabel>
              <Select
                value={cameraId}
                onChange={(e) => setCameraId(e.target.value)}
                sx={{ color: 'white', backgroundColor: '#121212', ...inputStyle }}
              >
                {cameras.map((camera) => (
                  <MenuItem key={camera.camera_id} value={camera.camera_id}>{camera.camera_id}</MenuItem>
                ))}
              </Select>
            </FormControl>
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

      <Box sx={{ width: '70%', height: '65vh', position: 'relative', marginTop: '100px' }}>
  {/* Wrapper for Legend and Map */}
  <>
    {/* Legend */}
    <Box
  sx={{
    position: 'absolute',
    top: -50, // Distance from the top
    right: 10, // Distance from the right (outside map container)
    zIndex: 1000, // Ensure it stays above other elements
    backgroundColor: 'rgba(255, 255, 255, 0.95)', // Semi-transparent white
    borderRadius: 12,
    padding: '12px 16px',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)', // Softer shadow
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 2,
  }}
>
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <Box
      sx={{
        width: 16,
        height: 16,
        backgroundColor: '#00FF00', // Green for Active
        borderRadius: '50%',
      }}
    />
    <Typography variant="body2" sx={{ color: '#000', fontWeight: 500 }}>
      Active
    </Typography>
  </Box>

  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <Box
      sx={{
        width: 16,
        height: 16,
        backgroundColor: '#FF0000', // Red for Incident
        borderRadius: '50%',
      }}
    />
    <Typography variant="body2" sx={{ color: '#000', fontWeight: 500 }}>
      Incident
    </Typography>
  </Box>

  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <Box
      sx={{
        width: 16,
        height: 16,
        backgroundColor: '#000000', // Black for Inactive
        borderRadius: '50%',
      }}
    />
    <Typography variant="body2" sx={{ color: '#000', fontWeight: 500 }}>
      Inactive
    </Typography>
  </Box>
</Box>


    {/* Map */}
    <MapContainer
      center={mapCenter}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
      ref={mapRef}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {filteredCameras.map((camera) => (
        <Marker
          key={camera.camera_id}
          position={[camera.lat, camera.lng]}
          icon={getStatusIcon(camera.inService)}
          ref={(el) => (markerRefs.current[camera.camera_id] = el)}
          eventHandlers={{
            click: () => handleMarkerClick(camera),
          }}
        >
          <Popup>
            <Typography variant="body1">Cam ID: {camera.camera_id}</Typography>
            <Typography variant="body2">{camera.locationName}</Typography>
            <Typography variant="body2">Nearby: {camera.nearbyPlace}</Typography>
            <Typography variant="body2">
              Status: {camera.inService === true ? 'Active' : camera.inService === 'Incident' ? 'Incident' : 'Inactive'}
            </Typography>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  </>
</Box>

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
          <video width="100%" controls autoPlay>
            {videoSrc && <source src={videoSrc} type="video/mp4" />}
            Your browser does not support the video tag.
          </video>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
