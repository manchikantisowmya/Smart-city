import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Grid, Typography, MenuItem } from '@mui/material';

const Search = ({ cities, drones, highways, exits }) => {
    const [searchFields, setSearchFields] = useState({
        state: 'California', // Default State
        city: '',
        droneId: '',
        zip: '',
        highway: '',
        exitNo: ''
    });

    const [filteredCities, setFilteredCities] = useState([]);

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchFields({
            ...searchFields,
            [name]: value,
        });

        // If the field is "city", filter the cities after typing 3 or more letters
        if (name === 'city' && value.length >= 3) {
            const matchingCities = cities.filter(city =>
                city.toLowerCase().startsWith(value.toLowerCase())
            );
            setFilteredCities(matchingCities);
        } else if (name === 'city' && value.length < 3) {
            setFilteredCities([]); // Clear filtered cities if less than 3 characters
        }
    };

    // Handle search button click
    const handleSearch = () => {
        // Perform search logic using searchFields
        console.log(searchFields);
    };
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
    return (
        <Box sx={{ backgroundColor: '#1a1a3d', color: 'white', borderRadius: '8px', height: '20vh' }}>
            <Typography variant="h6">Search by Location</Typography>
            <Grid container spacing={2}>
                {/* State Dropdown */}
                <Grid item xs={12} md={3}>
                    <TextField
                        fullWidth
                        name="state"
                        label="State"
                        value={searchFields.state}
                        onChange={handleInputChange}
                        select
                        sx={fieldStyle}
                        InputProps={{ style: inputStyle }}
                    >
                        {/* Only one default option (California) */}
                        <MenuItem value="California">California</MenuItem>
                    </TextField>
                </Grid>

                {/* City Input with Dropdown */}
                <Grid item xs={12} md={3}>
                    <TextField
                        fullWidth
                        name="city"
                        label="City"
                        value={searchFields.city}
                        onChange={handleInputChange}
                        sx={fieldStyle}
                        InputProps={{ style: inputStyle }}
                    >
                    </TextField>
                </Grid>

                <Grid item xs={12} md={2}>
                    <Button variant="contained" color="primary" onClick={handleSearch}>
                        Search
                    </Button>
                </Grid>
            </Grid>

            <Box sx={{ marginTop: '20px' }}>
                <Typography variant="subtitle1">Advanced Search</Typography>
                <Grid container spacing={2}>
                    {drones && <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth name="droneId"   label="Drone ID" value={searchFields.droneId}  onChange={handleInputChange}
                            sx={fieldStyle}    select
                            InputProps={{ style: inputStyle }}
                            SelectProps={{
                                MenuProps: {
                                  PaperProps: {
                                    style: {
                                      maxHeight: 150, 
                                      backgroundColor: '#120639', 
                                      color: 'white', 
                                      overflow: 'auto', 
                                    },
                                  },
                                },
                              }}
                        >
                            {drones.map((drone) => (
                                <MenuItem key={drone.drone_id} value={drone.drone_id} sx={{backgroundColor: '#120639', color: 'white','&:hover': { backgroundColor: '#383858'},}}>
                                    {drone.drone_id}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>}

                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            name="zip"
                            label="Zip"
                            value={searchFields.zip}
                            onChange={handleInputChange}
                            sx={fieldStyle}
                            InputProps={{ style: inputStyle }}
                        />
                    </Grid>

                    {highways && <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            name="highway"
                            label="Highway"
                            value={searchFields.highway}
                            onChange={handleInputChange}
                            sx={fieldStyle}
                            InputProps={{ style: inputStyle }}
                        />
                    </Grid>}

                    {exits &&<Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            name="exitNo"
                            label="Exit No."
                            value={searchFields.exitNo}
                            onChange={handleInputChange}
                            sx={fieldStyle}
                            InputProps={{ style: inputStyle }}
                        />
                    </Grid>}
                </Grid>
            </Box>
        </Box>
    );
};

export default Search;
