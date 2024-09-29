import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography } from '@mui/material';
import { Pie, Line } from 'react-chartjs-2';
import { getDashboardData } from '../api/dashboard/dashboard.js';
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import { FlightTakeoff, Person, Warning } from '@mui/icons-material';

// Register necessary Chart.js components
Chart.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDashboardData(); // Fetch data from the API
        setDashboardData(response);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  if (!dashboardData) {
    return <Typography>Loading...</Typography>; // Loading state
  }

  const { noOfDrones, noOfMissions, noOfUsers, noOfIncidents, droneStatus, missionsPerDay } = dashboardData;
  const statusColors = {
    'Active': '#4caf50',   // Green for Active
    'Stopped': '#f44336',  // Red for Stopped
    'Repair': '#ff9800'    // Orange for Repair
  };
  const pieData = {
    labels: droneStatus.map((status) => status._id),
    datasets: [
      {
        label: '# of Drones',
        data: droneStatus.map((status) => status.count),
        backgroundColor: droneStatus.map((status) => statusColors[status._id] || '#9e9e9e'),
      },
    ],
  };

  const lineData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Missions Per Day',
        data: missionsPerDay.map((mission) => mission.count),
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        borderColor: '#4caf50',
        fill: true,
      },
    ],
  };

  // Style for the card and chart backgrounds
  const cardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.25)', // Black with 16% opacity
    color: '#fff', // Ensure text color is white
    display: 'flex',
    flexDirection: 'column'
  };

  const typographyStyle = {
    fontSize: '1.3rem',
    color: '#B0E57C',
  };

  // Box background for the main layout
  const boxStyle = {
    backgroundColor: '#120639',
    minHeight: '100vh',
    padding: '20px',
    marginTop: '65px',
  };

  return (
    <Box sx={boxStyle}>
      <Grid container spacing={2}>
        {/* Cards with dynamic data */}
        <Grid item xs={12} md={3}>
          <Card style={cardStyle}>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography style={typographyStyle} variant="h5">
                  {noOfDrones}
                </Typography>
                <Typography style={typographyStyle} variant="subtitle1">
                  No of Drones
                </Typography>
              </Box>
              <Box
                component="span"
                sx={{ width: '2rem', height: '2rem', display: 'inline-block' }}
                dangerouslySetInnerHTML={{
                  __html: `<svg fill='#B0E57C' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>quadcopter</title><path d="M5.5,1C8,1 10,3 10,5.5C10,6.38 9.75,7.2 9.31,7.9L9.41,8H14.59L14.69,7.9C14.25,7.2 14,6.38 14,5.5C14,3 16,1 18.5,1C21,1 23,3 23,5.5C23,8 21,10 18.5,10C17.62,10 16.8,9.75 16.1,9.31L15,10.41V13.59L16.1,14.69C16.8,14.25 17.62,14 18.5,14C21,14 23,16 23,18.5C23,21 21,23 18.5,23C16,23 14,21 14,18.5C14,17.62 14.25,16.8 14.69,16.1L14.59,16H9.41L9.31,16.1C9.75,16.8 10,17.62 10,18.5C10,21 8,23 5.5,23C3,23 1,21 1,18.5C1,16 3,14 5.5,14C6.38,14 7.2,14.25 7.9,14.69L9,13.59V10.41L7.9,9.31C7.2,9.75 6.38,10 5.5,10C3,10 1,8 1,5.5C1,3 3,1 5.5,1M5.5,3A2.5,2.5 0 0,0 3,5.5A2.5,2.5 0 0,0 5.5,8A2.5,2.5 0 0,0 8,5.5A2.5,2.5 0 0,0 5.5,3M5.5,16A2.5,2.5 0 0,0 3,18.5A2.5,2.5 0 0,0 5.5,21A2.5,2.5 0 0,0 8,18.5A2.5,2.5 0 0,0 5.5,16M18.5,3A2.5,2.5 0 0,0 16,5.5A2.5,2.5 0 0,0 18.5,8A2.5,2.5 0 0,0 21,5.5A2.5,2.5 0 0,0 18.5,3M18.5,16A2.5,2.5 0 0,0 16,18.5A2.5,2.5 0 0,0 18.5,21A2.5,2.5 0 0,0 21,18.5A2.5,2.5 0 0,0 18.5,16M3.91,17.25L5.04,17.91C5.17,17.81 5.33,17.75 5.5,17.75A0.75,0.75 0 0,1 6.25,18.5L6.24,18.6L7.37,19.25L7.09,19.75L5.96,19.09C5.83,19.19 5.67,19.25 5.5,19.25A0.75,0.75 0 0,1 4.75,18.5L4.76,18.4L3.63,17.75L3.91,17.25M3.63,6.25L4.76,5.6L4.75,5.5A0.75,0.75 0 0,1 5.5,4.75C5.67,4.75 5.83,4.81 5.96,4.91L7.09,4.25L7.37,4.75L6.24,5.4L6.25,5.5A0.75,0.75 0 0,1 5.5,6.25C5.33,6.25 5.17,6.19 5.04,6.09L3.91,6.75L3.63,6.25M16.91,4.25L18.04,4.91C18.17,4.81 18.33,4.75 18.5,4.75A0.75,0.75 0 0,1 19.25,5.5L19.24,5.6L20.37,6.25L20.09,6.75L18.96,6.09C18.83,6.19 18.67,6.25 18.5,6.25A0.75,0.75 0 0,1 17.75,5.5L17.76,5.4L16.63,4.75L16.91,4.25M16.63,19.25L17.75,18.5A0.75,0.75 0 0,1 18.5,17.75C18.67,17.75 18.83,17.81 18.96,17.91L20.09,17.25L20.37,17.75L19.25,18.5A0.75,0.75 0 0,1 18.5,19.25C18.33,19.25 18.17,19.19 18.04,19.09L16.91,19.75L16.63,19.25Z" /></svg>`
                }}
              />
            </CardContent>
          </Card>

        </Grid>
        <Grid item xs={12} md={3}>
          <Card style={cardStyle}>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography style={typographyStyle} variant="h5">
                  {noOfMissions}
                </Typography>
                <Typography style={typographyStyle} variant="subtitle1">
                  No of Missions
                </Typography>
              </Box>
              <FlightTakeoff style={{ fontSize: '2rem', color: '#B0E57C' }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card style={cardStyle}>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography style={typographyStyle} variant="h5">
                  {noOfUsers}
                </Typography>
                <Typography style={typographyStyle} variant="subtitle1">
                  Users
                </Typography>
              </Box>
              <Person style={{ fontSize: '2rem', color: '#B0E57C' }} />
            </CardContent>
          </Card>
        </Grid>
        {/* <Grid item xs={12} md={3}>
          <Card style={cardStyle}>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography style={typographyStyle} variant="h5">
                  {noOfIncidents}
                </Typography>
                <Typography style={typographyStyle} variant="subtitle1">
                  Incidents
                </Typography>
              </Box>
              <Warning style={{ fontSize: '2rem', color: '#B0E57C' }} />
            </CardContent>
          </Card>
        </Grid> */}

        {/* Chart Section */}
        <Grid item xs={12} md={6}>
          <Card style={cardStyle}>
            <CardContent>
              <Pie
                data={pieData}
                options={{
                  maintainAspectRatio: false, // To allow flexible sizing

                  plugins: {
                    legend: {
                      display: true,
                      position: 'top',
                      labels: {
                        color: '#B0E57C',
                        font: {
                          size: '16',
                          weight: 'bold'
                        }
                      }
                    },
                  },
                }}
                height={300}
                width={100}
              />
            </CardContent>
          </Card>

        </Grid>
        <Grid item xs={12} md={6}>
          <Card style={cardStyle}>
            <CardContent>
              <Line data={lineData} options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                    position: 'top',
                    labels: {
                      color: '#B0E57C',
                      font: {
                        size: '16',
                        weight: 'bold'
                      }
                    }
                  },
                },
                scales: {
                  x: {
                    ticks: {
                      color: '#B0E57C',
                      font: {
                        size: 16,
                      },
                    },
                    grid: {
                      color: 'rgba(255, 255, 255, 0.2)',
                    },
                  },
                  y: {
                    ticks: {
                      color: '#B0E57C',
                      font: {
                        size: 16,
                      },
                    },
                    grid: {
                      color: 'rgba(255, 255, 255, 0.2)',
                    },
                    beginAtZero: true,
                  },
                },
              }}

                height={300}
                width={50} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
