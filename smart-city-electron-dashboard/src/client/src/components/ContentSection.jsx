import React, { useState } from 'react';
import Dashboard from '../components/Dashboard'; 
import IoTSection from '../components/IOT';

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
    case 'Traffic Camera':
      return <div>Traffic Camera Content</div>;
    default:
      return null;
  }
};

export default ContentSection;
