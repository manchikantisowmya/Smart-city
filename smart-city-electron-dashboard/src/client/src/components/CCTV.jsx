import React, { useState } from 'react';
import { AppBar, Box } from '@mui/material';
import CCTVMonitoring from './CCTVMonitoring';
import LiveStream from './LiveStream';

const tabStyle = (isSelected) => ({
  backgroundColor: isSelected ? '#66bb6a' : '#120639', // Green when selected, dark when not
  color: '#fff',
  padding: '2.5px',
  border: '1px solid #999',
  borderBottom: isSelected ? 'none' : '1px solid #999', // No border at the bottom for selected
  cursor: 'pointer',
  textAlign: 'center',
});

export default function CCTV() {
  const [selectedSection, setSelectedSection] = useState('CCTV Monitoring');

  const renderContent = () => {
    switch (selectedSection) {
      case 'CCTV Monitoring':
        return <CCTVMonitoring />;
      case 'Live Stream':
        return <LiveStream />;
      default:
        return <CCTVMonitoring />;
    }
  };

  return (
    <Box sx={{ flexGrow: 1, height: '85vh' }}>
      {/* Top Navigation Bar */}
      <AppBar position="static" sx={{ backgroundColor: '#120639', padding: 0, boxShadow: 'none' }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
          {/* Section Tabs */}
          <Box
            sx={{ flex: 1 }}
            onClick={() => setSelectedSection('CCTV Monitoring')}
            style={tabStyle(selectedSection === 'CCTV Monitoring')}
          >
            CCTV Monitoring
          </Box>
          <Box
            sx={{ flex: 1 }}
            onClick={() => setSelectedSection('Live Stream')}
            style={tabStyle(selectedSection === 'Live Stream')}
          >
            Live Stream
          </Box>
        </Box>
      </AppBar>

      {/* Render the selected section content */}
      <Box sx={{ padding: 2 }}>{renderContent()}</Box>
    </Box>
  );
}