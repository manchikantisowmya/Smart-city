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
import DroneIcon from '@mui/icons-material/Toys'; // Example icon for Drone Station
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

export default function PersistentDrawerLeft({userData,onLogout}) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState('Dashboard'); // Track the selected item
  
  const handleDrawerToggle = () => setOpen(!open);
  const handleItemClick = (text) => setSelectedItem(text);
  const capitalizedName = (userData.user.fname.charAt(0).toUpperCase() + userData.user.fname.slice(1))  +' ' +  userData.user.lname.charAt(0).toUpperCase() + userData.user.lname.slice(1)
  // const handleLogout = () => window.location.reload();
  

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ backgroundColor: '#120639',width: `calc(100% - ${open ? drawerWidth : 60}px)` }}>
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
            <Box sx={{ display: 'flex', flexDirection:'column', alignItems: 'center', mr: 2 }}>
              
              <Typography variant="subtitle1" noWrap>
                {capitalizedName} 
              </Typography>
              <Typography variant="subtitle2" noWrap>
                {userData.user.role_name} 
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection:'column', alignItems: 'center'}}>
              <AccountCircle sx={{ fontSize:40}} /> 
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
        open={true}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerToggle} sx={{ color: '#FFFFFF' }}>
          <MenuIcon />
            {/* {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />} */}
          </IconButton>
        </DrawerHeader>
        <Divider sx={{ borderColor: '#FFFFFF' }} />
        <List>
        {['Dashboard', 'Drone Station', 'Satellite Data', 'IoT Station', 'Traffic Camera'].map((text, index) => (
            <ListItem key={text} disablePadding onClick={() => handleItemClick(text)}>
              <ListItemButton sx={{
                  backgroundColor: selectedItem === text ? 'rgb(255,255,255,0.25' : 'transparent', // Highlight selected
                  '&:hover': {
                    backgroundColor: selectedItem === text ? '#1a1a3d' : '#383858',
                  },
                }}
                selected={selectedItem === text}>
                <ListItemIcon sx={{ color: '#FFFFFF' }}>
                  {text === 'Drone Station' && <DroneIcon sx={{ fontSize: '2rem' }} />}
                  {text === 'Satellite Data' && <SatelliteIcon sx={{ fontSize: '2rem' }} />}
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
      <Box component="main" sx={{ flexGrow: 1}}>
        <Toolbar />
        <ContentSection selectedItem={selectedItem} />
      </Box>
    </Box>
  );
}