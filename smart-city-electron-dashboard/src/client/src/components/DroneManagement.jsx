import React, { useState, useEffect } from 'react';
import { Box, Button, Table, Grid, TableBody, TableCell, TableHead, TableRow, Modal, Typography, TextField, Tabs, Tab, AppBar } from '@mui/material';
import axios from 'axios';
import config from '../config.json';
import Missions from './Missions.jsx';
import Skydio2Image from '../Images/dronecat/Skydio2.jpg';
import AnafiImage from '../Images/dronecat/Anafi.jpg';
import ADJIPhantom4ProV2Image from '../Images/dronecat/DJIPhantom4ProV20.png';
import EVOIIImage from '../Images/dronecat/EVOII.jpg';
import FreeFlyAltaXImage from '../Images/dronecat/FreeFlyAltaX.jpg';
import MavicAir2Image from '../Images/dronecat/MavicAir2.jpg';
import PowerVisionPowerEggXImage from '../Images/dronecat/PowerVisionPowerEggX.jpg';
import DJIInspire2Image from '../Images/dronecat/DJIInspire2.jpeg';
import AutelRoboticsDragonfishImage from '../Images/dronecat/AutelRoboticsDragonfish.jpg';
import YuneecTyphoonHPlusImage from '../Images/dronecat/YuneecTyphoonHPlus.jpg';

const tabStyle = (isSelected) => ({
  backgroundColor: isSelected ? '#66bb6a' : '#120639', // Green when selected, dark when not
  color: '#fff',
  padding: '2.5px',
  border: '1px solid #999',
  borderBottom: isSelected ? 'none' : '1px solid #999',
  // borderTop: '1px solid #999',
  cursor: 'pointer',
  textAlign: 'center',
});

export default function DroneManagement() {
  const [drones, setDrones] = useState([]);
  const [selectedDrone, setSelectedDrone] = useState(null);
  const [isMissionModalOpen, setIsMissionModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [droneToDelete, setDroneToDelete] = useState(null);
  const [confirmationInput, setConfirmationInput] = useState('');
  const [selectedAction, setSelectedAction] = useState('view');
  const [selectedSection, setSelectedSection] = useState('Drones');
  const [isAddDroneModalOpen, setIsAddDroneModalOpen] = useState(false);
  const [newDroneData, setNewDroneData] = useState({
    drone_id: '',
    name: '',
    model: '',
    type: '',
    manufacturer: '',
    description: '',
    price: '',
    weight: '',
    dimensions: {
      range: '',
      max_speed: '',
      battery_life: '',
    },
    lidar: false,
    last_known_lat: '',
    last_known_lon: '',
    last_known_status: '',
    battery_capacity: '',
  });

  const env = process.env.NODE_ENV || 'development';
  const BASE_URL = config[env].BASE_URL;
  const droneImageMapping = {
    "Skydio 2": Skydio2Image,
    "Anafi": AnafiImage,
    "DJI Phantom 4 Pro V2.0": ADJIPhantom4ProV2Image,
    "EVO II": EVOIIImage,
    "FreeFly Alta X": FreeFlyAltaXImage,
    "Mavic Air 2": MavicAir2Image,
    "PowerVision PowerEgg X": PowerVisionPowerEggXImage,
    "DJI Inspire 2": DJIInspire2Image,
    "Autel Robotics Dragonfish": AutelRoboticsDragonfishImage,
    "Yuneec Typhoon H Plus": YuneecTyphoonHPlusImage
  };

  useEffect(() => {
    const fetchDrones = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/drones`);
        setDrones(response.data);
      } catch (error) {
        console.error("Error fetching drones:", error);
      }
    };
    fetchDrones();
  }, []);
  const handleMissionCheck = (drone) => {
    setSelectedDrone(drone);
    setIsMissionModalOpen(true);
  };
  //  const handleAddDrone = () => {
  //     setIsAddDroneModalOpen(true);
  //   };
  const handleAddDrone = () => {
    setSelectedAction('add');  // Set action to 'add'
    setIsAddDroneModalOpen(true);  // Open the modal
  };

  const handleDeleteDrone = async () => {
    if (droneToDelete) {
      try {
        await axios.delete(`${BASE_URL}/drone/${droneToDelete.id}`);
        setDrones(drones.filter((drone) => drone.id !== droneToDelete.id));
        setIsConfirmModalOpen(false);
        setDroneToDelete(null);
        setConfirmationInput('');
      } catch (error) {
        console.error('Error deleting drone:', error);
      }
    }
  };

  const handleAddDroneSubmit = async () => {
    try {
      await axios.post(`${BASE_URL}/drone`, newDroneData);  // Send the form data to the server
      setDrones([...drones, newDroneData]);  // Optionally update the state with the new drone
      setIsAddDroneModalOpen(false);  // Close the modal
    } catch (error) {
      console.error('Error adding new drone:', error);
    }
  };



  const handleClose = () => {
    setIsMissionModalOpen(false);
    setSelectedDrone(null);
  };
  const handleOpenConfirmModal = (drone) => {
    setDroneToDelete(drone);
    setIsConfirmModalOpen(true);
  };

  const handleAddDroneModalClose = () => {
    setIsAddDroneModalOpen(false);
  };

  const handleCloseConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setDroneToDelete(null);
    setConfirmationInput('');
  };

  const isConfirmationValid = confirmationInput === (droneToDelete ? droneToDelete.name : '');

  // Function to render the Drones section
  const renderDronesSection = () => (
    <Box sx={{ maxHeight: '100vh', overflowY: 'auto' }}>
      <Button variant="contained" onClick={() => setSelectedAction('view')} sx={{ mb: 2 }}>
        View Drones
      </Button>
      &nbsp
      <Button
        variant="contained"
        // onClick={() => setSelectedAction('add')}
        onClick={handleAddDrone}  // Use the updated function

        sx={{ mb: 2 }}
      >
        Add Drone
      </Button>
      {selectedAction === 'view' && (
        <Table sx={{ border: '2px solid white' }} stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'white', backgroundColor: '#333', border: '1px solid white' }}>Name</TableCell>
              <TableCell sx={{ color: 'white', backgroundColor: '#333', border: '1px solid white' }}>Type</TableCell>
              <TableCell sx={{ color: 'white', backgroundColor: '#333', border: '1px solid white' }}>Manufacturer</TableCell>
              <TableCell sx={{ color: 'white', backgroundColor: '#333', border: '1px solid white' }}>Price</TableCell>
              <TableCell sx={{ color: 'white', backgroundColor: '#333', border: '1px solid white' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {drones.map((drone) => (
              <TableRow key={drone.id}>
                <TableCell sx={{ color: 'white', border: '1px solid white' }}>{drone.name}</TableCell>
                <TableCell sx={{ color: 'white', border: '1px solid white' }}>{drone.type}</TableCell>
                <TableCell sx={{ color: 'white', border: '1px solid white' }}>{drone.manufacturer}</TableCell>
                <TableCell sx={{ color: 'white', border: '1px solid white' }}>{drone.price}</TableCell>
                <TableCell sx={{ color: 'white', border: '1px solid white' }}>
                  <Button onClick={() => handleMissionCheck(drone)}>View</Button>
                  <Button onClick={() => handleOpenConfirmModal(drone)} color="error">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Box>
  );

  const renderMissionsSection = () => (
    <Missions />
  );

  return (
    <Box sx={{ mt: 0 }}>
      <AppBar position="static" sx={{ backgroundColor: '#120639', padding: 0, boxShadow: 'none' }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
          {/* Section Tabs */}
          <Box sx={{ flex: 1 }}
            onClick={() => setSelectedSection('Drones')}
            style={tabStyle(selectedSection === 'Drones')}
          >
            Drones
          </Box>
          <Box sx={{ flex: 1 }}
            onClick={() => setSelectedSection('Missions')}
            style={tabStyle(selectedSection === 'Missions')}>
            Missions
          </Box>
        </Box>
      </AppBar>
      {selectedSection === 'Drones' && renderDronesSection()}
      {selectedSection === 'Missions' && renderMissionsSection()}
      {droneToDelete && (
        <Modal open={isConfirmModalOpen} onClose={handleCloseConfirmModal}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 500,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4
          }}>
            <Typography variant="h6">Delete Drone</Typography>
            <Typography>
              Are you sure you want to delete the drone "<strong>{droneToDelete.name}</strong>"?
            </Typography>
            <Typography sx={{ mt: 2 }}>
              Type "<strong>{droneToDelete.name}</strong>" to confirm:
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              value={confirmationInput}
              onChange={(e) => setConfirmationInput(e.target.value)}
              sx={{ mt: 2 }}
            />
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={handleCloseConfirmModal} sx={{ mr: 2 }}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleDeleteDrone}
                disabled={!isConfirmationValid}
              >
                Delete Drone
              </Button>
            </Box>
          </Box>
        </Modal>
      )
      }

      {/* Modal for Drone Details */}
      {selectedDrone && (
        <Modal
          open={isMissionModalOpen}
          onClose={handleClose}
          aria-labelledby="drone-details-title"
          aria-describedby="drone-details-description"
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4
          }}>
            <Typography id="drone-details-title" variant="h6" component="h2">
              {selectedDrone.name}
            </Typography>
            <img
              src={droneImageMapping[selectedDrone.name] || '/path/to/default-image.jpg'}
              alt={selectedDrone.name}
              width="100%"
              height="300px"
            />
            <Typography id="drone-details-description" sx={{ mt: 2 }}>
              <strong>Type:</strong> {selectedDrone.type}<br />
              <strong>Manufacturer:</strong> {selectedDrone.manufacturer}<br />
              <strong>Price($):</strong> {selectedDrone.price}<br />
              <strong>Description:</strong> {selectedDrone.description}<br />
              <strong>Lidar:</strong> {selectedDrone.lidar ? 'Yes' : 'No'}<br />
              <strong>Battery Life:</strong> {selectedDrone.dimensions?.battery_life} hrs<br />
              <strong>Range:</strong> {selectedDrone.dimensions?.range} miles<br />
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleClose}
              sx={{ mt: 2 }}
            >
              Close
            </Button>
          </Box>
        </Modal>
      )}

      {isAddDroneModalOpen && (
        <Box
          sx={{
            borderRadius: '8px',
            p: 4,
            color: 'white',
            boxShadow: 3,
            maxHeight: '80vh',  // Adjust maxHeight as needed
            overflowY: 'auto',  // Adds vertical scroll
            width: '100%',
            maxWidth: '100%',  // Adjust as per your requirement
            mx: 'auto',
            marginTop: '-4%',   // Centers the box horizontally
          }}
        >
          <Typography variant="h5" component="h2" gutterBottom sx={{ color: 'white', textAlign: 'center' }}>
            Add New Drone
          </Typography>

          <Grid container spacing={2}>
            {/* Left Column Fields */}
            <Grid item xs={12} sm={4}>
              <TextField
                label="Drone ID"
                name="drone_id"
                fullWidth
                sx={{ mt: 3, input: { color: 'white' }, label: { color: 'white' }, bgcolor: '#424242', borderRadius: '4px', px: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Name"
                name="name"
                fullWidth
                sx={{ mt: 3, input: { color: 'white' }, label: { color: 'white' }, bgcolor: '#424242', borderRadius: '4px', px: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Model"
                name="model"
                fullWidth
                sx={{ mt: 3, input: { color: 'white' }, label: { color: 'white' }, bgcolor: '#424242', borderRadius: '4px', px: 1 }}
              />
            </Grid>

            {/* Middle Column Fields */}
            <Grid item xs={12} sm={4}>
              <TextField
                label="Type"
                name="type"
                fullWidth
                sx={{ mt: 3, input: { color: 'white' }, label: { color: 'white' }, bgcolor: '#424242', borderRadius: '4px', px: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Manufacturer"
                name="manufacturer"
                fullWidth
                sx={{ mt: 3, input: { color: 'white' }, label: { color: 'white' }, bgcolor: '#424242', borderRadius: '4px', px: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Description"
                name="description"
                fullWidth
                sx={{ mt: 3, input: { color: 'white' }, label: { color: 'white' }, bgcolor: '#424242', borderRadius: '4px', px: 1 }}
              />
            </Grid>

            {/* Other Fields */}
            <Grid item xs={12} sm={4}>
              <TextField
                label="Price"
                name="price"
                fullWidth
                sx={{ mt: 3, input: { color: 'white' }, label: { color: 'white' }, bgcolor: '#424242', borderRadius: '4px', px: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Weight"
                name="weight"
                fullWidth
                sx={{ mt: 3, input: { color: 'white' }, label: { color: 'white' }, bgcolor: '#424242', borderRadius: '4px', px: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Range"
                name="range"
                fullWidth
                sx={{ mt: 3, input: { color: 'white' }, label: { color: 'white' }, bgcolor: '#424242', borderRadius: '4px', px: 1 }}
              />
            </Grid>

            {/* Additional Fields */}
            <Grid item xs={12} sm={4}>
              <TextField
                label="Max Speed"
                name="max_speed"
                fullWidth
                sx={{ mt: 3, input: { color: 'white' }, label: { color: 'white' }, bgcolor: '#424242', borderRadius: '4px', px: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Battery Life"
                name="battery_life"
                fullWidth
                sx={{ mt: 3, input: { color: 'white' }, label: { color: 'white' }, bgcolor: '#424242', borderRadius: '4px', px: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Battery Capacity"
                name="battery_capacity"
                fullWidth
                sx={{ mt: 3, input: { color: 'white' }, label: { color: 'white' }, bgcolor: '#424242', borderRadius: '4px', px: 1 }}
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3, py: 2, fontSize: '18px' }}
                onClick={handleAddDroneSubmit}  // Add this line
              >
                More to add
              </Button>
            </Grid>
          </Grid>
        </Box>
      )
      }
    </Box >
  );
}
