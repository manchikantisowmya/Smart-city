import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography, Button } from '@mui/material';
import Map from './Map';  // Assuming a Map component
import MissionModal from './MissionModal';  // Assuming a Mission Modal for mission view
import ScheduleMission from './ScheduleMission.jsx';  // Scheduling section

export default function DroneManagement() {
  const [drones, setDrones] = useState([]);
  const [selectedDrone, setSelectedDrone] = useState(null);
  const [isMissionModalOpen, setIsMissionModalOpen] = useState(false);

  useEffect(() => {
    // Fetch the list of drones from API
    const fetchDrones = async () => {
      try {
        const response = await fetch('/api/drones'); 
        const data = await response.json();
        setDrones(data);
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

  return (
    <Box sx={{ display: 'flex', padding: 2 }}>
      {/* Left side panel with drones */}
      <Grid container spacing={2} sx={{ width: '30%' }}>
        {drones.map((drone) => (
          <Grid item key={drone.drone_id} xs={12}>
            <Card sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <CardContent>
                <Typography variant="h6">{drone.drone_id}</Typography>
                <Typography variant="subtitle1">Lat: {drone.lat}</Typography>
                <Typography variant="subtitle1">Long: {drone.lng}</Typography>
              </CardContent>
              <Button onClick={() => handleMissionCheck(drone)} variant="contained" color="primary">
                Check Mission
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Right side live map */}
      <Box sx={{ width: '70%', ml: 2 }}>
        <Map drones={drones} /> {/* Assuming the Map component will handle displaying drones */}
      </Box>

      {/* Mission Modal */}
      {isMissionModalOpen && selectedDrone && (
        <MissionModal drone={selectedDrone} onClose={() => setIsMissionModalOpen(false)} />
      )}

      {/* Schedule Mission Section */}
      <ScheduleMission />
    </Box>
  );
}
