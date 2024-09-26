import React from 'react';
import { Modal, Box, Typography } from '@mui/material';

export default function MissionModal({ drone, onClose }) {
  return (
    <Modal open={true} onClose={onClose}>
      <Box sx={{ width: 400, padding: 3, backgroundColor: '#fff', margin: 'auto', marginTop: '5%' }}>
        <Typography variant="h6">Mission for Drone {drone.drone_id}</Typography>
        <Typography variant="body1">Mission Type: {drone.mission_type}</Typography>
        <Typography variant="body1">Location: {drone.mission_locations}</Typography>
        <Typography variant="body1">Status: {drone.mission_status}</Typography>
        {/* Add other mission details as needed */}
      </Box>
    </Modal>
  );
}
