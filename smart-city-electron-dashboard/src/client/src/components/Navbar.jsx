import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AppsIcon from '@mui/icons-material/Apps';
// import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
// import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
// import InboxIcon from '@mui/icons-material/MoveToInbox';
// import MailIcon from '@mui/icons-material/Mail';
import ContentSection from './ContentSection';
import Button from '@mui/material/Button'
import CameraIcon from '@mui/icons-material/VideoCameraFront'; // Camera Icon for Traffic Camera
import SatelliteIcon from '@mui/icons-material/SatelliteAlt'; // Satellite Icon for Satellite Data
import IoTIcon from '@mui/icons-material/Sensors'; // IoT Icon for IoT Station
import AccountCircle from '@mui/icons-material/AccountCircle';

const drawerWidth = 240;


const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  height: '65px', // Increase height for a larger header
  backgroundColor: '#120639', // Main theme color
  display: 'flex',
  justifyContent: 'center', // Align items centrally
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function PersistentDrawerLeft({ userData, onLogout }) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState('Dashboard'); // Track the selected item

  const handleDrawerToggle = () => setOpen(!open);
  const handleItemClick = (text) => setSelectedItem(text);
  const capitalizedName = (userData.user.fname.charAt(0).toUpperCase() + userData.user.fname.slice(1)) + ' ' + userData.user.lname.charAt(0).toUpperCase() + userData.user.lname.slice(1)
  // const handleLogout = () => window.location.reload();


  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ backgroundColor: '#120639', width: `calc(100% - ${open ? drawerWidth : 60}px)` }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Smart City Traffic Management
          </Typography>
          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 2 }}>

              <Typography variant="subtitle1" noWrap>
                {capitalizedName}
              </Typography>
              <Typography variant="subtitle2" noWrap>
                {userData.user.role_name}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <AccountCircle sx={{ fontSize: 40 }} />
              <Button color="inherit" onClick={onLogout}>Logout</Button>
            </Box>
          </Box>

        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: open ? drawerWidth : 60,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : 60,
            boxSizing: 'border-box',
            backgroundColor: '#120639', // Match the theme color
            color: '#FFFFFF',
            borderRight: '2px solid white',
            height: '100vh',
            // position:'relative',
            overflowX: 'hidden',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.standard,
            }),
          },
        }}
        variant="persistent"
        anchor="left"
        open={true}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerToggle} sx={{ color: '#FFFFFF' }}>
            <MenuIcon />
            {/* {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />} */}
          </IconButton>
        </DrawerHeader>
        <Divider sx={{ borderColor: '#FFFFFF' }} />
        <List>
          {['Dashboard', 'Drone Station', 'IoT Station', 'Traffic Camera'].map((text, index) => (
            <ListItem key={text} disablePadding onClick={() => handleItemClick(text)}>
              <ListItemButton sx={{
                backgroundColor: selectedItem === text ? 'rgb(255,255,255,0.25' : 'transparent', // Highlight selected
                '&:hover': {
                  backgroundColor: selectedItem === text ? '#1a1a3d' : '#383858',
                },
              }}
                selected={selectedItem === text}>
                <ListItemIcon sx={{ color: '#FFFFFF' }}>
                  {text === 'Drone Station' && (
                    <Box
                      component="span"
                      sx={{ width: '2rem', height: '2rem', display: 'inline-block' }}
                      dangerouslySetInnerHTML={{
                        __html: `<svg fill='white' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>quadcopter</title><path d="M5.5,1C8,1 10,3 10,5.5C10,6.38 9.75,7.2 9.31,7.9L9.41,8H14.59L14.69,7.9C14.25,7.2 14,6.38 14,5.5C14,3 16,1 18.5,1C21,1 23,3 23,5.5C23,8 21,10 18.5,10C17.62,10 16.8,9.75 16.1,9.31L15,10.41V13.59L16.1,14.69C16.8,14.25 17.62,14 18.5,14C21,14 23,16 23,18.5C23,21 21,23 18.5,23C16,23 14,21 14,18.5C14,17.62 14.25,16.8 14.69,16.1L14.59,16H9.41L9.31,16.1C9.75,16.8 10,17.62 10,18.5C10,21 8,23 5.5,23C3,23 1,21 1,18.5C1,16 3,14 5.5,14C6.38,14 7.2,14.25 7.9,14.69L9,13.59V10.41L7.9,9.31C7.2,9.75 6.38,10 5.5,10C3,10 1,8 1,5.5C1,3 3,1 5.5,1M5.5,3A2.5,2.5 0 0,0 3,5.5A2.5,2.5 0 0,0 5.5,8A2.5,2.5 0 0,0 8,5.5A2.5,2.5 0 0,0 5.5,3M5.5,16A2.5,2.5 0 0,0 3,18.5A2.5,2.5 0 0,0 5.5,21A2.5,2.5 0 0,0 8,18.5A2.5,2.5 0 0,0 5.5,16M18.5,3A2.5,2.5 0 0,0 16,5.5A2.5,2.5 0 0,0 18.5,8A2.5,2.5 0 0,0 21,5.5A2.5,2.5 0 0,0 18.5,3M18.5,16A2.5,2.5 0 0,0 16,18.5A2.5,2.5 0 0,0 18.5,21A2.5,2.5 0 0,0 21,18.5A2.5,2.5 0 0,0 18.5,16M3.91,17.25L5.04,17.91C5.17,17.81 5.33,17.75 5.5,17.75A0.75,0.75 0 0,1 6.25,18.5L6.24,18.6L7.37,19.25L7.09,19.75L5.96,19.09C5.83,19.19 5.67,19.25 5.5,19.25A0.75,0.75 0 0,1 4.75,18.5L4.76,18.4L3.63,17.75L3.91,17.25M3.63,6.25L4.76,5.6L4.75,5.5A0.75,0.75 0 0,1 5.5,4.75C5.67,4.75 5.83,4.81 5.96,4.91L7.09,4.25L7.37,4.75L6.24,5.4L6.25,5.5A0.75,0.75 0 0,1 5.5,6.25C5.33,6.25 5.17,6.19 5.04,6.09L3.91,6.75L3.63,6.25M16.91,4.25L18.04,4.91C18.17,4.81 18.33,4.75 18.5,4.75A0.75,0.75 0 0,1 19.25,5.5L19.24,5.6L20.37,6.25L20.09,6.75L18.96,6.09C18.83,6.19 18.67,6.25 18.5,6.25A0.75,0.75 0 0,1 17.75,5.5L17.76,5.4L16.63,4.75L16.91,4.25M16.63,19.25L17.75,18.5A0.75,0.75 0 0,1 18.5,17.75C18.67,17.75 18.83,17.81 18.96,17.91L20.09,17.25L20.37,17.75L19.25,18.5A0.75,0.75 0 0,1 18.5,19.25C18.33,19.25 18.17,19.19 18.04,19.09L16.91,19.75L16.63,19.25Z" /></svg>`
                      }}
                    />
                  )}
                  {/* {text === 'Satellite Data' && <SatelliteIcon sx={{ fontSize: '2rem' }} />} */}
                  {text === 'IoT Station' && <IoTIcon sx={{ fontSize: '2rem' }} />}
                  {text === 'Traffic Camera' && <CameraIcon sx={{ fontSize: '2rem' }} />}
                  {text === 'Dashboard' && <AppsIcon sx={{ fontSize: '2rem' }} />}
                </ListItemIcon>
                {open && <ListItemText primary={text} sx={{ color: '#FFFFFF' }} />}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        {/* <Divider sx={{ borderColor: '#FFFFFF' }} /> */}
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, height: '100vh' }}>
        <Toolbar />
        <ContentSection selectedItem={selectedItem} />
      </Box>
    </Box>
  );
}