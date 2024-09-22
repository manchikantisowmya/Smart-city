import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ContentSection from './ContentSection';
import Button from '@mui/material/Button';
import DroneIcon from '@mui/icons-material/Toys';
import CameraIcon from '@mui/icons-material/VideoCameraFront';
import SatelliteIcon from '@mui/icons-material/SatelliteAlt';
import IoTIcon from '@mui/icons-material/Sensors';
import AppsIcon from '@mui/icons-material/Apps';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  height: '65px',
  backgroundColor: '#120639',
  display: 'flex',
  justifyContent: 'space-between',
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
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function PersistentDrawerLeft() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState('Dashboard');

  const handleDrawerToggle = () => setOpen(!open);
  const handleItemClick = (text) => setSelectedItem(text);
  const handleLogout = () => window.location.reload();

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Smart City Traffic Management
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: `${open?drawerWidth:120}`,
            boxSizing: 'border-box',
            backgroundColor: '#120639',
            color: '#FFFFFF',
            borderRight: '2px solid white',
            height: '100vh',
            overflowX: 'hidden',
            // position: 'fixed',
            top: 0,
            left: 0,
            zIndex: theme.zIndex.drawer,
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.standard,
            }),
            whiteSpace: 'nowrap',
          },
        }}
        variant="persistent"
        anchor="left"
        open={true} // Keep the drawer always visible
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerToggle} sx={{ color: '#FFFFFF' }}>
          <MenuIcon />
            {/* {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />} */}
          </IconButton>
        </DrawerHeader>
        <List>
          {['Dashboard', 'Drone Station', 'Satellite Data', 'IoT Station', 'Traffic Camera'].map((text) => (
            <ListItem key={text} disablePadding onClick={() => handleItemClick(text)}>
              <ListItemButton>
                <ListItemIcon sx={{ color: '#FFFFFF', minWidth: 'auto', justifyContent: 'center' }}>
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
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, ml: open ? drawerWidth : 60 }}>
        <Toolbar />
        <ContentSection selectedItem={selectedItem} />
      </Box>
    </Box>
  );
}
