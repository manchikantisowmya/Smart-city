import React, { useState } from 'react';
import Dashboard from '../components/Dashboard'; 
import IoTSection from '../components/IOT';
import CCTVSection from '../components/CCTV';
import Drone from '../components/Drone';

const ContentSection = ({ selectedItem }) => {
  const [videoUrl, setVideoUrl] = useState('');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check if the selected file is a video file
    if (!file.type.startsWith('video/')) {
      alert('Please select a video file.');
      return;
    }

    const url = URL.createObjectURL(file);
    setVideoUrl(url);
  };

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
        <CCTVSection videoUrl={videoUrl} handleFileUpload={handleFileUpload} />  // Pass the videoUrl and file upload handler as props
      );
    default:
      return null;
  }
};

export default ContentSection;
