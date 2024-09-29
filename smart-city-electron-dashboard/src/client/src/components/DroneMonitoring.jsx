import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getDrones } from '../api/drone.js';
import { Grid, Box, Typography, Button, Card, CardContent } from '@mui/material';
import { Toys } from '@mui/icons-material';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import MissionPlanner from './MissionPlanner'; // Import Mission Planner


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

    const iconHTML = renderToStaticMarkup(<Toys style={{ color: color, fontSize: '3rem' }} />);
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

    useEffect(() => {
        const fetchDrones = async () => {
            try {
                const response = await getDrones();
                setDrones(response);
            } catch (error) {
                console.error('Error fetching drones:', error);
            }
        };

        fetchDrones();
    }, []);

    const handleDroneClick = (drone) => {
        setSelectedDroneDetails(drone);
    };

    const handleBackToMonitoring = () => {
        setShowMissionPlanner(false);
    };

    return !showMissionPlanner ? (
        <Grid container spacing={2}>
            {/* Sidebar with Drone List */}
            <Grid item xs={2}>
                <Box sx={{ backgroundColor: '#120639', color: 'white', height: '60vh', overflowY: 'auto' }}>
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
                <MapContainer center={[37.7749, -122.4194]} zoom={13} style={{ height: '85vh', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
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
