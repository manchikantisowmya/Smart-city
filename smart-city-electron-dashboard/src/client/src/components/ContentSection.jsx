import React, { useState } from 'react';
import Dashboard from '../components/Dashboard'; 
import IoTSection from '../components/IOT';
import CCTVDashboard from './CCTV';
import Drone from '../components/Drone';

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
    case 'Drone Station':
        return(
          <Drone/>
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
