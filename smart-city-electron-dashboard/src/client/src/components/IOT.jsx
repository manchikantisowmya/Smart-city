import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import IoTIcon from '@mui/icons-material/Sensors';
import L from 'leaflet';
import ReactDOMServer from 'react-dom/server';
import { getIotData } from '../api/iot.js';

const get_marker_color = (speed, flow) => {
  if (speed > 25 && flow < 500) {
    return 'green'; // Good condition
  } else if (10 <= speed <= 25 || (500 <= flow && flow < 1000)) {
    return 'orange'; // Average condition
  } else {
    return 'red'; // Congested condition
  }
};


const createIoTIcon = (speed, flow) => {
  const color = get_marker_color(speed, flow);
  const iconHTML = ReactDOMServer.renderToString(<IoTIcon style={{ color: color, fontSize: '2rem' }} />);

  return L.divIcon({
    html: iconHTML,
    className: 'custom-iot-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
};


export default function IoTSection() {
  const [iotData, setIotData] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);

  // Fetch IoT Data
  useEffect(() => {
    const fetchIotData = async () => {
      try {
        const response = await getIotData();
        setIotData(response);
        if (response.length > 0) {
          setSelectedDevice(response[0]); // Set the first device as default
        }
      } catch (error) {
        console.error('Error fetching IoT Data:', error);
      }
    };
    fetchIotData();
  }, []);

  // Handle device selection from the list
  const handleDeviceClick = (device) => {
    setSelectedDevice(device);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Side Panel */}
      <Box sx={{ width: '240px', backgroundColor: '#1a1a3d', color: 'white', overflowY: 'auto', p: 0 }}>
        <Typography variant="h6" align="center" sx={{ py: 2 }}>
          IoT Devices
        </Typography>
        <List sx={{ p: 0 }}>
          {iotData.map((device) => (
            <ListItem
              key={device._id}
              onClick={() => handleDeviceClick(device)}
              sx={{
                backgroundColor: selectedDevice && selectedDevice.id === device.id ? '#808080' : 'transparent',
                '&:hover': { backgroundColor: '#383858' },
                color: 'white', // Text color white
                margin: 0, // Remove margin
                padding: '8px 12px', // Adjust padding for compact view
              }}
            >
              <ListItemText
                primary={`IOT ${device.Location}`}
                secondary={`ID: ${device._id}`}
                sx={{ color: 'white', '& .MuiListItemText-secondary': { color: 'white' } }} // Secondary text in white
              />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Main Map Area */}
      <Box sx={{ flexGrow: 1, position: 'relative' }}>
        {selectedDevice && (
          <MapContainer
            center={[selectedDevice.Latitude, selectedDevice.Longitude]}
            zoom={12}
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {iotData.map((device) => (
              <Marker
                key={device.id}
                position={[device.Latitude, device.Longitude]}
                icon={createIoTIcon(device["Current Speed"], device["Free Flow Speed"])}  // Use custom IoT marker with Material UI icon
              >
                <Popup>
                  <Typography>{device.id}</Typography>
                  <Typography variant="caption">Location: {device.Location}</Typography>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}

        {/* Device Details Section */}
        {selectedDevice && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 20,
              left: 20,
              backgroundColor: 'white',
              padding: 2,
              width: '200px',
              borderRadius: 1,
            }}
          >
            <Typography variant="h6" color="primary">
              Device Details
            </Typography>
            <Typography>ID: {selectedDevice.id}</Typography>
            <Typography>Location: {selectedDevice.Location}</Typography>
            <Typography>Latitude: {selectedDevice.Latitude}</Typography>
            <Typography>Longitude: {selectedDevice.Longitude}</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
