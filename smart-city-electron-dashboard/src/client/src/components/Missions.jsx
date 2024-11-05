import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Box, Typography, Button, Paper, Modal, Grid } from '@mui/material';
import { getAllDroneMissions } from '../api/drone';
import { renderToStaticMarkup } from 'react-dom/server';
import MapSearchControl from '../Utilities/MapSearchControl';
import L from 'leaflet';
import axios from 'axios';
import config from '../config.json';
import droneIcon from '../Images/drone1.png';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import AddEditMission from './AddEditMission';
import Waypoints from './Waypoints.jsx';

const getMissionColor = (missionStatus) => {
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
    return color;
}

const createWaypointIcon = (missionStatus) => {
    let color = getMissionColor(missionStatus);
    const iconHTML = renderToStaticMarkup(
        <div style={{ position: 'relative', textAlign: 'center' }}>
            <img src={droneIcon} alt="Drone" style={{ width: '50px', height: '50px', position: 'relative', zIndex: 2 }} />
            <div style={{
                backgroundColor: color,
                borderRadius: '50%',
                width: '60px',
                height: '60px',
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 1
            }} />
        </div>
    );

    return L.divIcon({
        html: iconHTML,
        className: '',
        iconSize: [60, 60],
        iconAnchor: [30, 30],
    });
};

export default function Missions() {
    const [missions, setMissions] = useState([]);
    const [missionStatusData, setMissionStatusData] = useState({});
    const [locations, setLocations] = useState({});
    const [missionDetails, setMissionDetails] = useState(null);
    const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
    const [missionDetailsVisible, setMissionDetailsVisible] = useState(null);
    const [selectedMission, setSelectedMission] = useState(null);
    const [action, setAction] = useState(null);
    const [showWaypoints, setShowWaypoints] = useState(false);

    const handleModifyWaypoints = (missionData) => {
        setSelectedMission(missionData);
        setShowWaypoints(true);
    };

    const showMissions = () => {
        setShowWaypoints(false);
        setAction('view');
    }

    const geocodeLocation = async (location) => {
        const env = process.env.NODE_ENV || 'development';
        const GEOCODE_API_KEY = config[env].GEOCODE_API_KEY;
        const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, {
            params: {
                q: location,
                key: GEOCODE_API_KEY,
            },
        });

        if (response.data.results.length > 0) {
            const { lat, lng } = response.data.results[0].geometry;
            return { latitude: lat, longitude: lng };
        }
        return null;
    };

    useEffect(() => {
        const fetchMissions = async () => {
            try {
                const response = await getAllDroneMissions();
                setMissions(response);
                const uniqueLocations = [];
                const statusCounts = { Completed: 0, Planned: 0, Failed: 0 };
                response.forEach((mission) => {
                    try {
                        if(mission.mission_location)
                            uniqueLocations.push(mission.mission_location);

                        if (statusCounts[mission.mission_status] !== undefined) {
                            statusCounts[mission.mission_status] += 1;
                        }
                    } catch (error) {
                        console.error('Error parsing mission waypoints:', error);
                    }
                });
                const locationPromises = uniqueLocations.map(async (location) => {
                    const coords = await geocodeLocation(location);
                    return { [location]: coords };
                });

                const locationResults = await Promise.all(locationPromises);
                const locationMap = Object.assign({}, ...locationResults);
                setLocations(locationMap);
                setMissionStatusData(statusCounts);
            } catch (error) {
                console.error('Error fetching missions:', error);
            }
        };

        fetchMissions();
    }, []);

    const handleEdit = (mission) => {
        setAction('edit');
        setSelectedMission(mission);
    };

    const handleDelete = (mission) => {
        setAction('delete');
        setSelectedMission(mission);
        setConfirmationModalOpen(true);
    };

    const pieData = {
        labels: ['Completed', 'Planned', 'Failed'],
        datasets: [
            {
                data: [missionStatusData.Completed, missionStatusData.Planned, missionStatusData.Failed],
                backgroundColor: ['#f44336', '#4caf50', '#ff9800'],
            },
        ],
    };
    const confirmDelete = async () => {
        try {
            await axios.delete(`${config[process.env.NODE_ENV].BASE_URL}/mission/${selectedMission.mission_id}`);
            setMissions(missions.filter((m) => m.mission_id !== selectedMission.mission_id));
            setConfirmationModalOpen(false);
            setSelectedMission(null);
        } catch (error) {
            console.error('Error deleting mission:', error);
        }
    };

    const toggleMissionDetails = (mission) => {
        if (missionDetailsVisible === mission.mission_id) {
            setMissionDetailsVisible(null);
        } else {
            setMissionDetailsVisible(mission.mission_id);
        }
    };

    const handleCreateMission = () => {
        setAction('add');
        setSelectedMission(null);
    }

    return (
        <Box>
            {showWaypoints ? (
                <Waypoints missionData={selectedMission} onBackToMission={showMissions} /> // Render Waypoints component if showWaypoints is true
            ) : (
                <Box sx={{ display: 'flex', height: '80vh' }}>
                    {/* Left Section for Map and Search */}
                    <Box sx={{ flex: 2, padding: 2, color: "#fff" }}>
                        {/* <Typography variant="h4" sx={{ mb: 2 }}>Mission Map</Typography> */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{ backgroundColor: '#ff9800', width: '15px', height: '15px', marginRight: '5px' }}></div>
                                <Typography variant="h5">Planned</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{ backgroundColor: '#4caf50', width: '15px', height: '15px', marginRight: '5px' }}></div>
                                <Typography variant="h5">Completed</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{ backgroundColor: '#f44336', width: '15px', height: '15px', marginRight: '5px' }}></div>
                                <Typography variant="h5">Failed</Typography>
                            </Box>
                        </Box>
                        <MapContainer center={[37.7749, -122.4194]} zoom={13} style={{ height: '80vh' }}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <MapSearchControl />
                            {missions.map((mission) => {
                                const locationCoords = locations[mission.mission_location];
                                return (
                                    locationCoords && (
                                        <Marker
                                            key={mission.mission_id}
                                            position={[locationCoords.latitude, locationCoords.longitude]}
                                            icon={createWaypointIcon(mission.mission_status)}

                                        >
                                            <Popup>
                                                <div>
                                                    <h3>{mission.mission_}</h3>
                                                    <p>Status: {mission.mission_status}</p>
                                                </div>
                                            </Popup>
                                        </Marker>
                                    )
                                );
                            })}
                        </MapContainer>

                    </Box>

                    <Box sx={{ width: '30%', padding: '10px', color: '#fff', overflowY: 'auto', height: '85vh' }}>
                        &nbsp;
                        <Button variant="contained" color="secondary" onClick={handleCreateMission} sx={{ mb: 2 }} >Create Mission</Button>
                        <Typography variant="h5">Current Missions</Typography>
                        {missions.map((mission) => (

                            <Paper key={mission.mission_id} elevation={3} sx={{ padding: '10px', marginBottom: '10px', backgroundColor: '#6870fa', borderRadius: '8px' }}>
                                <Box sx={{ display: 'flex' }}>
                                    <Button onClick={() => toggleMissionDetails(mission)} sx={{ width: '100%', textAlign: 'left', backgroundColor: 'transparent', border: 'none', padding: '0' }}>
                                        <Typography variant="body1" sx={{ color: '#fff' }}>
                                            Mission ID # {mission.mission_id} &nbsp;
                                            <span
                                                style={{
                                                    fontWeight: 'bold',
                                                    backgroundColor: getMissionColor(mission.mission_status),
                                                    color: '#fff',
                                                    padding: '4px 8px',
                                                    borderRadius: '10px',
                                                    display: 'inline-block',
                                                }}
                                            >
                                                {mission.mission_status}
                                            </span>
                                        </Typography>
                                    </Button>
                                    <Button onClick={() => handleEdit(mission)} sx={{ color: '#fff' }}><EditIcon /></Button>
                                    <Button onClick={() => handleDelete(mission)} sx={{ color: '#fff' }}><DeleteIcon /></Button>
                                    <Button onClick={() => toggleMissionDetails(mission)} sx={{ color: '#fff' }}>
                                        {missionDetails?.mission_id === mission.mission_id ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                    </Button>
                                </Box>
                                {missionDetailsVisible === mission.mission_id && (
                                    <Box sx={{ marginTop: '10px', padding: '10px', color: '#fff' }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={4}>
                                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Mission Type:</Typography>
                                                <Typography variant="body2">{mission.mission_type}</Typography>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Mission Location:</Typography>
                                                <Typography variant="body2">{mission.mission_location}</Typography>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Mission Distance:</Typography>
                                                <Typography variant="body2">{mission.mission_distance} km</Typography>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Drone Station:</Typography>
                                                <Typography variant="body2">{mission.assigned_drone}</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Mission Description:</Typography>
                                                <Typography variant="body2">{mission.mission_description}</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Mission Start Time:</Typography>
                                                <Typography variant="body2">{mission.mission_start_time}</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Mission End Time:</Typography>
                                                <Typography variant="body2">{mission.mission_end_time}</Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                )}

                            </Paper>
                        ))}
                    </Box>
                    <Modal open={confirmationModalOpen} onClose={() => setConfirmationModalOpen(false)}>
                        <Box sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 400,
                            bgcolor: 'background.paper',
                            border: '2px solid #000',
                            boxShadow: 24,
                            p: 4,
                        }}>
                            <Typography variant="h6">Delete Mission</Typography>
                            <Typography>
                                Are you sure you want to delete this mission (ID: {selectedMission?.mission_id})?
                            </Typography>
                            <Typography>This is an irreversible operation. You can't undo this action.</Typography>
                            <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'flex-end' }}>
                                <Button onClick={() => setConfirmationModalOpen(false)} sx={{ mr: 2 }}>Cancel</Button>
                                <Button variant="contained" color="error" onClick={confirmDelete}>Yes</Button>
                            </Box>
                        </Box>
                    </Modal>

                    {/* Add/Edit Mission Modal */}
                    {((selectedMission && action === 'edit') || action === 'add') && !confirmationModalOpen && (
                        <AddEditMission mission={selectedMission} onClose={() => { setSelectedMission(null); setAction('view') }} onModifyWaypoints={handleModifyWaypoints} />
                    )}
                </Box>

            )}
        </Box>
    )
}