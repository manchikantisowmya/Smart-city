import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getDrones, getDroneStatistics } from '../api/drone.js';
import { Grid, Box, Typography, Button, Card, CardContent } from '@mui/material';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import MissionPlanner from './MissionPlanner'; // Import Mission Planner
import { Pie } from 'react-chartjs-2';
import MapSearchControl from '../Utilities/MapSearchControl';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart } from 'chart.js';

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
    const [drones, setDrones] = useState([]);
    const [selectedDroneDetails, setSelectedDroneDetails] = useState(null);
    const [showMissionPlanner, setShowMissionPlanner] = useState(false);
    const [droneStatusData, setDroneStatusData] = useState(null);

    const mapRef = useRef(null);

    useEffect(() => {
        const fetchDrones = async () => {
            try {
                const response = await getDrones();
                handleDroneClick(response[0]);
                setDrones(response);
            } catch (error) {
                console.error('Error fetching drones:', error);
            }
        };

        fetchDrones();
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
            mapRef.current.setView([drone.last_known_lat, drone.last_known_lon], 15); // Zoom level 15 for better focus
        }
    };

    const handleBackToMonitoring = () => {
        setShowMissionPlanner(false);
    };

    return !showMissionPlanner ? (
        <Grid container spacing={2}>
            {/* Sidebar with Drone List */}
            <Grid item xs={2}>
            {droneStatusData && (
                <Box
                    sx={{
                        bottom: '10px',
                        left: '100px',
                        height:'150px',
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
                                datalabels:{
                                    display:true,
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
                                    labels:{
                                        color:'white',
                                        font:{
                                          size:'14',
                                          weight:'bold'
                                        }
                                      } 
                                },
                            },
                        }}
                        height={100}
                        width={100}
                    />
                </Box>
                )}
                <Box sx={{ backgroundColor: '#120639', color: 'white', height: '50vh', overflowY: 'auto' }}>
                    {drones.map((drone, index) => (
                        <Card key={index} sx={{ backgroundColor: '#1a1a3d', marginBottom: '5px', color: 'white' }}>
                            <CardContent>
                                <Typography variant="body1">Drone ID: {drone.drone_id}</Typography>
                                <Typography variant="body2">Lat: {drone.last_known_lat}</Typography>
                                <Typography variant="body2">Lng: {drone.last_known_lon}</Typography>
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
                <Box sx={{ backgroundColor: '#120639', color: 'white', height: '25vh', overflowY: 'auto' }}>
                    {selectedDroneDetails && (
                        <Box sx={{ marginTop: '20px' }}>
                            <Typography variant="h6" gutterBottom>
                                Drone Details
                            </Typography>
                            <Typography variant="body2">Drone ID: {selectedDroneDetails.drone_id}</Typography>
                            <Typography variant="body2">
                                Coordinates: {selectedDroneDetails.last_known_lat}, {selectedDroneDetails.last_known_lon}
                            </Typography>
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

            {/* Map with Drones */}
            <Grid item xs={10}>
                <MapContainer center={[37.7749, -122.4194]} zoom={13} style={{ height: '85vh', width: '100%' }} ref={mapRef} >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <MapSearchControl />
                    {drones.map((drone) => (
                        <Marker
                            key={drone.drone_id}
                            position={[drone.last_known_lat, drone.last_known_lon]}
                            icon={createDroneIcon(drone.last_known_status)}
                        >
                            <Popup>
                                <strong>{drone.name}</strong>
                                <br />
                                Status: {drone.last_known_status}
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
                
            </Grid>
        </Grid>
    ) : (
        <MissionPlanner droneId={selectedDroneDetails.drone_id} onBackToMonitoring={handleBackToMonitoring} />
    );
};

export default DroneMonitoring;
