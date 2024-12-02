import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, List, ListItem, ListItemText } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getIotData } from '../api/iot.js';
import 'leaflet-control-geocoder';
import MapSearchControl from '../Utilities/MapSearchControl';
import { Pie } from 'react-chartjs-2';
import Search from './Search';
import { getDrones, getDroneStatistics, getDroneStations, getHighwaysWithExits } from '../api/drone.js'; // Change with your source
import { get_marker_color, createIoTIcon } from '../Utilities/MapUtilities.js';

// const handleSearch = (searchFields) => {
//   const filtered = droneStations.filter((station) => {
//       return (
//           (!searchFields.state || station.State === searchFields.state) &&
//           (!searchFields.city || station.City.trim() === searchFields.city) &&
//           (!searchFields.droneId || station.drone_id === searchFields.droneId) &&
//           (!searchFields.zip || station.ZipCode?.toString() === searchFields.zip)
//           // (!searchFields.highway || station.highway === searchFields.highway) &&
//           // (!searchFields.exitNo || station.exitNo === searchFields.exitNo)
//       );
//   });
//   setFilteredDroneStations(filtered);
// };

export default function IoTSection() {
  const [iotData, setIotData] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [pieData, setPieData] = useState({ labels: [], datasets: [] });
  const [highwaysWithExits, setHighwaysWithExits] = useState(null); // change with source
  const [zipCodes, setZipCodes] = useState([]); // Change with source 


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
              backgroundColor: ['#ff0000', '#ffff00', '#4caf50'],
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

  //   return (
  //     <Grid item xs={12} container>
  //                 <Grid item xs={6}>
  //                     <Search onSearch={handleSearch} cities={cities} drones={drones} states={states} zipCodes={zipCodes} highways={highwaysWithExits} />
  //                 </Grid>
  //     </Grid>
  //     <Box sx={{ display: 'flex', height: '100vh' }}>
  //       {/* Side Panel */}
  //       <Box sx={{ width: '300px', backgroundColor: '#1a1a3d', color: 'white', p: 0 }}>
  //         <Box
  //           sx={{
  //             bottom: '10px',
  //             left: '100px',
  //             height: '200px',
  //             backgroundColor: '#120639',
  //             borderRadius: '10px',
  //             boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
  //             zIndex: 1000,
  //           }}
  //         >
  //           <Pie
  //             data={pieData}
  //             options={{
  //               maintainAspectRatio: false,
  //               plugins: {
  //                 datalabels: {
  //                   display: true,
  //                   color: '#fff',
  //                   font: {
  //                     size: 14,
  //                     weight: 'bold',
  //                   },
  //                   formatter: (value) => {
  //                     return `${value}`;
  //                   },
  //                 },
  //                 legend: {
  //                   display: true,
  //                   position: 'right',
  //                   labels: {
  //                     color: 'white',
  //                     font: {
  //                       size: '14',
  //                       weight: 'bold'
  //                     }
  //                   }
  //                 },
  //               },
  //             }}
  //             height={150}
  //             width={150}
  //           />
  //         </Box>
  //         <Typography variant="h6" align="center" sx={{ py: 2 }}>
  //           IoT Devices
  //         </Typography>
  //         <List sx={{ p: 0, height: '80vh', overflowY: 'auto' }}>
  //           {iotData.map((device) => (
  //             <ListItem
  //               key={device._id}
  //               onClick={() => handleDeviceClick(device)}
  //               sx={{
  //                 backgroundColor: selectedDevice && selectedDevice._id === device._id ? '#808080' : 'transparent',
  //                 '&:hover': { backgroundColor: '#383858' },
  //                 color: 'white',
  //                 margin: 0,
  //                 padding: '8px 12px',
  //               }}
  //             >
  //               <ListItemText
  //                 primary={`IOT ${device.Location}`}
  //                 secondary={`ID: ${device._id}`}
  //                 sx={{ color: 'white', '& .MuiListItemText-secondary': { color: 'white' } }} // Secondary text in white
  //               />
  //             </ListItem>
  //           ))}
  //         </List>
  //       </Box>

  //       {/* Main Map Area */}
  //       <Box sx={{ flexGrow: 1, position: 'relative' }}>
  //         {selectedDevice && (
  //           <MapContainer
  //             center={[selectedDevice.Latitude, selectedDevice.Longitude]}
  //             zoom={18}
  //             scrollWheelZoom={true}
  //             style={{ height: '100%', width: '100%' }}
  //           >
  //             <TileLayer
  //               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
  //               attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>'
  //             />
  //             {/* url ="https://api.mapbox.com/styles/v1/mapbox/traffic-night-v2/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic293bXlhbWFuY2hpa2FudGkiLCJhIjoiY20xbDY0MGUxMDIwbjJpcHYzNW4xeWhmbCJ9.sngXoz0ReraMHQhF_D0Xmw" */}

  //             <MapSearchControl />
  //             {/* Display IoT markers */}
  //             {iotData.map((device) => (
  //               <Marker
  //                 key={device._id}
  //                 position={[device.Latitude, device.Longitude]}
  //                 icon={createIoTIcon(device['Jam Factor'])}
  //                 eventHandlers={{
  //                   mouseover: (e) => {
  //                     e.target.openPopup();
  //                   },
  //                   mouseout: (e) => {
  //                     e.target.closePopup();
  //                   },
  //                 }}
  //               >
  //                 <Popup>
  //                   <Typography variant="body1" gutterBottom>
  //                     IOT Information:
  //                   </Typography>
  //                   <Typography variant="caption">
  //                     Location: {device.Location} <br />
  //                     Jam Factor: {device['Jam Factor']} <br />
  //                     Free Flow Speed: {device['Free Flow Speed (m/s)']} mph <br />
  //                     Current Speed: {device['Current Speed (m/s)']} mph
  //                   </Typography>
  //                 </Popup>
  //               </Marker>
  //             ))}
  //           </MapContainer>
  //         )}

  //         {/* Device Details Section */}
  //         {/* {selectedDevice && (
  //           <Box
  //             sx={{
  //               position: 'absolute',
  //               bottom: 20,
  //               left: 20,
  //               backgroundColor: 'white',
  //               padding: 2,
  //               width: '200px',
  //               borderRadius: 1,
  //             }}
  //           >
  //             <Typography variant="h6" color="primary">
  //               Device Details
  //             </Typography>
  //             <Typography>ID: {selectedDevice._id}</Typography>
  //             <Typography>Location: {selectedDevice.Location}</Typography>
  //             <Typography>Latitude: {selectedDevice.Latitude}</Typography>
  //             <Typography>Longitude: {selectedDevice.Longitude}</Typography>
  //           </Box>
  //         )} */}
  //       </Box>
  //     </Box>
  //   );
  // }
  return (
    <>
      <Grid container spacing={2}>
        {/* Top Section with Search and Pie Chart */}
        <Grid item xs={12} md={6}>
          <Search
            // onSearch={handleSearch}
            // cities={cities}
            // drones={drones}
            // states={states}
            zipCodes={zipCodes}
            highways={highwaysWithExits}
          />
        </Grid>
        <Grid item xs={3}>
          <Box
            sx={{
              marginTop: '0px',
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
                    formatter: (value) => `${value}`,
                  },
                  legend: {
                    display: true,
                    position: 'right',
                    labels: {
                      color: 'white',
                      font: {
                        size: 14,
                        weight: 'bold',
                      },
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
              // backgroundColor: '#1a1a3d',
              color: 'white',
              height: '65vh',
              overflowY: 'auto',
              marginBottom: '5px',
              padding: '16px', // Added padding for overall spacing
            }}
          >
            <List
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px', // Space between list items
              }}
            >
              {iotData.map((device) => (
                <Box
                  key={device._id}
                  sx={{
                    backgroundColor: '#1a1a3d', // Slightly lighter background for cards
                    borderRadius: '8px', // Rounded corners
                    padding: '16px',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)', // Shadow for a card-like effect
                  }}
                >
                  <Typography variant="h7" sx={{ marginBottom: '8px' }}>
                    IOT Station: {device.Location}
                  </Typography>
                  <Typography variant="body2" sx={{ marginBottom: '16px' }}>
                    Device ID: {device._id}
                  </Typography>
                </Box>
              ))}
            </List>
          </Box>
        </Grid>

        {/* Bottom Section with List and Map
      <Grid item xs={3}>
  <Box
    sx={{
      backgroundColor: '#1a1a3d',
      color: 'white',
      height: '65vh',
      overflowY: 'auto',
      marginBottom: '5px',
    }}
  >
    <List
      sx={{
        height: '200px',
        backgroundColor: '#1a1a3d',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px', // Adds consistent spacing between items
      }}
    >
      {iotData.map((device) => (
        <ListItem
          key={device._id}
          onClick={() => handleDeviceClick(device)}
          sx={{
            backgroundColor: '#1a1a3d',
            '&:hover': { backgroundColor: '#383858' },
            color: 'white',
            padding: '8px 12px',
          }}
        >
          <ListItemText
            primary={`IOT ${device.Location}`}
            secondary={`ID: ${device._id}`}
            sx={{
              color: 'white',
              backgroundColor: '#1a1a3d',
              '& .MuiListItemText-secondary': { color: 'white' },
            }}
          />
        </ListItem>
      ))}
    </List>
  </Box>
</Grid> */}
        <Grid item xs={9}>
          {/* Map 1*/}
          <MapContainer
            center={[37.7749, -122.4194]} // You can adjust this based on your data
            zoom={13}
            style={{ height: '65vh', width: '100%' }} // Consolidated height
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
                eventHandlers={{
                  mouseover: (e) => e.target.openPopup(),
                  mouseout: (e) => e.target.closePopup(),
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
        </Grid>
      </Grid>
    </>
  );
}