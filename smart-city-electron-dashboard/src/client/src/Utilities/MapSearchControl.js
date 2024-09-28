import React, { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import 'leaflet-control-geocoder';
import axios from 'axios';
import '../css/mapsearchcontrol.css'; // Ensure your CSS for styling

const MapSearchControl = () => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState(null);
  const map = useMap();

  // Function to handle the search
  const handleSearch = async (searchQuery) => {
    setError('');
    try {
      if (!searchQuery) return;

      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${searchQuery}&format=json`
      );

      if (response.data && response.data.length > 0) {
        const result = response.data[0];
        const lat = parseFloat(result.lat);
        const lon = parseFloat(result.lon);

        // Move the map to the new location
        map.setView([lat, lon], 13); // Adjust zoom level as necessary
      } else {
        setError('Location not found');
      }
    } catch (err) {
      setError('Error occurred while searching');
    }
  };

  // Trigger search on typing
  useEffect(() => {
    if (query.length > 3) {
      const timeoutId = setTimeout(() => {
        handleSearch(query);
      }, 500); // Delay the search to allow typing

      return () => clearTimeout(timeoutId);
    }
  }, [query]);

  return (
    <div className="search-container" style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000 }}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a location..."
        style={{
          padding: '10px',
          marginLeft:'50px',
          fontSize: '16px',
          width: '200px',
          border: '1px solid #ccc',
          borderRadius: '5px',
        }}
      />
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default MapSearchControl;
