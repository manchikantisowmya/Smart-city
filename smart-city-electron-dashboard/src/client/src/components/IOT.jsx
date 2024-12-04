import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, List, ListItem, ListItemText } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getIotData } from '../api/iot.js';
import axios from 'axios';
import ReactDOMServer from 'react-dom/server';
import IoTIcon from '@mui/icons-material/Sensors';
import { Pie } from 'react-chartjs-2';
import Search from './Search';
import { get_marker_color, createIoTIcon } from '../Utilities/MapUtilities.js';
import MapSearchControl from '../Utilities/MapSearchControl';

// Fetch routes using Mapbox Directions API
const fetchRoute = async (start, end) => {
  const accessToken = 'pk.eyJ1IjoieXVrdGFtZWh0YSIsImEiOiJjbTQ2OXZ5YmwwdXN6MmtvYjltNXRnejNjIn0.sS8PMQWU4LNef-c6C6s49w'; // Replace with your Mapbox token
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start.lng},${start.lat};${end.lng},${end.lat}?geometries=geojson&access_token=${accessToken}`;
  const response = await axios.get(url);
  return response.data.routes[0].geometry.coordinates; // Array of coordinates for the route
};

export default function IoTSection() {
  const [iotData, setIotData] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [pieData, setPieData] = useState({ labels: [], datasets: [] });
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [zipCodes, setZipCodes] = useState([]);

  useEffect(() => {
    const fetchIotData = async () => {
      try {
        const response = await getIotData();
        setIotData(response);

        if (response.length > 0) {
          setSelectedDevice(response[0]);
        }

        const distinctCities = response.reduce((acc, station) => {
          if (!acc.includes(station.city.trim())) {
            acc.push(station.city.trim());
          }
          return acc;
        }, []);

        const distinctStates = response.reduce((acc, station) => {
          if (!acc.includes(station.State.trim())) {
            acc.push(station.State.trim());
          }
          return acc;
        }, []);
        const distinctZipCodes = response.reduce((acc, station) => {
          const zip = station.Zipcode?.toString();
          if (zip && !acc.includes(zip)) {
            acc.push(zip);
          }
          return acc;
        }, []);

        setCities(distinctCities);
        setStates(distinctStates);
        setZipCodes(distinctZipCodes);

        // Prepare Pie Chart Data
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
        setPieData({
          labels: ['High Jam', 'Medium Jam', 'Low Jam'],
          datasets: [
            {
              label: 'Device Distribution',
              data: [colorCounts.red, colorCounts.yellow, colorCounts.green],
              backgroundColor: ['#ff0000', '#ffff00', '#4caf50'],
            },
          ],
        });

        // Fetch routes between consecutive IoT devices
        const newRoutes = [];
        for (let i = 0; i < response.length - 1; i++) {
          const start = { lat: response[i].Latitude, lng: response[i].Longitude };
          const end = { lat: response[i + 1].Latitude, lng: response[i + 1].Longitude };
          const route = await fetchRoute(start, end);
          newRoutes.push({
            coordinates: route,
            jamFactor: response[i + 1]['Jam Factor'],
          });
        }
        setRoutes(newRoutes);
      } catch (error) {
        console.error('Error fetching IoT Data:', error);
      }
    };
    fetchIotData();
  }, []);

  const handleDeviceClick = (device) => {
    setSelectedDevice(device);
  };

  const handleSearch = (searchFields) => {
    const filtered = iotData.filter((station) => {
      return (
        (!searchFields.state || station.State === searchFields.state) &&
        (!searchFields.city || station.city.trim() === searchFields.city) &&
        (!searchFields.zip || station.Zipcode?.toString() === searchFields.zip)
      );
    });
    setIotData(filtered);
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Search onSearch={handleSearch} cities={cities} states={states} zipCodes={zipCodes} />
        </Grid>
        <Grid item xs={3}>
          <Box
            sx={{
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
                    font: { size: 14, weight: 'bold' },
                    formatter: (value) => `${value}`,
                  },
                  legend: {
                    display: true,
                    position: 'right',
                    labels: {
                      color: 'white',
                      font: { size: 14, weight: 'bold' },
                    },
                  },
                },
              }}
              height={150}
              width={150}
            />
          </Box>
        </Grid>
      </Grid>

      <Grid item xs={12} container>
        <Grid item xs={3}>
          <Box
            sx={{
              color: 'white',
              height: '65vh',
              overflowY: 'auto',
              marginBottom: '5px',
              padding: '16px',
            }}
          >
            <List>
              {iotData.map((device) => (
                <ListItem
                  key={device._id}
                  onClick={() => handleDeviceClick(device)}
                  sx={{
                    backgroundColor: selectedDevice && selectedDevice._id === device._id ? '#808080' : 'transparent',
                    '&:hover': { backgroundColor: '#383858' },
                    color: 'white',
                  }}
                >
                  <ListItemText
                    primary={`IOT ${device.Location}`}
                    secondary={`ID: ${device._id}`}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Grid>
        <Grid item xs={9}>
          <MapContainer
            center={[37.7749, -122.4194]}
            zoom={40}
            style={{ height: '65vh', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapSearchControl />
            {iotData.map((device) => (
              <Marker
                key={device._id}
                position={[device.Latitude, device.Longitude]}
                icon={createIoTIcon(device['Jam Factor'])}
              >
                <Popup>
                  <Typography>
                    Location: {device.Location} <br />
                    Jam Factor: {device['Jam Factor']} <br />
                    Free Flow Speed: {device['Free Flow Speed (m/s)']} mph <br />
                    Current Speed: {device['Current Speed (m/s)']} mph
                  </Typography>
                </Popup>
              </Marker>
            ))}
            {routes.map((route, index) => (
              <Polyline
                key={index}
                positions={route.coordinates.map((coord) => [coord[1], coord[0]])}
                color={get_marker_color(route.jamFactor)}
                weight={1}
              />
            ))}
          </MapContainer>
        </Grid>
      </Grid>
    </>
  );
}
