import React, { useState, useEffect, useRef } from 'react';
import { Box, Grid, Card, CardContent, Typography, AppBar, Tab, Tabs } from '@mui/material';
import { Pie, Line, Bar } from 'react-chartjs-2';
import { getDashboardDroneInfo, getDashboardCCTVInfo } from '../api/dashboard/dashboard.js';
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import { FlightTakeoff, Person, Warning } from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MapSearchControl from '../Utilities/MapSearchControl';
import { createDroneIcon, getStatusIcon, get_marker_color, createIoTIcon, legend, handleCCTVMarkerClick } from '../Utilities/MapUtilities.js';
import { getDroneStatistics, getDroneStations, getHighwaysWithExits } from '../api/drone.js';
import Missions from './Missions.jsx';
import { getIotData } from '../api/iot.js';
import { getCameras } from '../api/cctv';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { IOTCharts } from './IOTStatistics.jsx';

Chart.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement, ChartDataLabels
);

const tabStyle = (isSelected) => ({
  backgroundColor: isSelected ? '#66bb6a' : '#120639', // Green when selected, dark when not
  color: '#fff',
  padding: '2.5px',
  border: '1px solid #999',
  borderBottom: isSelected ? 'none' : '1px solid #999',
  cursor: 'pointer',
  textAlign: 'center',
});

export default function Dashboard() {
  const [dashboardDroneData, setDashboardDroneData] = useState(null);
  const [dashboardCCTVData, setDashboardCCTVData] = useState(null);
  const [selectedSection, setSelectedSection] = useState('Dashboard');
  const [filteredDroneStations, setFilteredDroneStations] = useState([]);
  const markerRefs = useRef([]);
  const mapRef = useRef();
  const [iotData, setIotData] = useState([]);
  const [filteredCameras, setFilteredCameras] = useState([]);
  const [activeStatisticsTab, setActiveStatisticsTab] = useState(0);

  const handleStatisticsTabChange = (event, newValue) => {
    setActiveStatisticsTab(newValue);
  };

  useEffect(() => {
    const fetchDroneData = async () => {
      try {
        const response = await getDashboardDroneInfo(); // Fetch data from the API
        setDashboardDroneData(response);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDroneData();
  }, []);

  useEffect(() => {
    const fetchCCTVData = async () => {
      try {
        const response = await getDashboardCCTVInfo();
        setDashboardCCTVData(response);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchCCTVData();
  }, []);

  useEffect(() => {
    const fetchDroneStations = async () => {
      try {
        const response = await getDroneStations();
        setFilteredDroneStations(response);

        // Status counting logic
        const statusCounts = response.reduce((acc, station) => {
          const status = station.Inservice; // Get the status of the station
          acc[status] = (acc[status] || 0) + 1; // Increment the count for the status
          return acc;
        }, {});

        const droneStatusArray = Object.entries(statusCounts).map(([status, count]) => ({
          _id: status,
          count: count,
        }));

      } catch (error) {
        console.error('Error fetching drone stations:', error);
      }
    };

    fetchDroneStations();
  }, []);

  useEffect(() => {
    const fetchIotData = async () => {
      try {
        const response = await getIotData();
        setIotData(response);
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

      }
      catch (error) {
        console.error('Error fetching IoT Data:', error);
      }
    };
    fetchIotData();
  }, []);

  useEffect(() => {
    const fetchCamerasData = async () => {
      try {
        const cameraData = await getCameras();
        // setCameras(cameraData);
        setFilteredCameras(cameraData);

      } catch (error) {
        console.error('Error fetching cameras:', error);
      }
    };
    fetchCamerasData();
  }, []);

  if (!dashboardDroneData) {
    return <Typography>Loading...</Typography>;
  }
  const { noOfDrones, noOfMissions, noOfUsers, noOfIncidents, droneStatus, missionsPerDay } = dashboardDroneData;
  const statusColors = {
    'Active': '#4caf50',   // Green for Active
    'Stopped': '#f44336',  // Red for Stopped
    'Repair': '#ff9800'    // Orange for Repair
  };
  const pieData = {
    labels: droneStatus.map((status) => status._id),
    datasets: [
      {
        label: '# of Drones',
        data: droneStatus.map((status) => status.count),
        backgroundColor: droneStatus.map((status) => statusColors[status._id] || '#9e9e9e'),
      },
    ],
  };

  const lineData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Missions Per Day',
        data: missionsPerDay.map((mission) => mission.count),
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        borderColor: '#4caf50',
        fill: true,
        padding: '10',
      },
    ],
  };
  const { routeCounts, cameraLocations } = dashboardCCTVData || {};


  // bar chart data for route-wise distribution
  const barChartData = {
    labels: Object.keys(routeCounts || {}),
    datasets: [
      {
        label: "Active Cameras",
        data: Object.values(routeCounts || {}).map((route) => route.active),
        backgroundColor: "green",
        color: "#fffff"
      },
      {
        label: "Inactive Cameras",
        data: Object.values(routeCounts || {}).map((route) => route.inactive),
        backgroundColor: "red",
      },
    ],
  };
  // Style for the card and chart backgrounds
  const cardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.25)', // Black with 16% opacity
    color: '#fff', // Ensure text color is white
    display: 'flex',
    flexDirection: 'column'
  };

  const typographyStyle = {
    fontSize: '1.3rem',
    color: '#B0E57C',
  };

  // Box background for the main layout
  const boxStyle = {
    backgroundColor: '#120639',
    minHeight: '100vh',
  };

  const line_options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "#B0E57C",
          font: {
            size: 14,
            weight: "bold",
          },
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw.toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#B0E57C", // Greenish text
          font: {
            size: 14,
          },
          padding: 10,
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)", // Light gridlines
          drawBorder: false,
        },
      },
      y: {
        ticks: {
          color: "#B0E57C",
          font: {
            size: 14,
          },
          stepSize: 20,
          padding: 10,
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
          drawBorder: false,
        },
        beginAtZero: true,
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "#B0E57C",
          font: {
            size: 14,
            weight: "bold",
          },
          padding: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw}`,
        },
      },
      datalabels: {
        // color: "white", // Text color inside bars
        font: {
          size: 14,
          weight: "bold",
        },
        anchor: "center", // Place labels in the center
        align: "center", // Align text inside the bar
        formatter: (value) => (value > 0 ? value : ""), // Hide zero values
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#B0E57C", // Greenish text
          font: {
            size: 14,
          },
          padding: 10,
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)", // Light gridlines
          drawBorder: false,
        },
      },
      y: {
        ticks: {
          color: "#B0E57C",
          font: {
            size: 14,
          },
          stepSize: 5,
          padding: 10,
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
          drawBorder: false,
        },
        beginAtZero: true,
      },
    },
  };

  const renderDashboardSection = () => {
    return (
      <Grid container spacing={2} sx={{ padding: '20px' }}>
        <Grid item xs={12} md={12}>
          {legend()}
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ color: '#fff', padding: '5px' }}>
            Drone Monitoring
          </Typography>
          <MapContainer center={[37.7749, -122.4194]} zoom={15} style={{ height: '65vh', width: '100%' }} ref={mapRef} >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapSearchControl />
            {filteredDroneStations.map((drone, index) => {
              return (
                <Marker
                  key={drone.station_id}
                  position={[drone.Latitude, drone.Longitude]}
                  icon={createDroneIcon(drone.Inservice)}
                  ref={(el) => (markerRefs.current[drone.station_id] = el)}  // Assign marker ref to the drone station ID
                >
                  <Popup>
                    Station ID: <strong>{drone.station_id}</strong> <br />
                    Address: <strong>{drone.Location}</strong> <br />
                    Status: <strong>{drone.Inservice}</strong> <br />
                    Drone Used: <strong>{drone.drone_info.name}</strong> <br />
                  </Popup>
                </Marker>
              );
            })} 
          </MapContainer>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ color: '#fff', padding: '5px' }}>
            CCTV Monitoring
          </Typography>
          <Box sx={{ position: 'absolute', top: 10, right: 10, backgroundColor: '#fff', padding: 1, borderRadius: 1, zIndex: 1000 }}>
            <Typography variant="body2"><span style={{ color: '#00FF00' }}>■</span> Active</Typography>
            <Typography variant="body2"><span style={{ color: '#FF0000' }}>■</span> Inactive</Typography>
          </Box>
          <MapContainer center={[37.7749, -122.4194]} zoom={12} style={{ height: '65vh', width: '100%' }} ref={mapRef}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapSearchControl />
            {filteredCameras.map((camera) => (
              <Marker
                key={camera.camera_id}
                position={[camera.lat, camera.lng]}
                icon={getStatusIcon(camera.inService)}
                ref={(el) => markerRefs.current[camera.camera_id] = el}
                eventHandlers={{
                  click: () => handleCCTVMarkerClick(camera),
                }}
              >
                <Popup>
                  <Typography variant="body1">{camera.locationName}</Typography>
                  <Typography variant="body2">Nearby: {camera.nearbyPlace}</Typography>
                  {camera.direction && <Typography variant="body2">Direction: {camera.direction}</Typography>}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ color: '#fff', padding: '5px' }}>
            Missions
          </Typography>
          <Missions showCurrentMissions={false} />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ color: '#fff', padding: '5px' }}>
            IOT
          </Typography>
          <MapContainer center={[37.7749, -122.4194]} zoom={13} style={{ height: '80vh', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"  />
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
    )
  };

  const renderStatisticsSection = () => {
    return (
      // <Box sx={{ width: "100%", bgcolor: "transparent" }}>
      //   <Tabs
      //     value={activeStatisticsTab}
      //     onChange={handleStatisticsTabChange}
      //     textColor="primary"
      //     indicatorColor="secondary"
      //     centered sx={{
      //       ".MuiTab-root": {
      //         color: "white", // Default text color
      //       },
      //       ".MuiTab-root.Mui-selected": {
      //         color: "#66bb6a", // Text color for the selected tab
      //       },
      //       ".MuiTabs-indicator": {
      //         backgroundColor: "#66bb6a", // Color of the indicator
      //       },
      //     }}
      //   >
      //     <Tab label="Drones" />
      //     <Tab label="CCTV" />
      //     <Tab label="IoT" />
      //   </Tabs>
      //   {activeStatisticsTab === 0 && (

      <Grid container spacing={2} sx={{ padding: '20px' }}>
        <Grid item xs={12} md={3}>
          <Card style={cardStyle}>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography style={typographyStyle} variant="h5">
                  {noOfDrones}
                </Typography>
                <Typography style={typographyStyle} variant="subtitle1">
                  No of Drones
                </Typography>
              </Box>
              <Box
                component="span"
                sx={{ width: '2rem', height: '2rem', display: 'inline-block' }}
                dangerouslySetInnerHTML={{
                  __html: `<svg fill='#B0E57C' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>quadcopter</title><path d="M5.5,1C8,1 10,3 10,5.5C10,6.38 9.75,7.2 9.31,7.9L9.41,8H14.59L14.69,7.9C14.25,7.2 14,6.38 14,5.5C14,3 16,1 18.5,1C21,1 23,3 23,5.5C23,8 21,10 18.5,10C17.62,10 16.8,9.75 16.1,9.31L15,10.41V13.59L16.1,14.69C16.8,14.25 17.62,14 18.5,14C21,14 23,16 23,18.5C23,21 21,23 18.5,23C16,23 14,21 14,18.5C14,17.62 14.25,16.8 14.69,16.1L14.59,16H9.41L9.31,16.1C9.75,16.8 10,17.62 10,18.5C10,21 8,23 5.5,23C3,23 1,21 1,18.5C1,16 3,14 5.5,14C6.38,14 7.2,14.25 7.9,14.69L9,13.59V10.41L7.9,9.31C7.2,9.75 6.38,10 5.5,10C3,10 1,8 1,5.5C1,3 3,1 5.5,1M5.5,3A2.5,2.5 0 0,0 3,5.5A2.5,2.5 0 0,0 5.5,8A2.5,2.5 0 0,0 8,5.5A2.5,2.5 0 0,0 5.5,3M5.5,16A2.5,2.5 0 0,0 3,18.5A2.5,2.5 0 0,0 5.5,21A2.5,2.5 0 0,0 8,18.5A2.5,2.5 0 0,0 5.5,16M18.5,3A2.5,2.5 0 0,0 16,5.5A2.5,2.5 0 0,0 18.5,8A2.5,2.5 0 0,0 21,5.5A2.5,2.5 0 0,0 18.5,3M18.5,16A2.5,2.5 0 0,0 16,18.5A2.5,2.5 0 0,0 18.5,21A2.5,2.5 0 0,0 21,18.5A2.5,2.5 0 0,0 18.5,16M3.91,17.25L5.04,17.91C5.17,17.81 5.33,17.75 5.5,17.75A0.75,0.75 0 0,1 6.25,18.5L6.24,18.6L7.37,19.25L7.09,19.75L5.96,19.09C5.83,19.19 5.67,19.25 5.5,19.25A0.75,0.75 0 0,1 4.75,18.5L4.76,18.4L3.63,17.75L3.91,17.25M3.63,6.25L4.76,5.6L4.75,5.5A0.75,0.75 0 0,1 5.5,4.75C5.67,4.75 5.83,4.81 5.96,4.91L7.09,4.25L7.37,4.75L6.24,5.4L6.25,5.5A0.75,0.75 0 0,1 5.5,6.25C5.33,6.25 5.17,6.19 5.04,6.09L3.91,6.75L3.63,6.25M16.91,4.25L18.04,4.91C18.17,4.81 18.33,4.75 18.5,4.75A0.75,0.75 0 0,1 19.25,5.5L19.24,5.6L20.37,6.25L20.09,6.75L18.96,6.09C18.83,6.19 18.67,6.25 18.5,6.25A0.75,0.75 0 0,1 17.75,5.5L17.76,5.4L16.63,4.75L16.91,4.25M16.63,19.25L17.75,18.5A0.75,0.75 0 0,1 18.5,17.75C18.67,17.75 18.83,17.81 18.96,17.91L20.09,17.25L20.37,17.75L19.25,18.5A0.75,0.75 0 0,1 18.5,19.25C18.33,19.25 18.17,19.19 18.04,19.09L16.91,19.75L16.63,19.25Z" /></svg>`
                }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card style={cardStyle}>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography style={typographyStyle} variant="h5">
                  {noOfMissions}
                </Typography>
                <Typography style={typographyStyle} variant="subtitle1">
                  No of Missions
                </Typography>
              </Box>
              <FlightTakeoff style={{ fontSize: '2rem', color: '#B0E57C' }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card style={cardStyle}>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography style={typographyStyle} variant="h5">
                  {noOfUsers}
                </Typography>
                <Typography style={typographyStyle} variant="subtitle1">
                  Users
                </Typography>
              </Box>
              <Person style={{ fontSize: '2rem', color: '#B0E57C' }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card style={cardStyle}>
            <Typography variant="h6" sx={{ color: '#B0E57C', padding: "10px" }}>
              Drone Status
            </Typography>
            <CardContent>
              <Pie
                data={pieData}
                options={{
                  maintainAspectRatio: false, // To allow flexible sizing
                  plugins: {
                    legend: {
                      display: true,
                      position: 'top',
                      labels: {
                        color: '#B0E57C',
                        font: {
                          size: '16',
                          weight: 'bold'
                        }
                      }
                    },
                  },
                }}
                height={300}
                width={100} />
            </CardContent>
          </Card>

        </Grid>
        <Grid item xs={12} md={4}>
          <Card style={cardStyle}>
            <CardContent>
              <Line data={lineData} options={line_options} style={{ height: "350px" }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card style={cardStyle}>
            <Typography variant="h6" sx={{ color: "#B0E57C", padding: "10px" }}>
              Camera Status by Route
            </Typography>
            <CardContent>
              <Bar data={barChartData} options={barChartOptions} style={{ height: "300px" }} />
            </CardContent>
          </Card>
        </Grid>
        <IOTCharts iotData={iotData} cardStyle={cardStyle}></IOTCharts>
      </Grid>
    )
  };

  return (
    <Box sx={boxStyle}>
      <AppBar position="static" sx={{ backgroundColor: '#120639', padding: 0, boxShadow: 'none' }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
          {/* Section Tabs */}
          <Box sx={{ flex: 1 }}
            onClick={() => setSelectedSection('Dashboard')}
            style={tabStyle(selectedSection === 'Dashboard')}
          >
            Dashboard
          </Box>
          <Box sx={{ flex: 1 }}
            onClick={() => setSelectedSection('Statistics')}
            style={tabStyle(selectedSection === 'Statistics')}>
            Statistics
          </Box>
        </Box>
      </AppBar>
      {selectedSection === 'Dashboard' && renderDashboardSection()}
      {selectedSection === 'Statistics' && renderStatisticsSection()}

    </Box>
  );
}
