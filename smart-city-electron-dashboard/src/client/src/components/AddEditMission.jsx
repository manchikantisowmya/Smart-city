import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, MenuItem, Modal, FormControl, InputLabel, Select } from '@mui/material';
import { getDroneStations } from '../api/drone'; // Ensure you have an API to get available drones

const AddEditMission = ({ mission, onClose, onModifyWaypoints }) => {
    const [droneStations, setDroneStations] = useState([]);

    const [missionData, setMissionData] = useState({
        mission_id: '',
        mission_name: '',
        drone_station_id: '',
        mission_type: '',
        mission_description: '',
        mission_start_time: '',
        mission_end_time: '',
        userid:'',
        mission_waypoints: []
    });
    const MISSION_TYPES = [
        "Campus Perimeter Patrol",
        "Crowd Monitoring",
        "Building Inspection",
        "Emergency response",
        "Parking Lot Surveillance",
        "Fire Monitoring",
        "Agriculture",
        "Traffic Control",
        "Infrastructure Inspection",
        "Powerline Inspection",
        "Search and Rescue",
        "Industrial Site Monitoring",
    ];


    useEffect(() => {
        if (mission) {
            setMissionData({
                _id: mission._id,
                mission_id: mission.mission_id,
                mission_name: mission.mission_location,
                mission_type: mission.mission_type,
                mission_description: mission.mission_description,
                drone_station_id: mission.drone_station_id,
                mission_start_time: mission.mission_start_time,
                mission_end_time: mission.mission_end_time,
                user_id:mission.user_id,
                mission_waypoints: mission.mission_waypoints
            });
        }


        const fetchDroneStations = async () => {
            const stations = await getDroneStations();
            setDroneStations(stations);
        };

        fetchDroneStations();
    }, [mission]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMissionData({ ...missionData, [name]: value });
    };

    const handleSubmit = () => {
        // Handle submit logic here (e.g., API call to save changes)
        console.log('Mission data submitted:', missionData);
        // You can also call an API to update the mission details.
        onClose(); // Close the modal after submission
        onModifyWaypoints(missionData);
    };

    return (
        <Modal open={Boolean(mission)} onClose={onClose}>
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
                borderRadius: 2,
            }}>
                <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                    Modify Mission - {mission?.mission_id}
                </Typography>
                <TextField
                    fullWidth
                    label="Mission ID"
                    value={missionData._id}
                    disabled
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    label="Mission Name"
                    value={missionData.mission_id}
                    disabled
                    sx={{ mb: 2 }}
                />
                <TextField multiline rows={3}
                    fullWidth
                    label="Mission Description"
                    value={missionData.mission_description}
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    select
                    label="Mission Type"
                    name="mission_type"
                    value={missionData.mission_type}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                >
                    {MISSION_TYPES.map((type) => (
                        <MenuItem key={type} value={type}>
                            {type}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    fullWidth
                    select
                    label="Drone Station"
                    name="drone_station_id"
                    value={missionData.drone_station_id}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }} SelectProps={{
                        MenuProps: {
                            PaperProps: {
                                style: {
                                    maxHeight: 150,
                                    backgroundColor: '#fff',
                                    overflow: 'auto',
                                },
                            },
                        },
                    }}
                >
                    {droneStations.map((station) => (
                        <MenuItem key={station.station_id} value={station.station_id}>
                            {station.station_id}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    fullWidth
                    label="Start Date and Time (PST)"
                    type="datetime-local"
                    name="start_time"
                    value={missionData.mission_start_time?.substring(0, 16)}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }} InputLabelProps={{ shrink: true }}
                />
                <TextField
                    fullWidth
                    label="End Date and Time (PST)"
                    type="datetime-local"
                    name="end_time"
                    value={missionData.mission_end_time?.substring(0, 16)}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }} InputLabelProps={{ shrink: true }}
                />
                <Button variant="contained" onClick={handleSubmit} sx={{ mr: 2 }}>
                    Modify Waypoints
                </Button>
                <Button variant="outlined" onClick={onClose}>
                    Cancel
                </Button>
            </Box>
        </Modal>
    );
};

export default AddEditMission;
