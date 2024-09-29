import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import IoTIcon from '@mui/icons-material/Sensors';
import L from 'leaflet';
import ReactDOMServer from 'react-dom/server';
import { getIotData } from '../api/iot.js';
import 'leaflet-control-geocoder';
import MapSearchControl from '../Utilities/MapSearchControl';
import { Pie } from 'react-chartjs-2';

const get_marker_color = (jam) => {
  if (jam > 3.0) {
    return '#ff0000'; // Red (high jam)
  } else if (jam > 1.5 && jam <= 3.0) {
    return '#ffff00'; // Yellow (medium jam)
  } else {
    return '#00ff00'; // Green (low jam)
  }
};

// Function to create custom IoT icons based on Jam Factor
const createIoTIcon = (jam) => {
  const color = get_marker_color(jam);
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
  const [pieData, setPieData] = useState({ labels: [], datasets: [] });
  // Fetch IoT Data and construct GeoJSON for roads
  useEffect(() => {
    const fetchIotData = async () => {
      try {
        const response = await getIotData();
        setIotData(response);
        if (response.length > 0) {
          setSelectedDevice(response[0]);
        }
        const colorCounts = {
          red: 0,
          yellow: 0,
          green: 0,
        };

        response.forEach((device) => {
          const color = get_marker_color(device['Jam Factor']);
          if (color === '#ff0000') colorCounts.red += 1;
          if (color === '#ffff00') colorCounts.yellow += 1;
          if (color === '#00ff00') colorCounts.green += 1;
        });

        // Prepare data for the Pie chart
        setPieData({
          labels: ['High Jam', 'Medium Jam', 'Low Jam'],
          datasets: [
            {
              label: 'Device Distribution',
              data: [colorCounts.red, colorCounts.yellow, colorCounts.green],
              backgroundColor: ['#ff0000', '#ffff00', '#00ff00'],
            },
          ],
        });
      }
      catch (error) {
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
      <Box sx={{ width: '300px', backgroundColor: '#1a1a3d', color: 'white', p: 0 }}>
        <Box
          sx={{
            bottom: '10px',
            left: '100px',
            height: '200px',
            backgroundColor: '#120639',
            borderRadius: '10px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
          }}
        >
          <Pie
            data={pieData}
            options={{
              maintainAspectRatio: false,
              plugins: {
                datalabels: {
                  display: true,
                  color: '#fff',
                  font: {
                    size: 14,
                    weight: 'bold',
                  },
                  formatter: (value) => {
                    return `${value}`;
                  },
                },
                legend: {
                  display: true,
                  position: 'right',
                  labels: {
                    color: 'white',
                    font: {
                      size: '14',
                      weight: 'bold'
                    }
                  }
                },
              },
            }}
            height={150}
            width={150}
          />
        </Box>
        <Typography variant="h6" align="center" sx={{ py: 2 }}>
          IoT Devices
        </Typography>
        <List sx={{ p: 0, height: '80vh', overflowY: 'auto' }}>
          {iotData.map((device) => (
            <ListItem
              key={device._id}
              onClick={() => handleDeviceClick(device)}
              sx={{
                backgroundColor: selectedDevice && selectedDevice._id === device._id ? '#808080' : 'transparent',
                '&:hover': { backgroundColor: '#383858' },
                color: 'white',
                margin: 0,
                padding: '8px 12px',
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
            zoom={18}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://api.mapbox.com/styles/v1/mapbox/traffic-night-v2/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic293bXlhbWFuY2hpa2FudGkiLCJhIjoiY20xbDY0MGUxMDIwbjJpcHYzNW4xeWhmbCJ9.sngXoz0ReraMHQhF_D0Xmw"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>'
            />
            <MapSearchControl />
            {/* Display IoT markers */}
            {iotData.map((device) => (
              <Marker
                key={device._id}
                position={[device.Latitude, device.Longitude]}
                icon={createIoTIcon(device['Jam Factor'])}
                eventHandlers={{
                  mouseover: (e) => {
                    e.target.openPopup();
                  },
                  mouseout: (e) => {
                    e.target.closePopup();
                  },
                }}
              >
                <Popup>
                  <Typography variant="body1" gutterBottom>
                    IOT Information:
                  </Typography>
                  <Typography variant="caption">
                    Location: {device.Location} <br />
                    Jam Factor: {device['Jam Factor']} <br />
                    Free Flow Speed: {device['Free Flow Speed (m/s)']} mph <br />
                    Current Speed: {device['Current Speed (m/s)']} mph
                  </Typography>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}

        {/* Device Details Section */}
        {/* {selectedDevice && (
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
            <Typography>ID: {selectedDevice._id}</Typography>
            <Typography>Location: {selectedDevice.Location}</Typography>
            <Typography>Latitude: {selectedDevice.Latitude}</Typography>
            <Typography>Longitude: {selectedDevice.Longitude}</Typography>
          </Box>
        )} */}
      </Box>
    </Box>
  );
}
