import React from 'react';
import { Box, Typography } from '@mui/material';

export default function LiveStream() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', height: '100vh', padding: 0, margin: 0 }}>
      <Box sx={{ width: { xs: '100%', md: '80%' }, textAlign: 'center', paddingTop: 0, marginTop: 0 }}>
        {/* Reduced the margin and padding on Typography */}
        <Typography variant="h6" color="primary" sx={{ margin: 0, padding: 0, paddingTop: '10px' }}>
          Live Stream Traffic Map
        </Typography>
        
        <iframe
          src="https://cwwp2.dot.ca.gov/vm/iframemap.htm"
          style={{
            height: '60vh',
            width: '100%',
            border: 'none',
            margin: 0,
            padding: 0
          }}
          title="Live Stream Traffic Map"
        />
      </Box>
    </Box>
  );
}
