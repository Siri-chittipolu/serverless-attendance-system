import React, { useState } from 'react';
import WebcamCapture from './WebcamCapture';

function App() {
  const [photoBlob, setPhotoBlob] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  // Make this function async to use await inside
const handleCapture = async (blob) => {
  setPhotoBlob(blob);
  setStatusMessage('Uploading...');

  try {
    console.log("Requesting pre-signed URL...");

    const res = await fetch("https://xxgqw1jz04.execute-api.ap-south-1.amazonaws.com/prod/GeneratePresignedURL");
    const data = await res.json();

    console.log("Pre-signed URL response:", data);

    const uploadResult = await fetch(data.uploadURL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'image/jpeg',
      },
      body: blob,
    });

    console.log("Upload response status:", uploadResult.status);
    console.log("Upload response statusText:", uploadResult.statusText);

    if (uploadResult.ok) {
      setStatusMessage(`Uploaded successfully as ${data.key}`);
    } else {
      setStatusMessage(`Upload failed. Status: ${uploadResult.status} ${uploadResult.statusText}`);
    }

  } catch (error) {
    console.error('Upload error:', error);
    setStatusMessage('Error uploading image.');
  }
};



  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Attendance System - Capture Photo</h1>
      <WebcamCapture onCapture={handleCapture} />
      {photoBlob && <p>Photo captured! Upload in progress...</p>}
      {statusMessage && <p><strong>{statusMessage}</strong></p>}
    </div>
  );
}

export default App;
