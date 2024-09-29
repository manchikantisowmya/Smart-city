import React, { useState } from 'react';
import Dashboard from '../components/Dashboard'; 
import IoTSection from '../components/IOT';
import CCTVDashboard from '../components/CCTV';

const ContentSection = ({ selectedItem }) => {
  const [videoUrl, setVideoUrl] = useState('');

  
  switch (selectedItem) {
    case 'Dashboard':
      return (
        <Dashboard />
      )
    case 'IoT Station':
      return (
        <IoTSection />
      )
    case 'Traffic Camera':
      return (
        <CCTVDashboard/>
      );
    default:
      return null;
  }
};

export default ContentSection;
