// import React, { useState, useEffect } from 'react';
// import { Box, Button, TextField, Typography, MenuItem, Modal, FormControl, InputLabel, Select } from '@mui/material';
// import { getDroneStations } from '../api/drone'; // Ensure you have an API to get available drones
// const { v4: uuidv4 } = require('uuid');

// const AddEditMission = ({ mission, onClose, onModifyWaypoints }) => {
//     const [droneStations, setDroneStations] = useState([]);

//     const [missionData, setMissionData] = useState({
//         _id: '',
//         mission_id: '',
//         mission_name: '',
//         drone_station_id: '',
//         mission_type: '',
//         mission_description: '',
//         mission_start_time: '',
//         mission_end_time: '',
//         user_id: '',
//         mission_waypoints: []
//     });
//     const MISSION_TYPES = [
//         "Campus Perimeter Patrol",
//         "Crowd Monitoring",
//         "Building Inspection",
//         "Emergency response",
//         "Parking Lot Surveillance",
//         "Fire Monitoring",
//         "Agriculture",
//         "Traffic Control",
//         "Infrastructure Inspection",
//         "Powerline Inspection",
//         "Search and Rescue",
//         "Industrial Site Monitoring",
//     ];


//     useEffect(() => {
//         if (mission) {
//             setMissionData({
//                 _id: mission._id,
//                 mission_id: mission.mission_id,
//                 mission_name: mission.mission_location,
//                 mission_type: mission.mission_type,
//                 mission_description: mission.mission_description,
//                 drone_station_id: mission.drone_station_id,
//                 mission_start_time: mission.mission_start_time,
//                 mission_end_time: mission.mission_end_time,
//                 user_id: mission.user_id,
//                 mission_waypoints: mission.mission_waypoints
//             });
//         }
//         else {
//             const userdetails = JSON.parse(window.localStorage.userData);
//             setMissionData({
//                 _id: uuidv4(), mission_id: '',
//                 mission_name: '',
//                 drone_station_id: '',
//                 mission_type: '',
//                 mission_description: '',
//                 mission_start_time: '',
//                 mission_end_time: '',
//                 user_id: userdetails.user.email,
//                 mission_waypoints: []
//             });
//         }

//         const fetchDroneStations = async () => {
//             const stations = await getDroneStations();
//             setDroneStations(stations);
//         };

//         fetchDroneStations();
//     }, [mission]);

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setMissionData({ ...missionData, [name]: value });
//     };

//     const handleSubmit = () => {
//         onClose(); // Close the modal after submission
//         onModifyWaypoints(missionData);
//     };

//     return (
//         <Modal open={Boolean(missionData)} onClose={onClose}>
//             <Box sx={{
//                 position: 'absolute',
//                 top: '50%',
//                 left: '50%',
//                 transform: 'translate(-50%, -50%)',
//                 width: 400,
//                 bgcolor: 'background.paper',
//                 border: '2px solid #000',
//                 boxShadow: 24,
//                 p: 4,
//                 borderRadius: 2,
//             }}>
//                 <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
//                     {mission ? `Modify Mission - ${mission?.mission_id}` : 'Add Mission'}
//                 </Typography>
//                 <TextField
//                     fullWidth name='id'
//                     label="Mission ID"
//                     value={missionData._id}
//                     disabled
//                     sx={{ mb: 2 }}
//                 />
//                 <TextField
//                     fullWidth name='mission_id'
//                     label="Mission Name" onChange={handleInputChange}
//                     value={missionData.mission_id}
//                     disabled={!!mission}
//                     sx={{ mb: 2 }}
//                 />
//                 <TextField multiline rows={3}
//                     fullWidth name="mission_description"
//                     label="Mission Description" onChange={handleInputChange}
//                     value={missionData.mission_description}
//                     sx={{ mb: 2 }}
//                 />
//                 <TextField
//                     fullWidth
//                     select
//                     label="Mission Type"
//                     name="mission_type"
//                     value={missionData.mission_type}
//                     onChange={handleInputChange}
//                     sx={{ mb: 2 }}
//                 >
//                     {MISSION_TYPES.map((type) => (
//                         <MenuItem key={type} value={type}>
//                             {type}
//                         </MenuItem>
//                     ))}
//                 </TextField>

//                 <TextField
//                     fullWidth
//                     select
//                     label="Drone Station"
//                     name="drone_station_id"
//                     value={missionData.drone_station_id}
//                     onChange={handleInputChange}
//                     sx={{ mb: 2 }} SelectProps={{
//                         MenuProps: {
//                             PaperProps: {
//                                 style: {
//                                     maxHeight: 150,
//                                     backgroundColor: '#fff',
//                                     overflow: 'auto',
//                                 },
//                             },
//                         },
//                     }}
//                 >
//                     {droneStations.map((station) => (
//                         <MenuItem key={station.station_id} value={station.station_id}>
//                             {station.station_id}
//                         </MenuItem>
//                     ))}
//                 </TextField>

//                 <TextField
//                     fullWidth
//                     label="Start Date and Time (PST)"
//                     type="datetime-local"
//                     name="mission_start_time"
//                     value={missionData.mission_start_time?.substring(0, 16)}
//                     onChange={handleInputChange}
//                     sx={{ mb: 2 }} InputLabelProps={{ shrink: true }}
//                 />
//                 <TextField
//                     fullWidth
//                     label="End Date and Time (PST)"
//                     type="datetime-local"
//                     name="mission_end_time"
//                     value={missionData.mission_end_time?.substring(0, 16)}
//                     onChange={handleInputChange}
//                     sx={{ mb: 2 }} InputLabelProps={{ shrink: true }}
//                 />
//                 <Button variant="contained" onClick={handleSubmit} sx={{ mr: 2 }}>
//                     Modify Waypoints
//                 </Button>
//                 <Button variant="outlined" onClick={onClose}>
//                     Cancel
//                 </Button>
//             </Box>
//         </Modal>
//     );
// };

// export default AddEditMission;

import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, MenuItem, Modal } from '@mui/material';
import { getDroneStations, getLastMissionID, getDrones } from '../api/drone'; // Ensure you have an API to get available drones and the last mission ID
const { v4: uuidv4 } = require('uuid');

const AddEditMission = ({ mission, onClose, onModifyWaypoints }) => {
    const [droneStations, setDroneStations] = useState([]);
    const [droneId, setDroneId] = useState([]);

    const [missionData, setMissionData] = useState({
        _id: '',
        mission_id: '',
        drone_id:'',
        mission_name: '',
        drone_station_id: '',
        mission_type: '',
        mission_description: '',
        mission_start_time: '',
        mission_end_time: '',
        user_id: '',
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
        const initializeMissionData = async () => {
            if (mission) {
                setMissionData({
                    _id: mission._id,
                    mission_id: mission.mission_id,
                    drone_id: mission.drone_id,
                    mission_name: mission.mission_name,
                    drone_station_id: mission.drone_station_id,
                    mission_type: mission.mission_type,
                    mission_description: mission.mission_description,
                    mission_start_time: mission.mission_start_time,
                    mission_end_time: mission.mission_end_time,
                    user_id: mission.user_id,
                    mission_waypoints: mission.mission_waypoints
                });
            } else {
                const userdetails = JSON.parse(window.localStorage.userData);
                const lastMissionID = await getLastMissionID(); // Fetch the last mission ID
                const nextMissionID = generateNextMissionID(lastMissionID); // Generate the next mission ID

                setMissionData({
                    _id: uuidv4(),
                    mission_id: nextMissionID,
                    drone_id:'',
                    mission_name: '',
                    drone_station_id: '',
                    mission_type: '',
                    mission_description: '',
                    mission_start_time: '',
                    mission_end_time: '',
                    user_id: userdetails.user.email,
                    mission_waypoints: []
                });
            }

            const stations = await getDroneStations();
            setDroneStations(stations);

            const drone_type = await getDrones();
            setDroneId(drone_type);
        };

        initializeMissionData();
    }, [mission]);

    const generateNextMissionID = (lastID) => {
        if (!lastID) return 'M001'; // Default to M001 if no previous mission ID exists
        const numericPart = parseInt(lastID.substring(1), 10); // Extract numeric part
        const nextNumericPart = numericPart + 1; // Increment the numeric part
        return `M${String(nextNumericPart).padStart(3, '0')}`; // Format with leading zeros
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMissionData({ ...missionData, [name]: value });
    };

    const handleSubmit = () => {
        onClose(); // Close the modal after submission
        onModifyWaypoints(missionData);
    };

    return (
        <Modal open={Boolean(missionData)} onClose={onClose}>
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
                    {mission ? `Modify Mission - ${mission?.mission_id}` : 'Add Mission'}
                </Typography>
                <TextField
                    fullWidth
                    name='id'
                    label="Mission ID"
                    value={missionData.mission_id}
                    disabled
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    name='mission_name'
                    label="Mission Name"
                    onChange={handleInputChange}
                    value={missionData.mission_name}
                    sx={{ mb: 2 }}
                />
                <TextField multiline rows={3}
                    fullWidth name="mission_description"
                    label="Mission Description"
                    onChange={handleInputChange}
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
                    label="Drone Type"
                    name="drone_id"
                    value={missionData.drone_id}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                >
                    {droneId.map((drone_type) => (
                        <MenuItem key={drone_type.drone_id} value={drone_type.drone_id}>
                            {drone_type.drone_id}
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
                    sx={{ mb: 2 }}
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
                    name="mission_start_time"
                    value={missionData.mission_start_time?.substring(0, 16)}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    fullWidth
                    label="End Date and Time (PST)"
                    type="datetime-local"
                    name="mission_end_time"
                    value={missionData.mission_end_time?.substring(0, 16)}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                    InputLabelProps={{ shrink: true }}
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
