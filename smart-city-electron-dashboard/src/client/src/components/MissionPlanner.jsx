import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { Grid, Box, Typography, Button, Card, CardContent } from '@mui/material';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Toys } from '@mui/icons-material';
import { getDroneMissions } from '../api/drone';
import { renderToStaticMarkup } from 'react-dom/server';

const createWaypointIcon = (missionStatus) => {
    let color;

    switch (missionStatus) {
        case 'Completed':
            color = '#4caf50'; // Green for Completed
            break;
        case 'Planned':
            color = '#2196f3'; // Blue for In Progress
            break;
        case 'Failed':
            color = '#f44336'; // Red for Failed
            break;
        default:
            color = '#9e9e9e'; // Grey for other statuses
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

const GridOverlay = () => {
    const map = useMap(); // Access the map instance
    useEffect(() => {
        const gridLayer = L.gridLayer({
            tileSize: 100,  // Grid size (adjust as needed)
            opacity: 0.5,   // Set grid opacity
        });

        // Create tile for each grid square
        gridLayer.createTile = function (coords) {
            const tile = L.DomUtil.create('div', 'leaflet-tile');
            tile.style.outline = '1px solid red'; // Red lines for the grid
            return tile;
        };

        gridLayer.addTo(map); // Add the grid to the map

        return () => {
            map.removeLayer(gridLayer); // Clean up the grid on component unmount
        };
    }, [map]);

    return null;
};

const MissionPlanner = ({ droneId, onBackToMonitoring }) => {
    const [missions, setMissions] = useState([]);
    const [allWaypoints, setAllWaypoints] = useState([]);

    useEffect(() => {
        const fetchMissions = async () => {
            try {
                const response = await getDroneMissions(droneId); // API call to fetch missions
                setMissions(response);
                const waypointsArray = [];
                response.forEach((mission) => {
                    try {
                        const cleanedString = mission.mission_waypoints[0].replace(/\\"/g, '"');
                        const waypoints = JSON.parse(cleanedString);
                        waypointsArray.push({
                            ...waypoints,
                            mission_status: mission.mission_status
                        });
                    } catch (error) {
                        console.error('Error parsing mission waypoints:', error);
                    }
                });
                setAllWaypoints(waypointsArray);
            } catch (error) {
                console.error('Error fetching missions:', error);
            }
        };

        fetchMissions();
    }, [droneId]);

    return (
        <Grid container sx={{ height: '100vh', display: 'flex', flexDirection: 'row', backgroundColor: '#1a1a3d' }}>
            {/* Left Pane: Waypoints List and Back to Monitoring */}
            <Grid item xs={3} sx={{ display: 'flex', flexDirection: 'column', backgroundColor: '#120639', color: 'white', padding: '20px', overflowY: 'auto' }}>
                <Typography variant="h6">Drone {droneId}</Typography>

                {missions.length > 0 && missions.map((mission, index) => {
                    let waypoints = [];
                    try {
                        const cleanedString = mission.mission_waypoints[0].replace(/\\"/g, '"');
                        waypoints = JSON.parse(cleanedString);
                    } catch (error) {
                        console.error('Error parsing mission waypoints:', error);
                    }
                    return (
                        <Card key={index} sx={{ marginBottom: '10px', backgroundColor: '#1a1a3d', color: 'white' }}>
                            <CardContent>
                                {waypoints.length > 0 && waypoints.map((waypoint, wpIndex) => (
                                    <Box key={wpIndex} sx={{ marginBottom: '10px' }}>
                                        <Typography>Waypoint {wpIndex + 1}</Typography>
                                        <Typography>Lat: {waypoint.lat}</Typography>
                                        <Typography>Lng: {waypoint.long}</Typography>
                                        <Typography>Speed: {waypoint.speed} mph</Typography>
                                        <Typography>Altitude: {waypoint.altitude} ft</Typography>
                                    </Box>
                                ))}
                            </CardContent>
                        </Card>
                    );
                })
                }
                <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    onClick={onBackToMonitoring} // On click, call the parent function to go back to monitoring
                    sx={{ marginTop: '20px' }}
                >
                    Back to Monitoring
                </Button>

            </Grid>

            {/* Right Pane: Map Display */}
            <Grid item xs={9}>
                <Box sx={{ height: '100%', width: '100%' }}>
                    <MapContainer center={allWaypoints.length > 0 ? [allWaypoints[0][0].lat, allWaypoints[0][0].long] : [37.31835840962726, -122.02360103248884]} zoom={10} style={{ height: '100%', width: '100%' }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <GridOverlay />
                        {allWaypoints.length > 0 && allWaypoints.map((waypoint, index) => (
                            <Marker
                                key={index}
                                position={[waypoint[0].lat, waypoint[0].long]}
                                icon={createWaypointIcon(waypoint.mission_status)}
                            />
                        ))}
                    </MapContainer>
                </Box>
            </Grid>
        </Grid>
    );
};

export default MissionPlanner;
