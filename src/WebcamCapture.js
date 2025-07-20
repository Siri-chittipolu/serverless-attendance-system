import React, { useRef, useState, useEffect } from 'react';

function WebcamCapture({ onCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      })
      .catch(err => console.error('Error accessing webcam:', err));
  }, []);

  const capturePhoto = () => {
    const width = videoRef.current.videoWidth;
    const height = videoRef.current.videoHeight;

    canvasRef.current.width = width;
    canvasRef.current.height = height;
    const ctx = canvasRef.current.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, width, height);

    canvasRef.current.toBlob(blob => {
      setCapturedImage(URL.createObjectURL(blob));
      onCapture(blob);
    }, 'image/jpeg');
  };

  return (
    <div className="p-4 rounded-xl shadow-xl bg-white w-fit mx-auto text-center">
      <video
        ref={videoRef}
        className="rounded-md border border-gray-300 shadow-sm mb-4"
        style={{ width: '320px', height: '240px' }}
      />
      <button
        onClick={capturePhoto}
        className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        📸 Capture Photo
      </button>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {capturedImage && (
        <img
          src={capturedImage}
          alt="Captured"
          className="mt-4 rounded border border-gray-200"
        />
      )}
    </div>
  );
}

export default WebcamCapture;
