import React, { useState } from 'react';
import WebcamCapture from './WebcamCapture';

// Two APIs: one for upload, one for attendance status
const API_BASE_URL = {
  upload: "https://xxgqw1jz04.execute-api.ap-south-1.amazonaws.com/prod",
  status: "https://wd1hlmhbq1.execute-api.ap-south-1.amazonaws.com/prod"
};

function App() {
  const [photoBlob, setPhotoBlob] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  const handleCapture = async (blob) => {
    setPhotoBlob(blob);
    setStatusMessage('📤 Uploading...');

    try {
      console.log("🔄 Requesting pre-signed URL...");
      const res = await fetch(`${API_BASE_URL.upload}/GeneratePresignedURL`);
      const data = await res.json();
      console.log("✅ Pre-signed URL response:", data);

      const uploadResult = await fetch(data.uploadURL, {
        method: 'PUT',
        headers: { 'Content-Type': 'image/jpeg' },
        body: blob,
      });

      if (uploadResult.ok) {
        setStatusMessage("✅ Uploaded successfully. Checking attendance...");
        console.log("📤 Image uploaded, key:", data.key);
        await pollAttendanceStatus(data.key);
      } else {
        setStatusMessage(`❌ Upload failed. Status: ${uploadResult.status}`);
      }

    } catch (error) {
      console.error('🚨 Upload error:', error);
      setStatusMessage('❌ Error uploading image.');
    }
  };

  const pollAttendanceStatus = async (imageKey) => {
  setIsChecking(true);
  let attempts = 0;
  const maxAttempts = 10;

  return new Promise((resolve) => {
    const intervalId = setInterval(async () => {
      attempts++;

      try {
        const res = await fetch(`${API_BASE_URL.status}/getAttendanceStatus?imageKey=${encodeURIComponent(imageKey)}`);
        const data = await res.json();
        console.log("🔁 Polling attempt", attempts, "→", data);

        if (data.status === "Present") {
          setStatusMessage(`✅ Marked Present: ${data.employeeName}`);
          clearInterval(intervalId);
          setIsChecking(false);
          resolve(true);
        } else if (data.status === "NotPresent") {
          setStatusMessage("❌ No Match Found");
          clearInterval(intervalId);
          setIsChecking(false);
          resolve(false);
        }
        else if (data.status === "pending") {
          setStatusMessage("❌ No Match Found");
          clearInterval(intervalId);
          setIsChecking(false);
          resolve(false);
        } else {
          setStatusMessage("⏳ Checking attendance...");
        }

        if (attempts >= maxAttempts) {
          setStatusMessage("⚠️ Attendance check timed out");
          clearInterval(intervalId);
          setIsChecking(false);
          resolve(false);
        }

      } catch (err) {
        console.error("🚨 Polling error:", err);
        setStatusMessage("⚠️ Error checking attendance status");
        clearInterval(intervalId);
        setIsChecking(false);
        resolve(false);
      }
    }, 2000); // every 2 seconds
  });
};


  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Attendance System - Capture Photo</h1>
      <WebcamCapture onCapture={handleCapture} />
      {photoBlob && <p>📸 Photo captured!</p>}
      {statusMessage && <p><strong>{statusMessage}</strong></p>}
      {isChecking && <p>⏳ Polling attendance status...</p>}
    </div>
  );
}

export default App;
