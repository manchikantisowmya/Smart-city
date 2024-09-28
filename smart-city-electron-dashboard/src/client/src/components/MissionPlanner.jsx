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
        <svg
            width="60"
            height="60"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            fill={color}>
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
