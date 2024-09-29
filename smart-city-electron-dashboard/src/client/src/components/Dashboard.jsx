import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography } from '@mui/material';
import { Pie, Line } from 'react-chartjs-2';
import { getDashboardData } from '../api/dashboard/dashboard.js';
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import { Toys, FlightTakeoff, Person, Warning } from '@mui/icons-material';

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

  const pieData = {
    labels: droneStatus.map((status) => status._id),
    datasets: [
      {
        label: '# of Drones',
        data: droneStatus.map((status) => status.count),
        backgroundColor: ['#4caf50', '#f44336', '#ff9800'],
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
    fontSize: '1.3rem', // Consistent font size across tiles
    color: '#B0E57C', // Consistent color
  };

  // Box background for the main layout
  const boxStyle = {
    backgroundColor: '#120639', // Dark background to match the theme
    minHeight: '100vh', // Ensure it takes full height
    padding: '20px', // Add padding for overall layout
    marginTop: '65px', // Ensure the Box does not overlap with the header
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
              {/* Second Column: Icon */}
              <Toys style={{ fontSize: '2rem', color: '#B0E57C' }} />
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
                      labels:{
                        color:'#B0E57C',
                        font:{
                          size:'16',
                          weight:'bold'
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
                      labels:{
                        color:'#B0E57C',
                        font:{
                          size:'16',
                          weight:'bold'
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
                width={50}  />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
