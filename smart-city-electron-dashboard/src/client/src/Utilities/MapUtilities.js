import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactDOMServer from 'react-dom/server';
import 'leaflet/dist/leaflet.css';
import IoTIcon from '@mui/icons-material/Sensors';
import { Box, Typography } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';

export const createDroneIcon = (status) => {
    let color;

    switch (status) {
        case 'Active':
            color = '#4caf50'; // Green for Active
            break;
        case 'Stopped':
            color = '#f44336'; // Red for Stopped
            break;
        case 'Repair':
            color = '#ff9800'; // Orange for Repair
            break;
        default:
            color = '#9e9e9e'; // Grey for Unknown/Other status
            break;
    }

    try {
        const droneIconSVG = (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={color}>
                <title>quadcopter</title>
                <path d="M5.5,1C8,1 10,3 10,5.5C10,6.38 9.75,7.2 9.31,7.9L9.41,8H14.59L14.69,7.9C14.25,7.2 14,6.38 14,5.5C14,3 16,1 18.5,1C21,1 23,3 23,5.5C23,8 21,10 18.5,10C17.62,10 16.8,9.75 16.1,9.31L15,10.41V13.59L16.1,14.69C16.8,14.25 17.62,14 18.5,14C21,14 23,16 23,18.5C23,21 21,23 18.5,23C16,23 14,21 14,18.5C14,17.62 14.25,16.8 14.69,16.1L14.59,16H9.41L9.31,16.1C9.75,16.8 10,17.62 10,18.5C10,21 8,23 5.5,23C3,23 1,21 1,18.5C1,16 3,14 5.5,14C6.38,14 7.2,14.25 7.9,14.69L9,13.59V10.41L7.9,9.31C7.2,9.75 6.38,10 5.5,10C3,10 1,8 1,5.5C1,3 3,1 5.5,1M5.5,3A2.5,2.5 0 0,0 3,5.5A2.5,2.5 0 0,0 5.5,8A2.5,2.5 0 0,0 8,5.5A2.5,2.5 0 0,0 5.5,3M5.5,16A2.5,2.5 0 0,0 3,18.5A2.5,2.5 0 0,0 5.5,21A2.5,2.5 0 0,0 8,18.5A2.5,2.5 0 0,0 5.5,16M18.5,3A2.5,2.5 0 0,0 16,5.5A2.5,2.5 0 0,0 18.5,8A2.5,2.5 0 0,0 21,5.5A2.5,2.5 0 0,0 18.5,3M18.5,16A2.5,2.5 0 0,0 16,18.5A2.5,2.5 0 0,0 18.5,21A2.5,2.5 0 0,0 21,18.5A2.5,2.5 0 0,0 18.5,16M3.91,17.25L5.04,17.91C5.17,17.81 5.33,17.75 5.5,17.75A0.75,0.75 0 0,1 6.25,18.5L6.24,18.6L7.37,19.25L7.09,19.75L5.96,19.09C5.83,19.19 5.67,19.25 5.5,19.25A0.75,0.75 0 0,1 4.75,18.5L4.76,18.4L3.63,17.75L3.91,17.25M3.63,6.25L4.76,5.6L4.75,5.5A0.75,0.75 0 0,1 5.5,4.75C5.67,4.75 5.83,4.81 5.96,4.91L7.09,4.25L7.37,4.75L6.24,5.4L6.25,5.5A0.75,0.75 0 0,1 5.5,6.25C5.33,6.25 5.17,6.19 5.04,6.09L3.91,6.75L3.63,6.25M16.91,4.25L18.04,4.91C18.17,4.81 18.33,4.75 18.5,4.75A0.75,0.75 0 0,1 19.25,5.5L19.24,5.6L20.37,6.25L20.09,6.75L18.96,6.09C18.83,6.19 18.67,6.25 18.5,6.25A0.75,0.75 0 0,1 17.75,5.5L17.76,5.4L16.63,4.75L16.91,4.25M16.63,19.25L17.75,18.5A0.75,0.75 0 0,1 18.5,17.75C18.67,17.75 18.83,17.81 18.96,17.91L20.09,17.25L20.37,17.75L19.25,18.5A0.75,0.75 0 0,1 18.5,19.25C18.33,19.25 18.17,19.19 18.04,19.09L16.91,19.75L16.63,19.25Z" />
            </svg>
        );

        const iconHTML = renderToStaticMarkup(droneIconSVG);

        return L.divIcon({
            html: iconHTML,
            className: 'custom-drone-icon',
            iconSize: [40, 40],
            iconAnchor: [20, 20], // Adjusted anchor point for better positioning
        });
    } catch (error) {
        console.error('Error creating drone icon:', error);
        throw error;
    }
};


export const get_marker_color = (jam) => {
    if (jam > 3.0) {
        return '#ff0000'; // Red (high jam)
    } else if (jam > 1.5 && jam <= 3.0) {
        return '#ffff00'; // Yellow (medium jam)
    } else {
        return '#00ff00'; // Green (low jam)
    }
};

// Function to create custom IoT icons based on Jam Factor
export const createIoTIcon = (jam) => {
    const color = get_marker_color(jam);
    const iconHTML = ReactDOMServer.renderToString(<IoTIcon style={{ color: color, fontSize: '2rem' }} />);
    return L.divIcon({
        html: iconHTML,
        className: 'custom-iot-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
    });
};

export const legend = () => {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, color: "#fff" }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ backgroundColor: '#ff9800', width: '15px', height: '15px', marginRight: '5px' }}></div>
                <Typography variant="h5">Planned</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ backgroundColor: '#4caf50', width: '15px', height: '15px', marginRight: '5px' }}></div>
                <Typography variant="h5">Completed</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ backgroundColor: '#f44336', width: '15px', height: '15px', marginRight: '5px' }}></div>
                <Typography variant="h5">Failed</Typography>
            </Box>
        </Box>
    )
}

export const getStatusIcon = (inService) => {
    let color;
    switch (inService) {
        case true:
            color = '#00FF00'; // Active
            break;
        case false:
            color = '#FF0000'; // Inactive
            break;
        default:
            color = '#CCCCCC';
    }

    return new L.divIcon({
        html: ReactDOMServer.renderToString(
            <VideocamIcon style={{ fontSize: '24px', color: color }} />
        ),
        className: '',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12],
    });
};

export const handleCCTVMarkerClick = (camera) => {
    if (camera.city === "Alameda") {
        return "/videos/Emeryville.mov";
    } else if (camera.city === "San Francisco") {
        return "/videos/SanFrancisco.mp4";
    } else {
        return "";
    }
};
