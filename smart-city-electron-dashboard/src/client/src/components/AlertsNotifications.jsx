import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Grid, Typography, Button, Dialog, DialogTitle, Card, CardContent, 
    Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, TextField, CircularProgress, DialogContent, DialogActions,Tabs, Tab , FormControl, InputLabel, Select, MenuItem, Chip, Box } from '@mui/material';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';
import { useRef } from 'react';
import { getAccidents } from '../api/accident.js';



// Register MatrixController and MatrixElement separately
ChartJS.register(MatrixController, MatrixElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);



const inputStyle = {
    height: '40px',
    padding: '0',
    color: 'white', // Text color white
    borderColor: 'white', // Border color white
};

const fieldStyle = {
    '& .MuiInputBase-root': {
        color: 'white', // Set input text color to white
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'white', // Set border color to white
        },
        '&:hover fieldset': {
            borderColor: 'white', // Keep white border on hover
        },
        '&.Mui-focused fieldset': {
            borderColor: 'white', // Keep white border when focused
        },
    },
    '& .MuiInputLabel-root': {
        color: 'white', // Set label color to white
    },
    '& .MuiSelect-icon': {
        color: 'white', // Set dropdown arrow (icon) to white
    },
};
const accidentLocations = [
    { id: 1, type: 'Car on Fire', lat: 37.7749, lon: -122.4194, city: "San Francisco", day:"Monday",date:"11/18/2024", loc:'Hayes Valley, San Francisco, California, 94103, United States', video:'/videos/drones/Car on Fire 1.mp4', jsonData1:'/json/Car on Fire 1.json',provideo:'/videos/drones/Car on Fire 1 Pro.mp4' },
    { id: 2, type: 'Car Collision', lat: 37.8044, lon: -122.2711, city: "Oakland", day:"Monday",date:"11/18/2024",loc: 'Broadway, Downtown, Downtown Oakland, Oakland, Alameda County, California, 94612, United States' ,video:'/videos/drones/Car Collision 1.mp4', jsonData1:'/json/Car Collision 1.json',provideo:'/videos/drones/Car Collision 1 Pro.mp4'},
    { id: 3, type: 'Truck Rollover', lat: 37.6879, lon: -122.4702,city: "Daly City", day:"Monday",date:"11/18/2024",loc:' Washington Street, Daly City, San Mateo County, California, 94014, United States',video:'/videos/drones/Truck Roll Over 1.mp4', jsonData1:'/json/Truck Roll Over 1.json',provideo:'/videos/drones/Truck Roll Over 1 Pro.mp4'},
    { id: 4, type: 'Car Collision', lat: 37.6808, lon: -122.3994,city: "Brisbane", day:"Monday",date:"11/18/2024",loc:' San Bruno Avenue,El Camino Real (CA-82), Brisbane, San Mateo County, California, 94066, United States',video:'/videos/drones/Car Collision 2.mp4', jsonData1:'/json/Car Collision 2.json', provideo:'/videos/drones/Car Collision 2 Pro.mp4'},

];

const icons= {
    'Car on Fire': `<svg fill="#ddbb13" height="85px" width="85px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-30.38 -30.38 440.53 440.53" xml:space="preserve" stroke="#ddbb13" stroke-width="1.5190640000000002"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#d91717" stroke-width="12.152512000000002"> <g> <path d="M367.088,247.247h-3.342v-11.568c0-6.986-6.333-10.423-11.235-11.666l-8.002-15.049c-0.611-1.148-1.741-1.928-3.031-2.091 l-58.38-7.366l-53.643-84.995c-0.733-1.161-2.01-1.865-3.383-1.865H98.527c-1.641,0-3.115,1.001-3.719,2.527l-31.485,79.491H32.561 c-13.413,0-20.8,7.387-20.8,20.8v31.814C5.196,247.751,0,253.243,0,259.926v11.538c0,6.992,5.688,12.68,12.68,12.68h40.669 c2.202,21.019,20.024,37.457,41.615,37.457c21.592,0,39.414-16.439,41.616-37.457h106.608 c2.202,21.019,20.023,37.457,41.612,37.457c21.594,0,39.418-16.439,41.62-37.457h40.667c6.99,0,12.678-5.689,12.678-12.681v-11.537 C379.766,252.935,374.078,247.247,367.088,247.247z M94.964,303.601c-13.149,0-23.847-10.698-23.847-23.849 c0-13.15,10.697-23.848,23.847-23.848c13.149,0,23.848,10.698,23.848,23.848C118.812,292.903,108.113,303.601,94.964,303.601z M284.801,303.601c-13.148,0-23.844-10.698-23.844-23.849c0-13.15,10.696-23.848,23.844-23.848 c13.151,0,23.852,10.698,23.852,23.848C308.652,292.903,297.952,303.601,284.801,303.601z"></path> <path d="M283.998,181.321c3.561,7.022,9.778,11.246,18.479,12.553c4.742,0.713,49.42,6.044,56.642,6.044h0.001 c7.353,0,11.272-3.621,13.265-6.658c10.863-16.56-7.471-59.981-9.597-64.877c-0.624-1.438-2.03-2.378-3.598-2.406 c-1.559-0.035-3.005,0.862-3.681,2.276c-0.098,0.204-1.372,2.885-3.095,7.046c-6.428-27.896-19.662-55.799-20.318-57.172 c-0.664-1.391-2.068-2.276-3.609-2.276c-1.541,0-2.945,0.885-3.609,2.276c-0.353,0.741-7.475,15.726-13.855,34.703 c-2.439-5.889-4.229-9.653-4.341-9.887c-0.652-1.366-2.021-2.247-3.534-2.276c-1.544-0.02-2.914,0.802-3.617,2.142 c-0.284,0.541-7.004,13.42-12.379,29.371C279.714,154.248,278.653,170.782,283.998,181.321z M355.476,161.274 c0.649-1.427,2.073-2.342,3.641-2.342c1.567,0,2.991,0.915,3.641,2.342c2.018,4.432,8.247,19.441,3.686,26.528 c-0.45,0.699-0.995,1.297-1.607,1.81c0.436-3.251-1.001-7.169-2.079-9.538c-0.649-1.427-2.073-2.342-3.641-2.342 c-1.567,0-2.991,0.915-3.641,2.342c-1.078,2.369-2.516,6.287-2.079,9.538c-0.612-0.513-1.157-1.11-1.607-1.81 C350.637,186.011,347.495,178.802,355.476,161.274z M317.169,148.465c3.428-11.645,7.869-21.447,8.057-21.858 c0.649-1.427,2.073-2.342,3.641-2.342c1.567,0,2.991,0.916,3.641,2.342c0.188,0.412,4.629,10.213,8.057,21.858 c4.907,16.669,5.194,28.032,0.878,34.739c-0.99,1.54-2.511,3.232-4.778,4.479c1.29-2.692,3.084-10.193-4.156-26.094 c-0.649-1.427-2.073-2.342-3.641-2.342c-1.567,0-2.991,0.915-3.641,2.342c-7.24,15.901-5.446,23.401-4.156,26.094 c-2.268-1.247-3.788-2.939-4.778-4.479C311.975,176.497,312.262,165.133,317.169,148.465z M294.699,141.114 c0.649-1.427,2.073-2.342,3.641-2.342c1.567,0,2.991,0.915,3.641,2.342c2.017,4.432,8.247,19.441,3.686,26.528 c-0.45,0.699-0.995,1.297-1.607,1.809c0.436-3.25-1.002-7.169-2.08-9.538c-0.65-1.427-2.073-2.342-3.641-2.342 c-1.567,0-2.991,0.916-3.641,2.342c-1.078,2.369-2.516,6.287-2.08,9.538c-0.611-0.513-1.156-1.11-1.606-1.809 C289.86,165.851,286.719,158.642,294.699,141.114z"></path> <path d="M246.17,107.612c2.246,0,4.06-0.45,5.53-1.133c-1.94,10.204-2.182,20.225,1.869,26.52 c1.999,3.106,5.978,6.809,13.587,6.809s11.588-3.703,13.587-6.809c10.509-16.331-7.822-57.725-9.946-62.391 c-0.65-1.427-2.073-2.342-3.641-2.342c-1.567,0-2.991,0.915-3.641,2.342c-0.698,1.533-3.146,7.043-5.746,14.314 c-1.851-10.487-6.549-21.318-7.959-24.415c-0.65-1.427-2.073-2.342-3.641-2.342c-1.567,0-2.991,0.916-3.641,2.342 c-2.313,5.081-13.495,30.986-6.392,42.026C237.629,104.85,240.58,107.612,246.17,107.612z M263.516,102.573 c0.649-1.427,2.073-2.342,3.641-2.342c1.567,0,2.991,0.916,3.641,2.342c2.017,4.432,8.247,19.441,3.686,26.528 c-0.45,0.699-0.995,1.297-1.607,1.809c0.436-3.25-1.002-7.169-2.08-9.538c-0.65-1.427-2.073-2.342-3.641-2.342 c-1.567,0-2.991,0.916-3.641,2.342c-1.078,2.369-2.516,6.287-2.08,9.538c-0.611-0.513-1.156-1.11-1.606-1.809 C258.677,127.31,255.535,120.101,263.516,102.573z M242.148,78.576c0.649-1.426,2.073-2.342,3.641-2.342 c1.567,0,2.991,0.915,3.641,2.342c1.943,4.27,6.088,14.787,2.587,20.228c-0.308,0.478-0.667,0.901-1.062,1.278 c0.514-2.551-0.466-5.594-1.525-7.921c-0.649-1.427-2.073-2.343-3.641-2.343c-1.567,0-2.991,0.916-3.641,2.343 c-1.06,2.328-2.039,5.371-1.525,7.921c-0.396-0.377-0.754-0.8-1.062-1.278C236.061,93.363,240.205,82.846,242.148,78.576z"></path> </g> </g><g id="SVGRepo_iconCarrier"> <g> <path d="M367.088,247.247h-3.342v-11.568c0-6.986-6.333-10.423-11.235-11.666l-8.002-15.049c-0.611-1.148-1.741-1.928-3.031-2.091 l-58.38-7.366l-53.643-84.995c-0.733-1.161-2.01-1.865-3.383-1.865H98.527c-1.641,0-3.115,1.001-3.719,2.527l-31.485,79.491H32.561 c-13.413,0-20.8,7.387-20.8,20.8v31.814C5.196,247.751,0,253.243,0,259.926v11.538c0,6.992,5.688,12.68,12.68,12.68h40.669 c2.202,21.019,20.024,37.457,41.615,37.457c21.592,0,39.414-16.439,41.616-37.457h106.608 c2.202,21.019,20.023,37.457,41.612,37.457c21.594,0,39.418-16.439,41.62-37.457h40.667c6.99,0,12.678-5.689,12.678-12.681v-11.537 C379.766,252.935,374.078,247.247,367.088,247.247z M94.964,303.601c-13.149,0-23.847-10.698-23.847-23.849 c0-13.15,10.697-23.848,23.847-23.848c13.149,0,23.848,10.698,23.848,23.848C118.812,292.903,108.113,303.601,94.964,303.601z M284.801,303.601c-13.148,0-23.844-10.698-23.844-23.849c0-13.15,10.696-23.848,23.844-23.848 c13.151,0,23.852,10.698,23.852,23.848C308.652,292.903,297.952,303.601,284.801,303.601z"></path> <path d="M283.998,181.321c3.561,7.022,9.778,11.246,18.479,12.553c4.742,0.713,49.42,6.044,56.642,6.044h0.001 c7.353,0,11.272-3.621,13.265-6.658c10.863-16.56-7.471-59.981-9.597-64.877c-0.624-1.438-2.03-2.378-3.598-2.406 c-1.559-0.035-3.005,0.862-3.681,2.276c-0.098,0.204-1.372,2.885-3.095,7.046c-6.428-27.896-19.662-55.799-20.318-57.172 c-0.664-1.391-2.068-2.276-3.609-2.276c-1.541,0-2.945,0.885-3.609,2.276c-0.353,0.741-7.475,15.726-13.855,34.703 c-2.439-5.889-4.229-9.653-4.341-9.887c-0.652-1.366-2.021-2.247-3.534-2.276c-1.544-0.02-2.914,0.802-3.617,2.142 c-0.284,0.541-7.004,13.42-12.379,29.371C279.714,154.248,278.653,170.782,283.998,181.321z M355.476,161.274 c0.649-1.427,2.073-2.342,3.641-2.342c1.567,0,2.991,0.915,3.641,2.342c2.018,4.432,8.247,19.441,3.686,26.528 c-0.45,0.699-0.995,1.297-1.607,1.81c0.436-3.251-1.001-7.169-2.079-9.538c-0.649-1.427-2.073-2.342-3.641-2.342 c-1.567,0-2.991,0.915-3.641,2.342c-1.078,2.369-2.516,6.287-2.079,9.538c-0.612-0.513-1.157-1.11-1.607-1.81 C350.637,186.011,347.495,178.802,355.476,161.274z M317.169,148.465c3.428-11.645,7.869-21.447,8.057-21.858 c0.649-1.427,2.073-2.342,3.641-2.342c1.567,0,2.991,0.916,3.641,2.342c0.188,0.412,4.629,10.213,8.057,21.858 c4.907,16.669,5.194,28.032,0.878,34.739c-0.99,1.54-2.511,3.232-4.778,4.479c1.29-2.692,3.084-10.193-4.156-26.094 c-0.649-1.427-2.073-2.342-3.641-2.342c-1.567,0-2.991,0.915-3.641,2.342c-7.24,15.901-5.446,23.401-4.156,26.094 c-2.268-1.247-3.788-2.939-4.778-4.479C311.975,176.497,312.262,165.133,317.169,148.465z M294.699,141.114 c0.649-1.427,2.073-2.342,3.641-2.342c1.567,0,2.991,0.915,3.641,2.342c2.017,4.432,8.247,19.441,3.686,26.528 c-0.45,0.699-0.995,1.297-1.607,1.809c0.436-3.25-1.002-7.169-2.08-9.538c-0.65-1.427-2.073-2.342-3.641-2.342 c-1.567,0-2.991,0.916-3.641,2.342c-1.078,2.369-2.516,6.287-2.08,9.538c-0.611-0.513-1.156-1.11-1.606-1.809 C289.86,165.851,286.719,158.642,294.699,141.114z"></path> <path d="M246.17,107.612c2.246,0,4.06-0.45,5.53-1.133c-1.94,10.204-2.182,20.225,1.869,26.52 c1.999,3.106,5.978,6.809,13.587,6.809s11.588-3.703,13.587-6.809c10.509-16.331-7.822-57.725-9.946-62.391 c-0.65-1.427-2.073-2.342-3.641-2.342c-1.567,0-2.991,0.915-3.641,2.342c-0.698,1.533-3.146,7.043-5.746,14.314 c-1.851-10.487-6.549-21.318-7.959-24.415c-0.65-1.427-2.073-2.342-3.641-2.342c-1.567,0-2.991,0.916-3.641,2.342 c-2.313,5.081-13.495,30.986-6.392,42.026C237.629,104.85,240.58,107.612,246.17,107.612z M263.516,102.573 c0.649-1.427,2.073-2.342,3.641-2.342c1.567,0,2.991,0.916,3.641,2.342c2.017,4.432,8.247,19.441,3.686,26.528 c-0.45,0.699-0.995,1.297-1.607,1.809c0.436-3.25-1.002-7.169-2.08-9.538c-0.65-1.427-2.073-2.342-3.641-2.342 c-1.567,0-2.991,0.916-3.641,2.342c-1.078,2.369-2.516,6.287-2.08,9.538c-0.611-0.513-1.156-1.11-1.606-1.809 C258.677,127.31,255.535,120.101,263.516,102.573z M242.148,78.576c0.649-1.426,2.073-2.342,3.641-2.342 c1.567,0,2.991,0.915,3.641,2.342c1.943,4.27,6.088,14.787,2.587,20.228c-0.308,0.478-0.667,0.901-1.062,1.278 c0.514-2.551-0.466-5.594-1.525-7.921c-0.649-1.427-2.073-2.343-3.641-2.343c-1.567,0-2.991,0.916-3.641,2.343 c-1.06,2.328-2.039,5.371-1.525,7.921c-0.396-0.377-0.754-0.8-1.062-1.278C236.061,93.363,240.205,82.846,242.148,78.576z"></path> </g> </g></svg>`,
     'Truck Rollover':`<svg width="82px" height="82px" viewBox="-1.92 -1.92 19.84 19.84" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#4067b5" stroke-width="1.008"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="1.6640000000000001"> <path fill-rule="evenodd" clip-rule="evenodd" d="M11 2H0V13H2C2 14.1046 2.89543 15 4 15C5.10457 15 6 14.1046 6 13H10C10 14.1046 10.8954 15 12 15C13.1046 15 14 14.1046 14 13H16V8C16 6.34315 14.6569 5 13 5H11V2ZM11 7V9H14V7H11Z" fill="#4067b6"></path> </g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M11 2H0V13H2C2 14.1046 2.89543 15 4 15C5.10457 15 6 14.1046 6 13H10C10 14.1046 10.8954 15 12 15C13.1046 15 14 14.1046 14 13H16V8C16 6.34315 14.6569 5 13 5H11V2ZM11 7V9H14V7H11Z" fill="#4067b6"></path> </g></svg>`,
     'Car Collision':`<svg fill="#cf1717" height="89px" width="89px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-14.42 -14.42 509.66 509.66" xml:space="preserve" stroke="#cf1717"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="7.6932"> <g> <path d="M290.207,188.296c-2.823-1.735-6.519-0.856-8.254,1.966l-45.567,74.047c-1.737,2.822-0.857,6.518,1.965,8.255 c0.98,0.603,2.066,0.891,3.139,0.891c2.015,0,3.982-1.015,5.116-2.856l45.567-74.047 C293.909,193.729,293.029,190.033,290.207,188.296z"></path> <path d="M222.466,244.96c1.166,1.676,3.033,2.574,4.931,2.574c1.182,0,2.377-0.35,3.421-1.075c2.72-1.893,3.392-5.632,1.499-8.352 l-34.175-49.127c-1.892-2.719-5.631-3.39-8.352-1.499c-2.72,1.893-3.392,5.632-1.499,8.353L222.466,244.96z"></path> <path d="M240.793,227.091c0.52,0.139,1.04,0.205,1.554,0.205c2.65,0,5.076-1.77,5.793-4.452l19.224-71.91 c0.856-3.201-1.045-6.49-4.247-7.347c-3.204-0.854-6.491,1.046-7.346,4.247l-19.224,71.91 C235.69,222.945,237.592,226.234,240.793,227.091z"></path> <path d="M274.393,249.834c1.03,2.154,3.178,3.412,5.417,3.412c0.868,0,1.749-0.189,2.584-0.588l16.375-7.831 c2.99-1.43,4.254-5.012,2.825-8.002c-1.429-2.989-5.012-4.253-8.001-2.824l-16.375,7.831 C274.228,243.262,272.964,246.844,274.393,249.834z"></path> <path d="M221.889,201.065c0.716,2.685,3.141,4.456,5.793,4.456c0.512,0,1.032-0.066,1.55-0.204 c3.202-0.855,5.105-4.142,4.251-7.344l-11.391-42.72c-0.854-3.201-4.141-5.103-7.343-4.252c-3.202,0.854-5.105,4.142-4.251,7.344 L221.889,201.065z"></path> <path d="M234.214,287.646h-0.403v-5.336c0-4.824-3.917-7.322-7.247-8.35l-4.479-8.423c-0.61-1.148-1.741-1.928-3.031-2.091 l-34.26-4.324l-31.767-50.333c-0.733-1.161-2.01-1.865-3.383-1.865H60.69c-1.641,0-3.115,1.002-3.719,2.527l-18.482,46.66H21.128 c-8.945,0-14.075,5.13-14.075,14.075v17.713C3.012,288.872,0,292.517,0,296.852v6.92c0,5.076,4.13,9.205,9.206,9.205h20.963 c2.054,13.824,13.998,24.466,28.384,24.466c14.387,0,26.332-10.642,28.386-24.466l69.541,0.001 c2.054,13.824,13.998,24.465,28.383,24.465c14.387,0,26.332-10.641,28.386-24.465h20.964c5.076,0,9.205-4.13,9.205-9.206v-6.92 C243.419,291.775,239.29,287.646,234.214,287.646z M58.553,319.442c-5.899,0-10.698-4.8-10.698-10.7c0-5.9,4.799-10.7,10.698-10.7 c5.9,0,10.7,4.8,10.7,10.7C69.253,314.643,64.453,319.442,58.553,319.442z M184.864,319.442c-5.899,0-10.698-4.8-10.698-10.7 c0-5.9,4.799-10.7,10.698-10.7c5.9,0,10.701,4.8,10.701,10.7C195.564,314.643,190.764,319.442,184.864,319.442z"></path> <path d="M473.772,287.899v-17.713c0-8.945-5.13-14.075-14.076-14.075h-17.361l-18.482-46.66c-0.604-1.525-2.078-2.527-3.719-2.527 h-76.493c-1.373,0-2.65,0.704-3.383,1.865l-31.767,50.333l-34.26,4.324c-1.29,0.163-2.42,0.942-3.031,2.091l-4.479,8.423 c-3.331,1.027-7.247,3.525-7.247,8.35v5.336h-0.403c-5.076,0-9.206,4.13-9.206,9.206v6.92c0,5.076,4.129,9.206,9.206,9.206h20.964 c2.054,13.824,13.999,24.465,28.386,24.465c14.385,0,26.33-10.641,28.383-24.465l57.081-0.001 c2.054,13.824,13.999,24.466,28.386,24.466c14.386,0,26.33-10.642,28.384-24.466h20.963c5.076,0,9.206-4.129,9.206-9.205v-6.92 C480.825,292.517,477.814,288.872,473.772,287.899z M308.422,319.442c-5.9,0-10.701-4.8-10.701-10.7c0-5.9,4.8-10.7,10.701-10.7 c5.899,0,10.698,4.8,10.698,10.7C319.121,314.643,314.321,319.442,308.422,319.442z M422.272,319.442c-5.9,0-10.7-4.8-10.7-10.7 c0-5.9,4.8-10.7,10.7-10.7c5.899,0,10.698,4.8,10.698,10.7C432.97,314.643,428.171,319.442,422.272,319.442z"></path> </g> </g><g id="SVGRepo_iconCarrier"> <g> <path d="M290.207,188.296c-2.823-1.735-6.519-0.856-8.254,1.966l-45.567,74.047c-1.737,2.822-0.857,6.518,1.965,8.255 c0.98,0.603,2.066,0.891,3.139,0.891c2.015,0,3.982-1.015,5.116-2.856l45.567-74.047 C293.909,193.729,293.029,190.033,290.207,188.296z"></path> <path d="M222.466,244.96c1.166,1.676,3.033,2.574,4.931,2.574c1.182,0,2.377-0.35,3.421-1.075c2.72-1.893,3.392-5.632,1.499-8.352 l-34.175-49.127c-1.892-2.719-5.631-3.39-8.352-1.499c-2.72,1.893-3.392,5.632-1.499,8.353L222.466,244.96z"></path> <path d="M240.793,227.091c0.52,0.139,1.04,0.205,1.554,0.205c2.65,0,5.076-1.77,5.793-4.452l19.224-71.91 c0.856-3.201-1.045-6.49-4.247-7.347c-3.204-0.854-6.491,1.046-7.346,4.247l-19.224,71.91 C235.69,222.945,237.592,226.234,240.793,227.091z"></path> <path d="M274.393,249.834c1.03,2.154,3.178,3.412,5.417,3.412c0.868,0,1.749-0.189,2.584-0.588l16.375-7.831 c2.99-1.43,4.254-5.012,2.825-8.002c-1.429-2.989-5.012-4.253-8.001-2.824l-16.375,7.831 C274.228,243.262,272.964,246.844,274.393,249.834z"></path> <path d="M221.889,201.065c0.716,2.685,3.141,4.456,5.793,4.456c0.512,0,1.032-0.066,1.55-0.204 c3.202-0.855,5.105-4.142,4.251-7.344l-11.391-42.72c-0.854-3.201-4.141-5.103-7.343-4.252c-3.202,0.854-5.105,4.142-4.251,7.344 L221.889,201.065z"></path> <path d="M234.214,287.646h-0.403v-5.336c0-4.824-3.917-7.322-7.247-8.35l-4.479-8.423c-0.61-1.148-1.741-1.928-3.031-2.091 l-34.26-4.324l-31.767-50.333c-0.733-1.161-2.01-1.865-3.383-1.865H60.69c-1.641,0-3.115,1.002-3.719,2.527l-18.482,46.66H21.128 c-8.945,0-14.075,5.13-14.075,14.075v17.713C3.012,288.872,0,292.517,0,296.852v6.92c0,5.076,4.13,9.205,9.206,9.205h20.963 c2.054,13.824,13.998,24.466,28.384,24.466c14.387,0,26.332-10.642,28.386-24.466l69.541,0.001 c2.054,13.824,13.998,24.465,28.383,24.465c14.387,0,26.332-10.641,28.386-24.465h20.964c5.076,0,9.205-4.13,9.205-9.206v-6.92 C243.419,291.775,239.29,287.646,234.214,287.646z M58.553,319.442c-5.899,0-10.698-4.8-10.698-10.7c0-5.9,4.799-10.7,10.698-10.7 c5.9,0,10.7,4.8,10.7,10.7C69.253,314.643,64.453,319.442,58.553,319.442z M184.864,319.442c-5.899,0-10.698-4.8-10.698-10.7 c0-5.9,4.799-10.7,10.698-10.7c5.9,0,10.701,4.8,10.701,10.7C195.564,314.643,190.764,319.442,184.864,319.442z"></path> <path d="M473.772,287.899v-17.713c0-8.945-5.13-14.075-14.076-14.075h-17.361l-18.482-46.66c-0.604-1.525-2.078-2.527-3.719-2.527 h-76.493c-1.373,0-2.65,0.704-3.383,1.865l-31.767,50.333l-34.26,4.324c-1.29,0.163-2.42,0.942-3.031,2.091l-4.479,8.423 c-3.331,1.027-7.247,3.525-7.247,8.35v5.336h-0.403c-5.076,0-9.206,4.13-9.206,9.206v6.92c0,5.076,4.129,9.206,9.206,9.206h20.964 c2.054,13.824,13.999,24.465,28.386,24.465c14.385,0,26.33-10.641,28.383-24.465l57.081-0.001 c2.054,13.824,13.999,24.466,28.386,24.466c14.386,0,26.33-10.642,28.384-24.466h20.963c5.076,0,9.206-4.129,9.206-9.205v-6.92 C480.825,292.517,477.814,288.872,473.772,287.899z M308.422,319.442c-5.9,0-10.701-4.8-10.701-10.7c0-5.9,4.8-10.7,10.701-10.7 c5.899,0,10.698,4.8,10.698,10.7C319.121,314.643,314.321,319.442,308.422,319.442z M422.272,319.442c-5.9,0-10.7-4.8-10.7-10.7 c0-5.9,4.8-10.7,10.7-10.7c5.899,0,10.698,4.8,10.698,10.7C432.97,314.643,428.171,319.442,422.272,319.442z"></path> </g> </g></svg>`
    };

const iconColors = {
    'Car on Fire': '#e4d211',
    'Car Collision': '#c32828',
    'Truck Rollover': '#4caf50',
    default: '#9e9e9e', // Fallback color if type isn't found
};

const CardItem = ({ title, count, color, iconKey }) => (
    <Card style={{ backgroundColor: color, height: '125px', marginBottom: '10px', color: 'white', padding: '10px', textAlign: 'center', borderRadius: '10px' }}>
      <CardContent>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6">{title} : <b>{count}</b></Typography>
        <div dangerouslySetInnerHTML={{ __html: icons[iconKey] }} />
</div>
      </CardContent>
    </Card>
  );
const createIcon = (type) => {
    // Retrieve the SVG markup from the icons object; fall back to default circle if not found
    const iconMarkup = icons[type] || `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#9e9e9e">
            <circle cx="12" cy="12" r="10" />
        </svg>
    `;

    return L.divIcon({
        html: iconMarkup,
        className: 'custom-accident-icon',
        iconSize: [30, 30],
        iconAnchor: [15, 15],
    });
};



const AlertAndNotification = () => {
    const [selectedYear, setSelectedYear] = useState(['2024']);
    const [selectedMonths, setSelectedMonths] = useState(['November']);
    const [selectedAlert, setSelectedAlert] = useState(null);
    const [locationData, setLocationData] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [filter, setFilter] = useState('');
    const [videoSrc, setVideoSrc] = useState(null); // State for video source
    const [videoSrcPro, setVideoSrcPro] = useState(null); // State for video source

    const [showJsonData, setShowJsonData] = useState(false);
    const [timer, setTimer] = useState(0);
    const markerRefs = useRef({});

    // useEffect(() => {
    //     // Fetch accident data
    // //     getAccidents().then(response => {
    // //         console.log(response);  // Log the response to the console
    // //         //setAccidentLocations(response);  // Assuming response is an array of accident locations
    // //     }).catch(error => {
    // //         console.error('Error fetching accident data:', error);
    // //     });
    // // }, getAccidents());
    


    const handleTimeUpdate = (event) => {
        const currentTime = event.target.currentTime;
        if (currentTime >= 20) {
            setShowJsonData(true);
        }
    };

    
    // Filter the locations based on the filter input
    const filteredLocations = accidentLocations.filter(location => 
        location.type.toLowerCase().includes(filter.toLowerCase()) ||
        location.loc.toLowerCase().includes(filter.toLowerCase())
    );

    const handleScheduleMission = async (location) => {
        console.log("handleScheduleMission");
        setDialogOpen(true);
        setTimer(20);
        setShowJsonData(false);
    
        try {
            const response = await fetch(location.jsonData1);
    
            // Log the raw response text
            const responseText = await response.text();
    
            if (!response.ok) {
                throw new Error(`Failed to fetch JSON. Status: ${response.status} ${response.statusText}`);
            }
    
            // Try to parse the response as JSON
            const jsonData = JSON.parse(responseText);
    
            setLocationData(jsonData);
    
            // Set the video source dynamically
            setVideoSrc(location.video);
            setVideoSrcPro(location.provideo);

            
            console.log(location.provideo);
        } catch (error) {
            console.error("Failed to load JSON:", error);
            // Handle the error (e.g., show a message to the user)
        }
    };
    
        // const handleScheduleMission = async (location) => {
        //     console.log("handleScheduleMission")
        //     setDialogOpen(true);
            
        //     // Load JSON data dynamically
        //     console.log(location.jsonData)
        //     const jsonData = await fetch(location.jsonData).then(response => response.json());
        //     console.log(jsonData)

        //     setLocationData(jsonData);
            
        //     // Set the video source dynamically
        //     setVideoSrc(location.video);
        //     console.log(location.video)
        // };
        
        const handleRowClick = (locationId) => {
            const marker = markerRefs.current[locationId];
            if (marker) {
                marker.openPopup();
            }
        };
    const handleDialogClose = () => {
        setDialogOpen(false);
    };
    

    const years = ['2018', '2019', '2020', '2021', '2022', '2023', '2024'];
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
    ];

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    };

    const handleMonthChange = (event) => {
        const value = event.target.value;
        setSelectedMonths(typeof value === 'string' ? value.split(',') : value);
    }; // <-- Properly closing this function

    const handleAlertClick = (alert) => {
        setSelectedAlert(alert);
    };

    const handleCloseDialog = () => {
        setSelectedAlert(null);
    };
 

    //Car Crash
const CarCrashIcon = () => (
    <svg fill="#000000" height="100px" width="60x" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" viewBox="-45.93 -45.93 551.13 551.13">
      <path d="M459.179,290.209l-3.149-14.551c-0.467-2.159-2.597-3.529-4.756-3.063l-2.522,0.546l-8.871-56.684 c-0.012-0.076-0.026-0.152-0.042-0.227c-1.582-7.312-8.154-12.619-15.626-12.619c-1.136,0-2.278,0.123-3.396,0.364l-7.437,1.609 l-29.415-82.418c-0.675-1.892-2.648-2.986-4.613-2.565L237.52,151.294c-1.963,0.425-3.307,2.241-3.14,4.243l7.29,87.205 l-7.438,1.609c-3.22,0.697-6.003,2.325-8.131,4.539c-0.572-8.306-7.495-14.894-15.944-14.894h-7.609l-11.318-86.774 c-0.26-1.993-1.957-3.483-3.966-3.483H42.15c-2.009,0-3.707,1.49-3.966,3.482l-11.319,86.774h-7.608c-8.822,0-16,7.178-16,16 c0,0.077,0.002,0.154,0.007,0.232l3.318,57.277H4c-2.209,0-4,1.791-4,4v14.888c0,2.209,1.791,4,4,4h16.937v19.358 c0,8.822,7.178,16,16,16h10.428c8.822,0,16-7.178,16-16v-19.358h102.687v19.358c0,8.822,7.178,16,16,16h10.428 c8.822,0,16-7.178,16-16v-19.358h16.936c2.209,0,4-1.791,4-4v-14.888c0-2.209-1.791-4-4-4h-2.581l1.967-33.952l12.592,45.325 l-2.523,0.546c-1.037,0.225-1.942,0.852-2.517,1.744c-0.574,0.892-0.771,1.975-0.547,3.012l3.149,14.551 c0.406,1.874,2.064,3.155,3.906,3.155c0.28,0,0.565-0.03,0.85-0.091l16.552-3.582l4.094,18.92 c1.583,7.312,8.155,12.618,15.626,12.618c1.136,0,2.278-0.123,3.396-0.364l10.192-2.206c4.177-0.904,7.753-3.38,10.067-6.973 c2.314-3.593,3.091-7.872,2.188-12.049l-4.094-18.92l100.363-21.718l4.094,18.92c1.582,7.312,8.154,12.619,15.627,12.619 c1.135,0,2.278-0.123,3.396-0.364l10.191-2.206c8.622-1.866,14.119-10.4,12.254-19.023l-4.094-18.92l16.553-3.582 c1.037-0.225,1.942-0.852,2.517-1.744C459.207,292.329,459.403,291.246,459.179,290.209z"></path>
    </svg>
  );

  // Data for graphs
  const data = {
        labels: ['2018', '2019', '2020', '2021', '2022', '2023', '2024'], // Years for the x-axis
        datasets: [
            {
                label: 'January',
                data: [659, 568, 610, 489, 467, 523, 572], // Data for January across years
                borderColor: '#FF7D9C',
                backgroundColor: 'rgba(0,0,0,0)',
                fill: false
            },
            {
                label: 'February',
                data: [626, 608, 625, 452, 530, 489, 575], // Data for February across years
                borderColor: '#FFB060',
                backgroundColor: 'rgba(0,0,0,0)',
                fill: false
            },
            {
                label: 'March',
                data: [719, 647, 437, 516, 571, 595, 546], // Data for March across years
                borderColor: '#FFD469',
                backgroundColor: 'rgba(0,0,0,0)',
                fill: false
            },
            {
                label: 'April',
                data: [613, 603, 303, 453, 572, 599, 491], // Data for April across years
                borderColor: '#A57FFF',
                backgroundColor: 'rgba(0,0,0,0)',
                fill: false
            },
            {
                label: 'May',
                data: [662, 599, 368, 563, 581, 528, 534], // Data for May across years
                borderColor: '#50D1C0',
                backgroundColor: 'rgba(0,0,0,0)',
                fill: false
            },
            {
                label: 'June',
                data: [642, 669, 411, 569, 624, 531, 468], // Data for June across years
                borderColor: '#4A90E2',
                backgroundColor: 'rgba(0,0,0,0)',
                fill: false
            },
            {
                label: 'July',
                data: [547, 606, 455, 565, 506, 511, 489], // Data for July across years
                borderColor: '#FF8559',
                backgroundColor: 'rgba(0,0,0,0)',
                fill: false
            },
            {
                label: 'August',
                data: [646, 624, 492, 617, 600, 625, 505], // Data for August across years
                borderColor: '#FF7D9C',
                backgroundColor: 'rgba(0,0,0,0)',
                fill: false
            },
            {
                label: 'September',
                data: [679, 746, 488, 596, 610, 596, 186], // Data for September across years
                borderColor: '#FFB060',
                backgroundColor: 'rgba(0,0,0,0)',
                fill: false
            },
            {
                label: 'October',
                data: [714, 769, 576, 728, 618, 674, 179], // Data for October across years
                borderColor: '#FFD469',
                backgroundColor: 'rgba(0,0,0,0)',
                fill: false
            },
            {
                label: 'November',
                data: [689, 624, 455, 535, 598, 563, 14], // Data for November across years
                borderColor: '#A57FFF',
                backgroundColor: 'rgba(0,0,0,0)',
                fill: false
            },
            {
                label: 'December',
                data: [686, 620, 477, 534, 594, 575, 0], // Data for December across years
                borderColor: '#50D1C0',
                backgroundColor: 'rgba(0,0,0,0)',
                fill: false
            },
        ],
    };
    const options = {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Monthly Data Across Years',
                    color: 'white',
                    font: {
                        size: 20,
                        family: 'Arial',
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 10
                    },
                    align: 'center',
                    position: 'top',
                },
                legend: {
                    position: 'top',
                    labels: {
                        color: 'white'
                    }
                },
                tooltip: {
                    enabled: true,
                    titleColor: 'white',
                    bodyColor: 'white',
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    min: 0,
                    title: {
                        display: true,
                        text: 'Value',
                        color: "white"
                    },
                    ticks: {
                        color: 'white'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Years',
                        color: "white"
                    },
                    ticks: {
                        color: 'white'
                    }
                }
            },
            elements: {
                line: {
                    borderColor: 'white',
                    borderWidth: 2
                },
                point: {
                    backgroundColor: 'white',
                }
            }
        };
        
        // Stacked Chart Data
        
        const datastack = {
            labels: ['2018', '2019', '2020', '2021', '2022', '2023', '2024'], // Years for the x-axis
            datasets: [
                {
                    label: 'Car Collision',
                    data: [3173, 3375, 2354, 2669, 2764, 2844, 1803],
                    backgroundColor: 'rgba(255, 99, 132, 0.6)', // Set color for this dataset
                },
                {
                    label: 'Cars on Fire',
                    data: [3322, 3042, 2349, 2796, 2930, 2883, 2149],
                    backgroundColor: 'rgba(54, 162, 235, 0.6)', // Set color for this dataset
                },
                {
                    label: 'Truck Accidents',
                    data: [1387, 1266, 994, 1152, 1177, 1082, 607],
                    backgroundColor: 'rgba(75, 192, 192, 0.6)', // Set color for this dataset
                }
            ]
        };
        
        
        const optionsstack = {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Emergency Type Accidents Over the Years',
                    color: 'white',
                    font: {
                        size: 20,
                        family: 'Arial',
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 10
                    },
                    align: 'center',
                    position: 'top',
                },
                legend: {
                    position: 'top',
                    labels: {
                        color: 'white'
                    }
                },
                tooltip: {
                    enabled: true,
                    titleColor: 'white',
                    bodyColor: 'white',
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    stacked: true, 
                    title: {
                        display: true,
                        text: 'Total Accidents',
                        color: 'white'
                    },
                    ticks: {
                        color: 'white'
                    }
                },
                x: {
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Year',
                        color: 'white'
                    },
                    ticks: {
                        color: 'white'
                    }
                }
            },
            elements: {
                bar: {
                    borderWidth: 1,
                }
            }
        };
        
        // HeatMap
        const dataheat = {
            labels: ['2018', '2019', '2020', '2021', '2022', '2023', '2024'], // Years for x-axis
            datasets: [
                {
                    label: 'Sunday',
                    data: [
                        830, 886, 606, 835, 808, 855, 566
                    ],
                    backgroundColor: 'Blue',
                    borderColor: 'rgba(0, 255, 0, 0.3)',
                    borderWidth: 1
                },
                {
                    label: 'Monday',
                    data: [
                        1159, 1051, 839, 955, 931, 964, 617
                    ],
                    backgroundColor: 'rgba(54, 162, 235, 0.7',
                    borderColor: 'rgba(0, 200, 0, 0.3)',
                    borderWidth: 1
                },
                {
                    label: 'Tuesday',
                    data: [
                        1254, 1185, 848, 913, 1047, 989, 597
                    ],
                    backgroundColor: 'rgba(255, 159, 64, 0.7)',
                    borderColor: 'rgba(0, 150, 0, 0.3)',
                    borderWidth: 1
                },
                {
                    label: 'Wednesday',
                    data: [
                        1201, 1155, 861, 986, 988, 1086, 717
                    ],
                    backgroundColor: 'rgba(75, 192, 192, 0.7)',
                    borderColor: 'rgba(0, 100, 0, 0.3)',
                    borderWidth: 1
                },
                {
                    label: 'Thursday',
                    data: [
                        1210, 1191, 834, 980, 1018, 1007, 673
                    ],
                    backgroundColor: 'pink',
                    borderColor: 'rgba(0, 50, 0, 0.3)',
                    borderWidth: 1
                },
                {
                    label: 'Friday',
                    data: [
                        1216, 1192, 956, 1078, 1084, 989, 715
                    ],
                    backgroundColor: 'rgba(255, 205, 86, 0.7)',
                    borderColor: 'rgba(0, 255, 100, 0.3)',
                    borderWidth: 1
                },
                {
                    label: 'Saturday',
                    data: [
                        1012, 1023, 753, 870, 995, 919, 674
                    ],
                    backgroundColor: 'orange',
                    borderColor: 'rgba(0, 255, 50, 0.3)',
                    borderWidth: 1
                }
            ]
        };
        const optionsheat = {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Accidents on WeekDays',
                    color: 'white',
                    font: {
                        size: 20,
                        family: 'Arial',
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 10
                    },
                    align: 'center',
                    position: 'top',
                },
                legend: {
                    position: 'top',
                    labels: {
                        color: 'white'
                    }
                },
                tooltip: {
                    enabled: true,
                    titleColor: 'white',
                    bodyColor: 'white',
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    stacked: true, 
                    title: {
                        display: true,
                        text: 'Total Accidents',
                        color: 'white'
                    },
                    ticks: {
                        color: 'white'
                    }
                },
                x: {
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Year',
                        color: 'white'
                    },
                    ticks: {
                        color: 'white'
                    }
                }
            },
            elements: {
                bar: {
                    borderWidth: 1,
                }
            }
        };

        const [activeTab, setActiveTab] = useState(0);

        const handleTabChange = (event, newValue) => {
            setActiveTab(newValue);
        };
        const tabStyles = {
            '& .MuiTabs-root': {
                width: '100%', // Ensure tabs take up 100% width of the container
            },
            '& .MuiTabs-indicator': {
                backgroundColor: 'transparent', // Remove default indicator to emphasize tab style changes
            },
            '& .MuiTab-root': {
                textTransform: 'none',
                color: 'white', // Color for unselected tab text
                width: '50%', // Each tab takes up half of the width (for 2 tabs)
                border: '1px solid white', // Add a white border around each tab
                borderTopWidth: '2px', // Set top border width to 2px
                borderBottomWidth: '2px', // Set bottom border width to 2px
                '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Optional hover effect
                },
                '&.Mui-selected': {
                    backgroundColor: '#4CAF50', // Green background for the selected tab
                    color: 'white', // White text for selected tab
                    border: '1px solid white', // Maintain the white border for selected tabs
                    borderTopWidth: '2px', // Keep top border width for selected tabs
                    borderBottomWidth: '2px', // Keep bottom border width for selected tabs
                },
            },
        };
        useEffect(() => {
            if (timer > 0) {
                const countdown = setTimeout(() => setTimer(timer - 1), 1000);
                return () => clearTimeout(countdown);
            } else if (timer === 0 && dialogOpen) {
                setShowJsonData(true);
            }
        }, [timer, dialogOpen]);
        
return (
      <Grid container spacing={2} style={{ height: '50vh' }}>
        {/* Dropdowns and Cards
        <Grid item xs={3}>
        <FormControl fullWidth margin="normal" sx={fieldStyle}>
    <InputLabel>Year</InputLabel>
    <Select
        multiple
        value={selectedYear}
        onChange={(e) => setSelectedYear(e.target.value)}
        renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => <Chip key={value} label={value} sx={inputStyle} />)}
            </Box>
        )}
        inputProps={{ style: inputStyle }} // Apply input styles
    >
        {years.map((year) => (
            <MenuItem key={year} value={year}>
                {year}
            </MenuItem>
        ))}
    </Select>
</FormControl>
</Grid> */}
{/* <Grid item xs={3}>
        <FormControl fullWidth margin="normal" sx={fieldStyle}>
            <InputLabel>Month</InputLabel>
            <Select
                multiple
                value={selectedMonths}
                onChange={(e) => setSelectedMonths(e.target.value)}
                renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => <Chip key={value} label={value} sx={inputStyle} />)}
                    </Box>
                )}
                inputProps={{ style: inputStyle }} // Apply input styles
            >
                {months.map((month) => (
                    <MenuItem key={month} value={month}>
                        {month}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
        </Grid> */}
        {/* <Grid item xs={12}>
            <Tabs value={activeTab} onChange={handleTabChange} sx={tabStyles}>
                <Tab label="Accident Alerts" />
                <Tab label="Accident Statistic" />
            </Tabs>
        </Grid> */}
        <Grid item xs={12}>
            <Tabs value={activeTab} onChange={handleTabChange} sx={tabStyles}>
                <Tab label="Live Alerts" />
                <Tab label="Historical Alerts and Statics" />
            </Tabs>
        </Grid>
    
    {/*} <Grid item xs={3}>
             Example Card 
            <Card style={{ backgroundColor: '#a03e66', height: '100px', color: 'white', padding: '10px', textAlign: 'center', borderRadius: '10px' }}>
                <CardContent>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CarCrashIcon />
                        <Typography variant="h6">Car Crash in Nov 2024 <br /><b>14</b></Typography>
                    </div>
                </CardContent>
            </Card>
        </Grid> */}


        {/* Tab Content */}
        <Grid item xs={12}>
        {activeTab === 0 && (
             <Grid container spacing={2}>
                 <Grid item xs={12}>
                 <div style={{color:"white", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h4"><b>Accident Report : November 2024  </b></Typography>
        </div>
                </Grid>
             {/* Table Component */}
             <Grid item xs={12}>
                 <TableContainer component={Paper} sx={{ backgroundColor: '#120639', color: 'white', overflowY: 'auto' }}>
                     <Table sx={{ backgroundColor: '#1a1a3d', color: 'white' }}>
                         <TableHead>
                             <TableRow>
                                 <TableCell sx={{ color: 'white' }}>ID</TableCell>
                                 <TableCell sx={{ color: 'white' }}>Type</TableCell>
                                 <TableCell sx={{ color: 'white' }}>City</TableCell>
                                 <TableCell sx={{ color: 'white' }}>Date</TableCell>
                                 <TableCell sx={{ color: 'white' }}>Day</TableCell>
                                 <TableCell sx={{ color: 'white' }}>Location</TableCell>
                                 <TableCell sx={{ color: 'white' }}>Coordinates</TableCell>
                             </TableRow>
                         </TableHead>
                         <TableBody>
                             {filteredLocations.map((location) => (
                                 <TableRow 
                                     key={location.id} 
                                     onClick={() => handleRowClick(location.id)}
                                     sx={{ cursor: 'pointer' }}
                                 >
                                     <TableCell sx={{ color: 'white' }}>{location.id}</TableCell>
                                     <TableCell sx={{ color: 'white' }}>{location.type}</TableCell>
                                     <TableCell sx={{ color: 'white' }}>{location.city}</TableCell>
                                     <TableCell sx={{ color: 'white' }}>{location.day}</TableCell>
                                     <TableCell sx={{ color: 'white' }}>{location.date}</TableCell>
                                     <TableCell sx={{ color: 'white' }}>{location.loc}</TableCell>
                                     <TableCell sx={{ color: 'white' }}>
                                         ({location.lat.toFixed(4)}, {location.lon.toFixed(4)})
                                     </TableCell>
                                 </TableRow>
                             ))}
                         </TableBody>
                     </Table>
                 </TableContainer>
             </Grid>
            
             <Grid item xs={3}>
      <CardItem title="Car on Fire" count={3} color="#dcbb14" iconKey="Car on Fire" />
      <CardItem title="Car Collision" count={7} color="#cf1818" iconKey="Car Collision" />
      <CardItem title="Truck Rollover" count={4} color="#4067b6" iconKey="Truck Rollover" />
    </Grid>
     
             {/* Map Component */}
             <Grid item xs={9}>
                 <MapContainer center={[37.8044, -122.2711]} zoom={12} style={{ height: '50vh', width: '100%' }}>
                     <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                     {accidentLocations.map((location) => (
                         <Marker
                             key={location.id}
                             position={[location.lat, location.lon]}
                             icon={createIcon(location.type)}
                             ref={(ref) => {
                                 if (ref) {
                                     markerRefs.current[location.id] = ref;
                                 }
                             }}
                             eventHandlers={{ click: () => handleAlertClick(location) }}
                         >
                             <Popup>
                                 <Typography variant="body1">{location.type}</Typography>
                                 <Typography variant="body2">Location: ({location.lat.toFixed(4)}, {location.lon.toFixed(4)})</Typography>
                                 <Typography variant="body2">Add: {location.loc}</Typography>
                                 <Button 
                                     variant="contained" 
                                     color="primary" 
                                     onClick={() => handleScheduleMission(location)}
                                 >
                                     Schedule a Mission
                                 </Button>
                             </Popup>
                         </Marker>
                     ))}
                 </MapContainer>
            
             
 
   

    {/* Dialog Component */}
    <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="lg" fullWidth>
        <DialogTitle>Mission Details</DialogTitle>
        <DialogContent>
            <Grid container spacing={2}>
                {/* JSON Data Column */}
                <Grid item xs={6}>
                    {showJsonData ? (
                        <Card variant="outlined" sx={{ maxWidth: 400, margin: 'auto', marginTop: 2 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Accident Details</Typography>
                                <Box mb={2}>
                                    <Typography variant="body2" color="textSecondary">Accident Detected: </Typography>
                                    <Typography variant="body2">{locationData["Accident Detected"]}</Typography>
                                </Box>
                                <Box mb={2}>
                                    <Typography variant="body2" color="textSecondary">Accident Type: </Typography>
                                    <Typography variant="body2">{locationData["Accident Type"]}</Typography>
                                </Box>
                                <Box mb={2}>
                                    <Typography variant="body2" color="textSecondary">Emergency Car On Site: </Typography>
                                    <Typography variant="body2">{locationData["Emergency Car On Site"]}</Typography>
                                </Box>
                                <Box mb={2}>
                                    <Typography variant="body2" color="textSecondary">People On Road Count: </Typography>
                                    <Typography variant="body2">{locationData["People On Road Count"]}</Typography>
                                </Box>
                                <Box mb={2}>
                                    <Typography variant="body2" color="textSecondary">Total Vehicle Count: </Typography>
                                    <Typography variant="body2">{locationData["Total Vehicle Count"]}</Typography>
                                </Box>
                                <Box mb={2}>
                                    <Typography variant="body2" color="textSecondary">Cars Count: </Typography>
                                    <Typography variant="body2">{locationData["Cars Count"]}</Typography>
                                </Box>
                                <Box mb={2}>
                                    <Typography variant="body2" color="textSecondary">Vehicles Invloved : </Typography>
                                    <Typography variant="body2">{locationData["Vehicles Invloved"]}</Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    ) : (
                        <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
                            <CircularProgress />
                            <Typography variant="body2" color="textSecondary">Analyzing... ({timer}s remaining)</Typography>
                        </Box>
                    )}
                </Grid>

                {/* Video Player Column
                <Grid item xs={6}>
                    <Typography variant="h6">Accident Footage</Typography>
                    {videoSrc && (
                        <video width="100%" controls autoPlay>
                            <source src={videoSrc} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    )}
                    
                </Grid> */}
                <Grid item xs={6}>
    <Typography variant="h6">Accident Footage</Typography>
    {videoSrc && (
        <video
            key={videoSrc}  // Key changes whenever videoSrc changes, forcing re-render
            width="100%"
            controls
            autoPlay
        >
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
        </video>
    )}
<Typography variant="h6">Accident Anlaysis</Typography>
    {videoSrcPro && (
        <video
            key={videoSrcPro}  // Key changes whenever videoSrc changes, forcing re-render
            width="100%"
            controls
            autoPlay
        >
            <source src={videoSrcPro} type="video/mp4" />
            Your browser does not support the video tag.
        </video>
    )}
</Grid>
            </Grid>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleDialogClose} color="primary">Close</Button>
        </DialogActions>
    </Dialog>
</Grid>
</Grid>
)}
 
            {activeTab === 1 && (
                <Grid container spacing={2}>
                                     {/* Graph Content */}
                                     <Grid item xs={6}> 
                                         <Line  style={{ height: '160px !important' , border: '1px solid grey',}} data={data} options={options} />
                                     </Grid>
                                     <Grid item xs={6}>
                                         <Bar  style={{ height: ' 160px !important;' , border: '1px solid grey',}} data={datastack} options={optionsstack} />
                                      </Grid>
                                     <Grid item xs={6}>
                                         <Bar   style={{ height: ' 160px !important;' , border: '1px solid grey',}} data={dataheat} options={optionsheat} />
                                     </Grid>
                                </Grid>
            )}
        </Grid>
        
    </Grid>
);
}
export default AlertAndNotification;