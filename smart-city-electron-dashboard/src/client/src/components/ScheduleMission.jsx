import React from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';

export default function ScheduleMission() {
  const handleSchedule = () => {
    // Schedule mission logic here
  };

  return (
    <Box sx={{ padding: 2, marginTop: 4 }}>
      <Typography variant="h6">Schedule Mission</Typography>
      <TextField label="Mission Name" fullWidth margin="normal" />
      <TextField label="Drone ID" fullWidth margin="normal" />
      <TextField label="Start Time" fullWidth margin="normal" />
      <TextField label="End Time" fullWidth margin="normal" />
      <Button onClick={handleSchedule} variant="contained" color="primary">Schedule</Button>
    </Box>
  );
}
