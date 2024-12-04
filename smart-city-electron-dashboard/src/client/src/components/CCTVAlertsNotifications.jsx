import React, { useRef, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import VideocamIcon from '@mui/icons-material/Videocam';
import CloseIcon from '@mui/icons-material/Close';

// Function to create a custom red camera icon
const createRedCameraIcon = (color = 'red') =>
  new L.divIcon({
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


const alertsData = [
  {
    id: 1,
    type: 'Accident',
    city: 'San Mateo',
    date: '11/27/2024',
    day: 'Wednesday',
    location: 'TV425 -- US-101 : Just South of East Hillsdale Blvd, San Mateo, California',
    coordinates: [37.5403, -122.3047],
  },
  {
    id: 2,
    type: 'Accident',
    city: 'Solano',
    date: '11/16/2024',
    day: 'Saturday',
    location: 'TV976 -- I-80 : AT EOF SUISUN VALLEY RD, Fairfield, California',
    coordinates: [38.2567, -122.0390],
  },
  {
    id: 3,
    type: 'Accident',
    city: 'Contra Costa',
    date: '11/7/2024',
    day: 'Thursday',
    location: 'TVH34 -- I-80 : McBryde Avenue, San Pablo, California',
    coordinates: [37.9633, -122.3455],
  },
  {
    id: 4,
    type: 'Accident',
    city: 'Hayward',
    date: '11/8/2024',
    day: 'Friday',
    location: 'TV708 -- SR-92 : AT JEO INDUSTRIAL BL, California',
    coordinates: [37.6332, -122.10755],
  },
  {
    id: 5,
    type: 'Accident',
    city: 'Dublin',
    date: '11/9/2024',
    day: 'Saturday',
    location: 'TVF02 -- I-580 : I-680, California',
    coordinates: [37.701483, -121.922055],
  },
  {
    id: 6,
    type: 'Accident',
    city: 'Gilroy',
    date: '11/10/2024',
    day: 'Sunday',
    location: 'TVB62 -- US-101 : South Of SR-25, California',
    coordinates: [36.944897, -121.552564],
  },
  {
    id: 7,
    type: 'Accident',
    city: 'Marin',
    date: '11/11/2024',
    day: 'Monday',
    location: 'TVB62 -- US-101 : South Of SR-25, California',
    coordinates: [36.944897, -121.552564],
  },
];

const videoSources = {
    'San Mateo': '/videos/SanMateo.mp4',
    'Solano': '/videos/Solano.mp4',
    'Contra Costa': '/videos/ContraCosta.mp4',
    'Hayward': '/videos/Hayward.mp4',
    'Dublin': '/videos/Dublin.mp4',
    'Gilroy': '/videos/Gilroy.mp4',
    'Marin': '/videos/Marin.mp4',
  };
 
export default function CCTVAlertsNotification() {
  const [mapCenter, setMapCenter] = useState([37.8000, -122.2000]); // Initial map center
  const [zoom, setZoom] = useState(13); // Initial zoom level
  const [openVideoModal, setOpenVideoModal] = useState(false); // Control video modal
  const [videoSrc, setVideoSrc] = useState(''); // Video source for the modal
  const mapRef = useRef(null); // Reference to the map instance
  const markerRefs = useRef({}); // Reference to markers

  const handleMarkerClick = (city) => {
    // Check if the city has a video source
    if (videoSources[city]) {
      setVideoSrc(videoSources[city]);
      setOpenVideoModal(true);
    }
  };

  const handleCloseVideoModal = () => {
    setOpenVideoModal(false);
    setVideoSrc('');
  };

  const handleRowClick = (alert) => {
    const { coordinates, id } = alert;
    setMapCenter(coordinates);
    setZoom(16);

    // Move map programmatically
    if (mapRef.current) {
      mapRef.current.setView(coordinates, 18);
    }

    // Open the popup for the associated marker
    const marker = markerRefs.current[id];
    if (marker) {
      marker.openPopup();
    }
  };

  return (
    <Box sx={{ padding: 2, backgroundColor: '#120639', minHeight: '100vh', color: 'white' }}>
      {/* Table Section */}
      <TableContainer component={Paper} sx={{ backgroundColor: '#1B1B3A', color: 'white' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>ID</TableCell>
              <TableCell sx={{ color: 'white' }}>Type</TableCell>
              <TableCell sx={{ color: 'white' }}>City</TableCell>
              <TableCell sx={{ color: 'white' }}>Date</TableCell>
              <TableCell sx={{ color: 'white' }}>Day</TableCell>
              <TableCell sx={{ color: 'white' }}>Location</TableCell>
              <TableCell sx={{ color: 'white' }}>Coordinates</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {alertsData.map((alert) => (
              <TableRow
                key={alert.id}
                onClick={() => handleRowClick(alert)} // Center the map on row click
                sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#333333' } }}
              >
                <TableCell sx={{ color: 'white' }}>{alert.id}</TableCell>
                <TableCell sx={{ color: 'white' }}>{alert.type}</TableCell>
                <TableCell sx={{ color: 'white' }}>{alert.city}</TableCell>
                <TableCell sx={{ color: 'white' }}>{alert.date}</TableCell>
                <TableCell sx={{ color: 'white' }}>{alert.day}</TableCell>
                <TableCell sx={{ color: 'white' }}>{alert.location}</TableCell>
                <TableCell sx={{ color: 'white' }}>{`(${alert.coordinates[0]}, ${alert.coordinates[1]})`}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Map Section */}
      <Box sx={{ marginTop: 2, height: '400px' }}>
        <MapContainer
          center={mapCenter}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          whenCreated={(mapInstance) => (mapRef.current = mapInstance)} // Assign the map instance to the reference
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {alertsData.map((alert) => (
            <Marker
              key={alert.id}
              position={alert.coordinates}
              icon={createRedCameraIcon()}
              ref={(el) => (markerRefs.current[alert.id] = el)} // Save marker reference
              eventHandlers={{
                click: () => handleMarkerClick(alert.city), // Trigger video popup on marker click
              }}
            >
              <Popup>
                <Typography variant="body1">{alert.type}</Typography>
                <Typography variant="body2">{alert.city}</Typography>
                <Typography variant="body2">{alert.location}</Typography>
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
          <video width="100%" controls autoPlay>
            {videoSrc && <source src={videoSrc} type="video/mp4" />}
            Your browser does not support the video tag.
          </video>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
