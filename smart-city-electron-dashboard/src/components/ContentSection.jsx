import React, { useState } from 'react';

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
    case 'Satellite Data':
      return <div>Satellite Data Content</div>;
    case 'IOT Station':
      return <div>IOT Station Content</div>;
    case 'Drone Station':
        return (
            <div>
              <input type="file" accept="video/*" onChange={handleFileUpload} style={{ display: 'none' }} id="file-upload" />
              <label htmlFor="file-upload" style={{ backgroundColor: '#3f51b5', color: 'white', padding: '10px 15px', borderRadius: '4px', cursor: 'pointer' }}>Upload Video</label>
              {videoUrl && (
                <div>
                  <video controls width="600" height="600">
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
            </div>
          );
    case 'Traffic Camera':
      return <div>Traffic Camera Content</div>;
    default:
      return null;
  }
};

export default ContentSection;
