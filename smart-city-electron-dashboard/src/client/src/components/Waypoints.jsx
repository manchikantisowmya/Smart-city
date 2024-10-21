import React from 'react';
import {Button} from '@mui/material';

function Waypoints({ missionData,onBackToMission }) {
  const { mission_type, drone_station_id, user_id, mission_id, mission_name, mission_description, mission_start_time, mission_end_time } = missionData || {};

  const iframeSrc = `my-app1.html?serviceType=${encodeURIComponent(mission_type)}&droneId=${encodeURIComponent(drone_station_id)}&tenantId=${encodeURIComponent(user_id)}&missionId=${encodeURIComponent(mission_id)}&missionName=${encodeURIComponent(mission_name)}&missionDesc=${encodeURIComponent(mission_description)}&missionStartTime=${encodeURIComponent(mission_start_time)}&missionEndTime=${encodeURIComponent(mission_end_time)}`;
  return (
    <div>
      <iframe
        id="myFrame"
        src={iframeSrc}
        height={920}
        frameBorder="0"
        scrolling="no"
      ></iframe>
      <Button
        variant="contained"
        color="secondary"
        
        onClick={onBackToMission} // On click, call the parent function to go back to monitoring
        sx={{ marginTop: '5px', float:'right', width:'20%' }}
      >
        Back to Missions
      </Button>
    </div>

  );
}

export default Waypoints;
