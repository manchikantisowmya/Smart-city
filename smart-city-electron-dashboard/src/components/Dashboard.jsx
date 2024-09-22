// Dashboard.js
import React from 'react';
import { Box, Grid, Card, CardContent, Typography } from '@mui/material';
// import { Pie, Line, Bar } from 'react-chartjs-2'; // Using chart.js

export default function Dashboard() {
//   const pieData = {
//     labels: ['Active', 'Inactive', 'Charging'],
//     datasets: [
//       {
//         label: '# of Drones',
//         data: [6, 3, 2],
//         backgroundColor: ['#4caf50', '#f44336', '#ff9800'],
//       },
//     ],
//   };

//   const lineData = {
//     labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
//     datasets: [
//       {
//         label: 'Missions Per Day',
//         data: [5, 5, 4, 5, 7, 8, 8],
//         backgroundColor: 'rgba(76, 175, 80, 0.2)',
//         borderColor: '#4caf50',
//         fill: true,
//       },
//     ],
//   };

//   const barData = {
//     labels: ['Car on Fire', 'Collision', 'Cars & Trucks'],
//     datasets: [
//       {
//         label: 'Incidents',
//         data: [10, 15, 5],
//         backgroundColor: '#4caf50',
//       },
//     ],
//   };

  return (
    <Box sx={{ padding: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h5">11</Typography>
              <Typography variant="subtitle1">No of drones</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h5">24</Typography>
              <Typography variant="subtitle1">No of Missions</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h5">17</Typography>
              <Typography variant="subtitle1">Users</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h5">33</Typography>
              <Typography variant="subtitle1">Incidents</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Chart Section */}
        {/* <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Pie data={pieData} />
            </CardContent>
          </Card>
        </Grid> */}
        {/* <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Line data={lineData} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Bar data={barData} />
            </CardContent>
          </Card>
        </Grid> */}
      </Grid>
    </Box>
  );
}
