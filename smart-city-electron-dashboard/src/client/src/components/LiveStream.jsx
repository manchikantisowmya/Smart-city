import React from 'react';
import { Box, Typography } from '@mui/material';

export default function LiveStream() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: 0 }}>
      <Box sx={{ width: '80%', textAlign: 'center', paddingTop: 0 }}>
        {/* Reduced the margin and padding */}
        <Typography variant="h6" color="primary" sx={{ margin: 0, paddingTop: '10px', paddingBottom: '5px' }}>
          Live Stream Traffic Map
        </Typography>
        <iframe
          src="https://cwwp2.dot.ca.gov/vm/iframemap.htm"
          style={{ height: '60vh', width: '100%', border: 'none' }}
          title="Live Stream Traffic Map"
        />
      </Box>
    </Box>
  );
}
