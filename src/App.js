import React, { useState } from 'react';
import './index.css';
import WebcamCapture from './WebcamCapture';
import AttendanceSummary from './AttendanceSummary';
import { FaCamera, FaChartBar } from 'react-icons/fa';

const API_BASE_URL = {
  upload: "https://xxgqw1jz04.execute-api.ap-south-1.amazonaws.com/prod",
  status: "https://p4d4ct8vla.execute-api.ap-south-1.amazonaws.com/prod"
};

function App() {
  const [photoBlob, setPhotoBlob] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const handleCapture = async (blob) => {
    setPhotoBlob(blob);
    setStatusMessage('📤 Uploading...');

    try {
      const res = await fetch(`${API_BASE_URL.upload}/GeneratePresignedURL`);
      const data = await res.json();
      const uploadResult = await fetch(data.uploadURL, {
        method: 'PUT',
        headers: { 'Content-Type': 'image/jpeg' },
        body: blob,
      });

      if (uploadResult.ok) {
        setStatusMessage("✅ Uploaded successfully. Checking attendance...");
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

          if (data.status === "Present") {
            setStatusMessage(`✅ Marked Present: ${data.employeeName}`);
            clearInterval(intervalId);
            setIsChecking(false);
            resolve(true);
          } else if (data.status === "NotPresent" || data.status === "pending") {
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
      }, 2000);
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-6">
      <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-xl p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center text-indigo-600">📝 Attendance System</h1>

        <button
          onClick={() => setShowSummary(!showSummary)}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
        >
          {showSummary ? <FaCamera /> : <FaChartBar />}
          {showSummary ? "Switch to Photo Upload" : "View Attendance Summary"}
        </button>

        {showSummary ? (
          <AttendanceSummary />
        ) : (
          <>
            <WebcamCapture onCapture={handleCapture} />
            {photoBlob && (
              <p className="text-green-600 font-medium mt-3">📸 Photo captured!</p>
            )}
            {statusMessage && (
              <p className="font-semibold mt-2">{statusMessage}</p>
            )}
            {isChecking && (
              <p className="text-yellow-600 animate-pulse">⏳ Polling attendance status...</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
