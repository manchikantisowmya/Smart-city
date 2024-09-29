import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getDrones, getDroneStatistics, getDroneStations, getHighwaysWithExits } from '../api/drone.js';
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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={color}><title>quadcopter</title>
            <path d="M5.5,1C8,1 10,3 10,5.5C10,6.38 9.75,7.2 9.31,7.9L9.41,8H14.59L14.69,7.9C14.25,7.2 14,6.38 14,5.5C14,3 16,1 18.5,1C21,1 23,3 23,5.5C23,8 21,10 18.5,10C17.62,10 16.8,9.75 16.1,9.31L15,10.41V13.59L16.1,14.69C16.8,14.25 17.62,14 18.5,14C21,14 23,16 23,18.5C23,21 21,23 18.5,23C16,23 14,21 14,18.5C14,17.62 14.25,16.8 14.69,16.1L14.59,16H9.41L9.31,16.1C9.75,16.8 10,17.62 10,18.5C10,21 8,23 5.5,23C3,23 1,21 1,18.5C1,16 3,14 5.5,14C6.38,14 7.2,14.25 7.9,14.69L9,13.59V10.41L7.9,9.31C7.2,9.75 6.38,10 5.5,10C3,10 1,8 1,5.5C1,3 3,1 5.5,1M5.5,3A2.5,2.5 0 0,0 3,5.5A2.5,2.5 0 0,0 5.5,8A2.5,2.5 0 0,0 8,5.5A2.5,2.5 0 0,0 5.5,3M5.5,16A2.5,2.5 0 0,0 3,18.5A2.5,2.5 0 0,0 5.5,21A2.5,2.5 0 0,0 8,18.5A2.5,2.5 0 0,0 5.5,16M18.5,3A2.5,2.5 0 0,0 16,5.5A2.5,2.5 0 0,0 18.5,8A2.5,2.5 0 0,0 21,5.5A2.5,2.5 0 0,0 18.5,3M18.5,16A2.5,2.5 0 0,0 16,18.5A2.5,2.5 0 0,0 18.5,21A2.5,2.5 0 0,0 21,18.5A2.5,2.5 0 0,0 18.5,16M3.91,17.25L5.04,17.91C5.17,17.81 5.33,17.75 5.5,17.75A0.75,0.75 0 0,1 6.25,18.5L6.24,18.6L7.37,19.25L7.09,19.75L5.96,19.09C5.83,19.19 5.67,19.25 5.5,19.25A0.75,0.75 0 0,1 4.75,18.5L4.76,18.4L3.63,17.75L3.91,17.25M3.63,6.25L4.76,5.6L4.75,5.5A0.75,0.75 0 0,1 5.5,4.75C5.67,4.75 5.83,4.81 5.96,4.91L7.09,4.25L7.37,4.75L6.24,5.4L6.25,5.5A0.75,0.75 0 0,1 5.5,6.25C5.33,6.25 5.17,6.19 5.04,6.09L3.91,6.75L3.63,6.25M16.91,4.25L18.04,4.91C18.17,4.81 18.33,4.75 18.5,4.75A0.75,0.75 0 0,1 19.25,5.5L19.24,5.6L20.37,6.25L20.09,6.75L18.96,6.09C18.83,6.19 18.67,6.25 18.5,6.25A0.75,0.75 0 0,1 17.75,5.5L17.76,5.4L16.63,4.75L16.91,4.25M16.63,19.25L17.75,18.5A0.75,0.75 0 0,1 18.5,17.75C18.67,17.75 18.83,17.81 18.96,17.91L20.09,17.25L20.37,17.75L19.25,18.5A0.75,0.75 0 0,1 18.5,19.25C18.33,19.25 18.17,19.19 18.04,19.09L16.91,19.75L16.63,19.25Z" />
        </svg>
    );

    const iconHTML = renderToStaticMarkup(droneIconSVG);

    return L.divIcon({
        html: iconHTML,
        className: 'custom-drone-icon',
        iconSize: [40, 40],
        iconAnchor: [20, 20], // Adjusted anchor point for better positioning
    });
};


const DroneMonitoring = () => {
    const [droneStations, setDroneStations] = useState([]);
    const [drones, setDrones] = useState([]);
    const [cities, setCities] = useState([]);
    const [states, setStates] = useState([]);
    const [zipCodes, setZipCodes] = useState([]);
    const [selectedDroneDetails, setSelectedDroneDetails] = useState(null);
    const [showMissionPlanner, setShowMissionPlanner] = useState(false);
    const [droneStatusData, setDroneStatusData] = useState(null);
    const [highwaysWithExits, setHighwaysWithExits] = useState(null);
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

                const distinctCities = response.reduce((acc, station) => {
                    if (!acc.includes(station.City.trim())) {
                        acc.push(station.City.trim());
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
                    const zip = station.ZipCode?.toString();
                    if (zip && !acc.includes(zip)) {
                        acc.push(zip);
                    }
                    return acc;
                }, []);

                handleDroneClick(response[0]);
                setDroneStations(response);
                setDrones(distinctDrones);
                setCities(distinctCities);
                setStates(distinctStates);
                setZipCodes(distinctZipCodes);
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

    useEffect(() => {
        const fetchHighwaysWithExits = async () => {
            try {
                const response = await getHighwaysWithExits(); // Fetch data from the API
                setHighwaysWithExits(response);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };

        fetchHighwaysWithExits();
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
            mapRef.current.setView([drone.Latitude, drone.Longitude], 15);
        }
    };

    const handleSearch = (searchData) => {
        console.log("Search Data:", searchData);
    };
    const handleBackToMonitoring = () => {
        setShowMissionPlanner(false);
    };

    return !showMissionPlanner ? (
        <Grid container spacing={2}>
            {/* Row 1: Search and Pie Chart */}
            <Grid item xs={12} container>
                <Grid item xs={6}>
                    <Search onSearch={handleSearch} cities={cities} drones={drones} states={states} zipCodes={zipCodes} />
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
                                    onClick={() => setShowMissionPlanner(true)}
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
                                key={drone.station_id}
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
