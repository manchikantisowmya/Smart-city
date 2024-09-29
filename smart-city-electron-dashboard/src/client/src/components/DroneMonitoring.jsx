import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getDrones, getDroneStatistics, getDroneStations } from '../api/drone.js';
import { Grid, Box, Typography, Button, Card, CardContent } from '@mui/material';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import MissionPlanner from './MissionPlanner'; // Import Mission Planner
import { Pie } from 'react-chartjs-2';
import MapSearchControl from '../Utilities/MapSearchControl';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart } from 'chart.js';
import Search from './Search';

Chart.register(ChartDataLabels);

// Convert the MUI icon to HTML and then to a Leaflet icon
const createDroneIcon = (status) => {
    let color;

    switch (status) {
        case 'Active':
            color = '#4caf50'; // Green for Active
            break;
        case 'Stopped':
            color = '#f44336'; // Red for Stopped
            break;
        case 'Repair':
            color = '#ff9800'; // Orange for Repair
            break;
        default:
            color = '#9e9e9e'; // Grey for Unknown/Other status
            break;
    }

    const droneIconSVG = (
        <svg
            width="80"
            height="80"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            fill={color}
        >
            <path d="M22 11h-1l-1-2h-6.25L16 12.5h-2L10.75 9H4c-.55 0-2-.45-2-1s1.5-2.5 3.5-2.5S7.67 6.5 9 7h12a1 1 0 0 1 1 1zM10.75 6.5L14 3h2l-2.25 3.5zM18 11V9.5h1.75L19 11zM3 19a1 1 0 0 1-1-1a1 1 0 0 1 1-1a4 4 0 0 1 4 4a1 1 0 0 1-1 1a1 1 0 0 1-1-1a2 2 0 0 0-2-2m8 2a1 1 0 0 1-1 1a1 1 0 0 1-1-1a6 6 0 0 0-6-6a1 1 0 0 1-1-1a1 1 0 0 1 1-1a8 8 0 0 1 8 8" />
        </svg>
    );

    const iconHTML = renderToStaticMarkup(droneIconSVG);
    return L.divIcon({
        html: iconHTML,
        className: '',
        iconSize: [40, 40],
        iconAnchor: [24, 24],
    });
};

const DroneMonitoring = () => {
    const [droneStations, setDroneStations] = useState([]);
    const [drones, setDrones] = useState([]);
    const [selectedDroneDetails, setSelectedDroneDetails] = useState(null);
    const [showMissionPlanner, setShowMissionPlanner] = useState(false);
    const [droneStatusData, setDroneStatusData] = useState(null);

    const mapRef = useRef(null);

    useEffect(() => {
        const fetchDroneStations = async () => {
            try {
                const response = await getDroneStations();
                const distinctDrones = response.reduce((acc, station) => {
                    const existingDrone = acc.find(drone => drone.drone_id === station.drone_id);
                    if (!existingDrone) {
                      acc.push({
                        drone_id: station.drone_id,
                        last_known_lat: station.Latitude,
                        last_known_lon: station.Longitude,
                        Location: station.Location,
                        Inservice: station.Inservice
                      });
                    }
                    return acc;
                  }, []);
              
                handleDroneClick(response[0]);
                setDroneStations(response);
                setDrones(distinctDrones);
            } catch (error) {
                console.error('Error fetching drone stations:', error);
            }
        };

        fetchDroneStations();
    }, []);

    useEffect(() => {
        const fetchDroneStatistics = async () => {
            try {
                const response = await getDroneStatistics(); // Fetch data from the API
                setDroneStatusData(response);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };

        fetchDroneStatistics();
    }, []);

    const pieData = droneStatusData
        ? {
            labels: droneStatusData.droneStatus.map((status) => status._id),
            datasets: [
                {
                    label: '# of Drones',
                    data: droneStatusData.droneStatus.map((status) => status.count),
                    backgroundColor: ['#4caf50', '#f44336', '#ff9800'],
                },
            ],
        }
        : {
            labels: ['Loading...'],
            datasets: [
                {
                    label: '# of Drones',
                    data: [1],
                    backgroundColor: ['#e0e0e0'],
                },
            ],
        };

    const handleDroneClick = (drone) => {
        setSelectedDroneDetails(drone);
        if (mapRef.current) {
            mapRef.current.setView([drone.Latitude, drone.Longitude], 15); // Zoom level 15 for better focus
        }
    };
    const cities = ["San Francisco", "Los Angeles", "San Diego", "San Jose", "Sacramento"];

    const handleSearch = (searchData) => {
        console.log("Search Data:", searchData);
        // Handle the search data (e.g., make an API request to filter the data)
    };
    const handleBackToMonitoring = () => {
        setShowMissionPlanner(false);
    };

    return !showMissionPlanner ? (
        <Grid container spacing={2}>
            {/* Row 1: Search and Pie Chart */}
            <Grid item xs={12} container>
                <Grid item xs={6}>
                    <Search onSearch={handleSearch} cities={cities} drones={drones} />
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
                        }} >
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
                            height={100}
                            width={100}
                        />
                    </Box>
                </Grid>
            </Grid>

            {/* Row 2: Drone Details Sidebar and Map */}
            <Grid item xs={12} container>
                <Grid item xs={3}>
                    <Box sx={{ backgroundColor: '#120639', color: 'white', height: '45vh', overflowY: 'auto' }}>
                        {droneStations.map((drone, index) => (
                            <Card key={index} sx={{ backgroundColor: '#1a1a3d', marginBottom: '5px', color: 'white' }}>
                                <CardContent>
                                    <Typography variant="body1">Drone Station: {drone.station_id}</Typography>
                                    <Typography variant="body2">Location: {drone.Location}</Typography>
                                    <Typography variant="body2">Drone ID: {drone.drone_id}</Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleDroneClick(drone)}
                                        sx={{ marginTop: '10px' }}
                                    >
                                        Details
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                    <Box sx={{ backgroundColor: '#120639', color: 'white', height: '20vh', overflowY: 'auto' }}>
                        {selectedDroneDetails && (
                            <Box sx={{ marginTop: '20px' }}>
                                <Typography variant="h6" gutterBottom>
                                    Drone Details
                                </Typography>
                                <Typography variant="body2">Drone ID: {selectedDroneDetails.drone_id}</Typography>
                                <Typography variant="body2">
                                    Location: {selectedDroneDetails.Location}
                                </Typography>
                                <Typography variant="body2">Status: {selectedDroneDetails.drone_info.last_known_status}</Typography>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    sx={{ marginTop: '10px' }}
                                    onClick={() => setShowMissionPlanner(true)}  // Show the Mission Planner on click
                                >
                                    Check Missions
                                </Button>
                            </Box>
                        )}
                    </Box>
                </Grid>
                <Grid item xs={9}>
                    <MapContainer center={[37.7749, -122.4194]} zoom={13} style={{ height: '65vh', width: '100%' }} ref={mapRef} >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <MapSearchControl />
                        {droneStations.map((drone) => (
                            <Marker
                                key={drone.drone_id}
                                position={[drone.Latitude, drone.Longitude]}
                                icon={createDroneIcon(drone.drone_info.last_known_status)}
                            >
                                <Popup>
                                    <strong>{drone.drone_info.name}</strong>
                                    <br />
                                    Status: {drone.drone_info.last_known_status}
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </Grid>
            </Grid>
        </Grid>
    ) : (
        <MissionPlanner droneId={selectedDroneDetails.drone_id} onBackToMonitoring={handleBackToMonitoring} />
    );
};

export default DroneMonitoring;
