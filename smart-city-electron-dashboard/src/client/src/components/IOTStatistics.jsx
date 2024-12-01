import React from "react";
import { Bar } from "react-chartjs-2";
import { Card, CardContent, Typography, Grid , Box} from "@mui/material";
import GaugeChart from "react-gauge-chart";

export const IOTCharts = ({ iotData, cardStyle }) => {
    // Aggregate data for unique locations
    const aggregatedData = iotData.reduce((acc, device) => {
        const existingLocation = acc.find((item) => item.Location === device.Location);
        if (existingLocation) {
            // Accumulate speeds and jam factors
            existingLocation["Current Speed (m/s)"] += parseFloat(device["Current Speed (m/s)"]);
            existingLocation["Free Flow Speed (m/s)"] += parseFloat(device["Free Flow Speed (m/s)"]);
            existingLocation["Jam Factor"] += parseFloat(device["Jam Factor"]);
            existingLocation.deviceCount += 1;
        } else {
            acc.push({
                ...device,
                "Current Speed (m/s)": parseFloat(device["Current Speed (m/s)"]),
                "Free Flow Speed (m/s)": parseFloat(device["Free Flow Speed (m/s)"]),
                "Jam Factor": parseFloat(device["Jam Factor"]),
                deviceCount: 1,
            });
        }
        return acc;
    }, []);

    // Calculate average speeds and jam factors for unique locations
    const uniqueLocations = aggregatedData.map((location) => ({
        ...location,
        "Average Current Speed (m/s)": location["Current Speed (m/s)"] / location.deviceCount,
        "Average Free Flow Speed (m/s)": location["Free Flow Speed (m/s)"] / location.deviceCount,
        "Average Jam Factor": location["Jam Factor"] / location.deviceCount,
    }));

    // Calculate overall averages
    const totalLocations = uniqueLocations.length;
    const averageCurrentSpeed =
        uniqueLocations.reduce((sum, location) => sum + location["Average Current Speed (m/s)"], 0) / totalLocations;
    const averageFreeFlowSpeed =
        uniqueLocations.reduce((sum, location) => sum + location["Average Free Flow Speed (m/s)"], 0) / totalLocations;

    // Bar chart data for stations by city
    const cityCounts = uniqueLocations.reduce((acc, location) => {
        const locationParts = location.Location?.split(", ");
        const city = locationParts ? locationParts[locationParts.length - 3] : undefined;
        if (city) {
            acc[city] = (acc[city] || 0) + 1;
        }
        return acc;
    }, {});

    const filteredCityCounts = Object.entries(cityCounts).filter(([city, count]) => city && count > 1);

    const barChartData = {
        labels: filteredCityCounts.map(([city]) => city),
        datasets: [
            {
                label: "Number of Stations",
                data: filteredCityCounts.map(([_, count]) => count),
                backgroundColor: "rgba(33, 150, 243, 0.7)",
                borderColor: "rgba(33, 150, 243, 1)",
                borderWidth: 1,
            },
        ],
    };

    const barChartOptions = {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: "top",
                labels: {
                    color: "#B0E57C",
                    font: {
                        size: 14,
                        weight: "bold",
                    },
                },
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Cities",
                    color: "#B0E57C",
                    font: {
                        size: 14,
                        weight: "bold",
                    },
                },
                ticks: {
                    color: "#B0E57C",
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Number of Stations",
                    color: "#B0E57C",
                    font: {
                        size: 14,
                        weight: "bold",
                    },
                },
                ticks: {
                    color: "#B0E57C",
                },
                beginAtZero: true,
            },
        },
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
                <Card style={cardStyle}>
                    <CardContent>
                        <Typography variant="h6" sx={{ color: "#B0E57C", marginBottom: "10px" }}>
                            Stations by City
                        </Typography>
                        <Bar data={barChartData} options={barChartOptions} style={{ maxHeight: "400px" }} />
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={6}>
                <Card style={cardStyle} sx={{ flex: 1, height:'100%' }}>
                    <CardContent sx={{ height:'100%' }}>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: "10px", 
                                height:'100%'
                            }}
                        >
                            {/* First Speedometer */}
                            <Box sx={{ flex: 1, textAlign: "center" }}>
                                <Typography variant="h6" sx={{ color: "#B0E57C", marginBottom: "10px" }}>
                                    Current Average Speed (Speedometer)
                                </Typography>
                                <GaugeChart
                                    id="current-speedometer"
                                    nrOfLevels={30}
                                    percent={averageCurrentSpeed / 20}
                                    colors={["#FF5F6D", "#FFC371", "#4CAF50"]}
                                    arcWidth={0.2}
                                    textColor="#000"
                                    style={{ maxHeight: "400px"}}
                                    formatTextValue={() => `${averageCurrentSpeed.toFixed(1)} m/s`}
                                />
                            </Box>

                            {/* Second Speedometer */}
                            <Box sx={{ flex: 1, textAlign: "center" }}>
                                <Typography variant="h6" sx={{ color: "#B0E57C", marginBottom: "10px" }}>
                                    Free Flow Average Speed (Speedometer)
                                </Typography>
                                <GaugeChart
                                    id="free-flow-speedometer"
                                    nrOfLevels={30}
                                    percent={averageFreeFlowSpeed / 20}
                                    colors={["#FF5F6D", "#FFC371", "#4CAF50"]}
                                    arcWidth={0.2}
                                    textColor="#000"
                                    style={{ maxHeight: "400px" }}
                                    formatTextValue={() => `${averageFreeFlowSpeed.toFixed(1)} m/s`}
                                />
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={6}>
                <Card style={cardStyle}>

                </Card>
            </Grid>
        </Grid>
    );
};
