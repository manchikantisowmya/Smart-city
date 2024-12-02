import React, { useState } from 'react';
import { AppBar, Box } from '@mui/material';
import CCTVMonitoring from './CCTVMonitoring';
import LiveStream from './LiveStream';
import CCTVAlertsNotifications from './CCTVAlertsNotifications'; // Import the Alerts & Notifications component

const tabStyle = (isSelected) => ({
  backgroundColor: isSelected ? '#66bb6a' : '#120639', // Green when selected, dark when not
  color: '#fff',
  padding: '2.5px',
  border: '1px solid #999',
  borderBottom: isSelected ? 'none' : '1px solid #999', // No border at the bottom for selected
  cursor: 'pointer',
  textAlign: 'center',
  outline: 'none', // Remove focus outline for better visuals
});

export default function CCTV() {
  const [selectedSection, setSelectedSection] = useState('CCTV Monitoring'); // Default section

  const renderContent = () => {
    switch (selectedSection) {
      case 'CCTV Monitoring':
        return <CCTVMonitoring />;
      case 'Live Stream':
        return <LiveStream />;
      case 'Alerts & Notifications':
        return <CCTVAlertsNotifications />;
      default:
        console.error(`Unhandled section: ${selectedSection}`);
        return <div>Error: Unhandled section</div>; // Fallback UI
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
            onKeyDown={(e) => e.key === 'Enter' && setSelectedSection('CCTV Monitoring')} // Handle keyboard navigation
            style={tabStyle(selectedSection === 'CCTV Monitoring')}
            tabIndex={0} // Enable tab navigation
          >
            CCTV Monitoring
          </Box>
          <Box
            sx={{ flex: 1 }}
            onClick={() => setSelectedSection('Live Stream')}
            onKeyDown={(e) => e.key === 'Enter' && setSelectedSection('Live Stream')}
            style={tabStyle(selectedSection === 'Live Stream')}
            tabIndex={0}
          >
            Live Stream
          </Box>
          <Box
            sx={{ flex: 1 }}
            onClick={() => setSelectedSection('Alerts & Notifications')}
            onKeyDown={(e) => e.key === 'Enter' && setSelectedSection('Alerts & Notifications')}
            style={tabStyle(selectedSection === 'Alerts & Notifications')}
            tabIndex={0}
          >
            Alerts & Notifications
          </Box>
        </Box>
      </AppBar>

      {/* Render the selected section content */}
      <Box sx={{ padding: 2 }}>{renderContent()}</Box>
    </Box>
  );
}
