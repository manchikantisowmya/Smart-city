import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Autocomplete from '@mui/material/Autocomplete';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getCameras, getCameraById } from '../api/cctv.js';

// Define the CCTV icon
const cctvIcon = L.icon({
  iconUrl: '/images/cctv.png',  
  iconSize: [32, 32], 
  iconAnchor: [16, 32], 
  popupAnchor: [0, -32], 
});

export default function CCTVDashboard() {
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openVideoModal, setOpenVideoModal] = useState(false);
  const [videoSrc, setVideoSrc] = useState(""); // State for video source
  const [mapCenter, setMapCenter] = useState([37.7749, -122.4194]); // Default to San Francisco
  const [zoom, setZoom] = useState(12);

  // Fetch all cameras from MongoDB
  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const response = await getCameras();
        setCameras(response);
      } catch (error) {
        console.error('Error fetching cameras', error);
      }
    };
    fetchCameras();
  }, []);

  // Handle camera selection from dropdown
  const handleCameraSelection = async (event, camera) => {
    if (camera) {
      setLoading(true);
      try {
        const response = await getCameraById(camera.camera_id);
        const cameraData = response.data;

        if (cameraData && cameraData.lat && cameraData.lng) {
          setSelectedCamera(cameraData);
          setMapCenter([cameraData.lat, cameraData.lng]);
          setZoom(15); // Zoom in closer to the selected camera
        } else {
          console.error('Invalid camera location data', cameraData);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching camera details', error);
        setLoading(false);
      }
    }
  };

  // Handle marker click to open video modal with specific video
  const handleMarkerClick = (camera) => {
    if (camera.nearby_place === "Emeryville") {
      setVideoSrc("/videos/Emryville.mov");
    } else if (camera.nearby_place === "San Francisco") {
      setVideoSrc("/videos/SanFrancisco.mp4");
    }
    setOpenVideoModal(true);
  };

  const handleCloseVideoModal = () => {
    setOpenVideoModal(false);
    setVideoSrc(""); // Clear video source when modal is closed
  };

  function ChangeMapView({ center, zoom }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh', flexDirection: 'column', padding: 2 }}>
      {/* Top Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
        {/* Left Panel - Dropdown and Camera Details */}
        <Box sx={{ flex: 1, marginRight: 2 }}>
          {/* Search Dropdown */}
          <Autocomplete
            options={cameras}
            getOptionLabel={(option) => option.nearby_place || ''}
            onChange={handleCameraSelection}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Location"
                variant="outlined"
                fullWidth
                sx={{ 
                  backgroundColor: '#121212',  
                  color: 'white',              
                  borderRadius: '4px',         
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.23)',  // Border color to match theme
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',  // Border color on hover
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'white',  // Border color when focused
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.5)',  // Label color
                  },
                  '& .MuiInputBase-input': {
                    color: 'white',  // Text color inside input
                  },
                }}
              />
            )}
            sx={{ 
              backgroundColor: '#121212',  
              color: 'white',             
              width: '100%'                
            }}
            PaperComponent={({ children }) => (
              <Box sx={{ backgroundColor: '#121212', color: 'white', borderRadius: 1, overflow: 'hidden' }}>
                {children}
              </Box>
            )}
          />

          {/* Display Camera Details */}
          <Box sx={{ backgroundColor: '#121212', padding: 2, color: 'white', borderRadius: 1, marginTop: 2 }}>
            <Typography variant="h6" color="primary">
              Camera Details
            </Typography>
            {loading ? (
              <CircularProgress />
            ) : selectedCamera ? (
              <>
                <Typography>ID: {selectedCamera.camera_id}</Typography>
                <Typography>Country: {selectedCamera.country}</Typography>
                <Typography>Route: {selectedCamera.route}</Typography>
                <Typography>Location: {selectedCamera.nearby_place}</Typography>
                <Typography>Camera name: {selectedCamera.camera_name}</Typography>
              </>
            ) : (
              <Typography>Select a location to view details</Typography>
            )}
          </Box>
        </Box>

        {/* Right Panel - Leaflet Map */}
        <Box sx={{ flexGrow: 1, height: '490px', borderRadius: 1, overflow: 'hidden' }}>
          <Typography variant="h6" color="primary" sx={{ marginBottom: 1 }}>
            Live Stream
          </Typography>
          <MapContainer center={mapCenter} zoom={zoom} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url={'https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=ddXHfuJMYFI38m90EfdA'}
              attribution='&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a> & <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            {cameras.map((camera) => (
              <Marker
                key={camera.camera_id}
                position={[camera.lat, camera.lng]}
                icon={cctvIcon}  // Load the CCTV icon from local directory
                eventHandlers={{ click: () => handleMarkerClick(camera) }} // Pass the camera data to handler
              />
            ))}
            <ChangeMapView center={mapCenter} zoom={zoom} />
          </MapContainer>
        </Box>
      </Box>

      {/* Caltrans Live Map */}
      <Box
        sx={{
          flexGrow: 1,
          minHeight: '600px', // Adding minHeight here
          marginTop: 4,
          boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
          zIndex: 0,
          overflow: 'hidden',
        }}
      >
        <Typography variant="h6" color="primary" sx={{ marginBottom: 2 }}>
          Caltrans Live Traffic Map
        </Typography>
        <iframe
          src="https://cwwp2.dot.ca.gov/vm/iframemap.htm"
          style={{
            minHeight: '600px',  // Ensuring the iframe doesn't shrink below this height
            width: '100%',
            border: 'none',
          }}
          title="Caltrans Live Traffic Map"
        />
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
            {videoSrc && <source src={videoSrc} type="video/mp4" />}  {/* Conditionally render the video source */}
            Your browser does not support the video tag.
          </video>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
