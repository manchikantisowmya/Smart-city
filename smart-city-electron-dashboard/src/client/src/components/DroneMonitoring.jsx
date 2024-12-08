// Modified by Yukta
/*
I changed the check mission button beside the detail button
In the Pie chart drone station are shown instead of drones and also aligned the colors on the map with station instead of drone
When click on Details it shows detail on Map itself

Also how somehome I feel data in DroneMission is missing and incorrect the way points I beleive it would be good if we could use Drone_mission_y table"
*/

import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getDroneStatistics, getDroneStations, getHighwaysWithExits } from '../api/drone.js';
import MissionPlanner from './MissionPlanner'; 
import { Pie } from 'react-chartjs-2';
import MapSearchControl from '../Utilities/MapSearchControl';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart } from 'chart.js';
import Search from './Search';
import { Grid, Box, Typography, Button, Card, CardContent } from '@mui/material'; // Import Dialog components
import {createDroneIcon} from '../Utilities/MapUtilities.js';
Chart.register(ChartDataLabels);

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
    //const mapRef = useRef(null);
    const [filteredDroneStations, setFilteredDroneStations] = useState([]);
    const [selectedDroneStation, setSelectedDroneStation] = useState(null);
    const mapRef = useRef();
    const markerRefs = useRef([]);

    //const [showDetailsPopup, setShowDetailsPopup] = useState(false); // New state for popup
    const [showDetailsPopup, setShowDetailsPopup] = useState(false); // New state for popup

    const handleClosePopup = () => {
        setShowDetailsPopup(false); // Close the popup
    };
    useEffect(() => {
        // Open the popup for the selected drone station
        if (selectedDroneStation) {
            const selectedRef = markerRefs.current[selectedDroneStation.station_id];
            if (selectedRef) {
                selectedRef.openPopup();
            }
        }
    }, [selectedDroneStation]);

    useEffect(() => {
        const fetchDroneStations = async () => {
            try {
                const response = await getDroneStations();
                // setDroneStatusData(response)
                const distinctDrones = response.reduce((acc, station) => {
                    const existingDrone = acc.find(drone => drone.drone_id === station.drone_id);
                    if (!existingDrone && station.Latitude && station.Longitude) {
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

                setDroneStations(response);
                setDrones(distinctDrones);
                setCities(distinctCities);
                setStates(distinctStates);
                setZipCodes(distinctZipCodes);
                setDroneStations(response);
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

                setDroneStatusData({ droneStatus: droneStatusArray }); // Update state with the new status data


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
                //setDroneStatusData(response);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };

        fetchDroneStatistics();
    }, []);

    useEffect(() => {
        const fetchHighwaysWithExits = async () => {
            try {
                const response = await getHighwaysWithExits();
                const distinctHighways = response.reduce((acc, highway) => {
                    const exists = acc.find(hwy => hwy.highway_number === highway.highway_number);
                    if (!exists) {
                        acc.push({
                            highway_number: highway.highway_number,
                            start_location: highway.start_location,
                            end_location: highway.end_location,
                            available_lanes: highway.available_lanes,
                            exits: highway.exits,
                        });
                    }
                    return acc;
                }, []);
                setHighwaysWithExits(distinctHighways);
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
        // setShowDetailsPopup(true); // Open popup on button click
        setSelectedDroneStation(drone); // Set selected drone station



        if (mapRef.current) {
            mapRef.current.setView([drone.Latitude, drone.Longitude], 15);
        }
        // Open popup for the selected drone station
        const markers = document.getElementsByClassName('leaflet-marker-icon');
        Array.from(markers).forEach((marker) => {
            marker.click();
        });
    };
    const handleCheckMissionsClick = (drone) => {
        setSelectedDroneDetails(drone); // Set the drone details when "Check Missions" is clicked
        console.log(drone)
        setShowMissionPlanner(true);    // Open the mission planner
    };
    const handleSearch = (searchFields) => {
        const filtered = droneStations.filter((station) => {
            return (
                (!searchFields.state || station.State === searchFields.state) &&
                (!searchFields.city || station.City.trim() === searchFields.city) &&
                (!searchFields.droneId || station.drone_id === searchFields.droneId) &&
                (!searchFields.zip || station.ZipCode?.toString() === searchFields.zip)
                // (!searchFields.highway || station.highway === searchFields.highway) &&
                // (!searchFields.exitNo || station.exitNo === searchFields.exitNo)
            );
        });
        setFilteredDroneStations(filtered);
    };
    const handleBackToMonitoring = () => {
        setShowMissionPlanner(false);
    };

    return !showMissionPlanner ? (
        <Grid container spacing={2}>
            {/* Row 1: Search and Pie Chart */}
            <Grid item xs={12} container>
                <Grid item xs={6}>
                    <Search onSearch={handleSearch} cities={cities} drones={drones} states={states} zipCodes={zipCodes} highways={highwaysWithExits} />
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
                    <Box sx={{ backgroundColor: '#120639', color: 'white', height: '45vh', overflowY: 'auto', height: '65vh' }}>
                        {filteredDroneStations.map((drone, index) => (
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
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        sx={{ marginTop: '10px', marginLeft: '5px' }}
                                        onClick={() => handleCheckMissionsClick(drone)} // Use new handler
                                    >
                                        CHECK MISSIONS
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                    {/* <Box sx={{ backgroundColor: '#120639', color: 'white', height: '20vh', overflowY: 'auto' }}>
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
                    </Box> */}
                </Grid>
                <Grid item xs={9}>
                    {/* <MapContainer center={[37.7749, -122.4194]} zoom={15} style={{ height: '65vh', width: '100%' }} ref={mapRef} >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <MapSearchControl />
                        {filteredDroneStations.map((drone) => (
                            <Marker
                                key={drone.station_id}
                                position={[drone.Latitude, drone.Longitude]}
                                icon={createDroneIcon(drone.Inservice)}
                            >
                                 <Popup>
                                     Station ID:<strong>{drone.station_id}</strong> <br></br>
                                     Address: <strong>{drone.Location}</strong><br></br>
                                     Status: <strong>{drone.Inservice}</strong><br></br>
                                     Drone Used: <strong>{drone.drone_info.name}</strong>
                                     <br />
                                 </Popup>
                            </Marker>
                        ))}
                    </MapContainer> */}

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
            </Grid>
            {/* Popup for Station Details
          {selectedDroneDetails && (
                  <Dialog open={showDetailsPopup} onClose={handleClosePopup}>
                      <DialogTitle>Drone Station Details</DialogTitle>
                      <DialogContent>
                          <Typography>Station ID: {selectedDroneDetails.station_id}</Typography>
                          <Typography>Location: {selectedDroneDetails.Location}</Typography>
                          <Typography>Drone ID: {selectedDroneDetails.drone_id}</Typography>
                          <Typography>Latitude: {selectedDroneDetails.Latitude}</Typography>
                          <Typography>Longitude: {selectedDroneDetails.Longitude}</Typography>
                      </DialogContent>
                      <DialogActions>
                          <Button onClick={handleClosePopup} color="primary">Close</Button>
                     </DialogActions>
                  </Dialog>
             )} */}
        </Grid>
    ) : (
        <MissionPlanner droneId={selectedDroneDetails.drone_id} onBackToMonitoring={handleBackToMonitoring} />
    );
};

export default DroneMonitoring;
