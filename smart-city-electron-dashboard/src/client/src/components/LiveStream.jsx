import React, { useState } from 'react';
import { Box, Typography, IconButton, Tooltip, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import LinkIcon from '@mui/icons-material/Link';

export default function LiveStream() {
  const [mapSrc, setMapSrc] = useState('https://cwwp2.dot.ca.gov/vm/iframemap.htm');

  // Function to refresh the iframe content
  const refreshMap = () => {
    setMapSrc(mapSrc); // This will reload the iframe by resetting the src
  };

  // Function to open the map in fullscreen (new tab)
  const openFullScreen = () => {
    window.open(mapSrc, '_blank');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 0, marginTop: '-10px' }}>
      <Box
        sx={{
          width: '80%',
          textAlign: 'center',
          padding: 0,
          marginTop: '20px',
          backgroundColor: '#222',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
        }}
      >
        {/* Map Title */}
        <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold', padding: '10px 0' }}>
          Live Stream Traffic Map
        </Typography>

        {/* Map Container with Toolbar for Refresh, Fullscreen, and External Link */}
        <Box sx={{ position: 'relative', textAlign: 'center', padding: '10px' }}>
          {/* Toolbar for Refresh, Fullscreen, and Original Site Link */}
          <Box sx={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '8px' }}>
            <Tooltip title="Refresh Map">
              <IconButton onClick={refreshMap} color="primary" size="small">
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Fullscreen Map">
              <IconButton onClick={openFullScreen} color="primary" size="small">
                <FullscreenIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Open Original Traffic Site">
              <IconButton onClick={() => window.open('https://cwwp2.dot.ca.gov/vm/iframemap.htm', '_blank')} color="primary" size="small">
                <LinkIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {/* iFrame Map */}
          <iframe
            id="trafficMap"
            src={mapSrc}
            style={{
              height: '70vh',
              width: '100%',
              border: '1px solid #444',
              borderRadius: '8px',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
            }}
            title="Live Stream Traffic Map"
          />
        </Box>
      </Box>
    </Box>
  );
}
