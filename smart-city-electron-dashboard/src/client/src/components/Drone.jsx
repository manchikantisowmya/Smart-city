import React, { useState } from 'react';
import { AppBar, Box } from '@mui/material';
import DroneMonitoring from './DroneMonitoring'; // Component for Drone Monitoring
import DroneManagement from './DroneManagement'; // Component for Drone Management
import AlertsNotifications from './AlertsNotifications'; // Component for Alerts & Notifications

const tabStyle = (isSelected) => ({
    backgroundColor: isSelected ? '#66bb6a' : '#120639', // Green when selected, dark when not
    color: '#fff',
    padding: '2.5px',
    border: '1px solid #999',
    borderBottom: isSelected ? 'none' : '1px solid #999', // No border at the bottom for selected
    cursor: 'pointer',
    textAlign: 'center',
});

export default function Drone() {
    const [selectedSection, setSelectedSection] = useState('Drone Monitoring');

    const renderContent = () => {
        switch (selectedSection) {
            case 'Drone Monitoring':
                return <DroneMonitoring />;
            case 'Drone Management':
                return <DroneManagement />;
            case 'Alerts & Notifications':
                return <AlertsNotifications />;
            default:
                return <DroneMonitoring />;
        }
    };

    return (
        <Box sx={{ flexGrow: 1, height:'100vh' }}>
            {/* Top Navigation Bar */}
            <AppBar position="static" sx={{ backgroundColor: '#120639', padding: 0, boxShadow: 'none' }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                    {/* Section Tabs */}
                    <Box sx={{ flex: 1 }} 
                        onClick={() => setSelectedSection('Drone Monitoring')}
                        style={tabStyle(selectedSection === 'Drone Monitoring')}
                    >
                        Drone Monitoring
                    </Box>
                    <Box sx={{ flex: 1 }} 
                        onClick={() => setSelectedSection('Drone Management')}
                        style={tabStyle(selectedSection === 'Drone Management')}>
                        Drone Management
                    </Box>
                    <Box sx={{ flex: 1 }} 
                        onClick={() => setSelectedSection('Alerts & Notifications')}
                        style={tabStyle(selectedSection === 'Alerts & Notifications')}
                    >
                        Alerts & Notifications
                    </Box>
                </Box>
            </AppBar>

            {/* Render the selected section content */}
            <Box sx={{ padding: 2 }}>
                {renderContent()}
            </Box>
        </Box>
    );
}