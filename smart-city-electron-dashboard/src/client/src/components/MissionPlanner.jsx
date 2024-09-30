import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { Grid, Box, Typography, Button, Card, CardContent } from '@mui/material';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getDroneMissions } from '../api/drone';
import { renderToStaticMarkup } from 'react-dom/server';
import { Pie } from 'react-chartjs-2';
import MapSearchControl from '../Utilities/MapSearchControl';

const createWaypointIcon = (missionStatus) => {
    let color;

    switch (missionStatus) {
        case 'Completed':
            color = '#f44336'; // Green for Completed
            break;
        case 'Planned':
            color = '#4caf50';
            break;
        case 'Failed':
            color = '#ff9800'; //orange
            break;
        default:
            color = '#9e9e9e'; // Grey for other statuses
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
    const [missionStatusData, setMissionStatusData] = useState({});

    useEffect(() => {
        const fetchMissions = async () => {
            try {
                const response = await getDroneMissions(droneId); // API call to fetch missions
                setMissions(response);
                const waypointsArray = [];
                const statusCounts = { Completed: 0, Planned: 0, Failed: 0 };
                response.forEach((mission) => {
                    try {
                        const cleanedString = mission.mission_waypoints[0].replace(/\\"/g, '"');
                        const waypoints = JSON.parse(cleanedString);
                        waypointsArray.push({
                            ...waypoints,
                            mission_status: mission.mission_status
                        });
                        if (statusCounts[mission.mission_status] !== undefined) {
                            statusCounts[mission.mission_status] += 1;
                        }
                    } catch (error) {
                        console.error('Error parsing mission waypoints:', error);
                    }
                });
                setAllWaypoints(waypointsArray);
                setMissionStatusData(statusCounts);
            } catch (error) {
                console.error('Error fetching missions:', error);
            }
        };

        fetchMissions();
    }, [droneId]);

    const pieData = {
        labels: ['Completed', 'Planned', 'Failed'],
        datasets: [
            {
                data: [missionStatusData.Completed, missionStatusData.Planned, missionStatusData.Failed],
                backgroundColor: ['#f44336', '#4caf50', '#ff9800'],
            },
        ],
    };

    return (
        <Grid container sx={{ height: '100vh', display: 'flex', flexDirection: 'row', backgroundColor: '#1a1a3d' }}>
            {/* Left Pane: Waypoints List and Back to Monitoring */}
            <Grid item xs={3} sx={{ display: 'flex', flexDirection: 'column', backgroundColor: '#120639', color: 'white', padding: '20px', overflowY: 'auto' }}>
                <Box
                    sx={{
                        bottom: '10px',
                        left: '100px',
                        height:'150px',
                        backgroundColor: '#120639',
                        borderRadius: '10px',
                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                        zIndex: 1000,
                    }}>
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
                    />
                </Box>
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
                        <MapSearchControl />
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
