import React, { useRef, useState, useEffect } from 'react';

function WebcamCapture({ onCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          // Wait for metadata before playing video to avoid play() interruption error
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play().catch(err => {
              console.warn('⚠️ Video play interrupted:', err);
            });
          };
        }
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
    <div className="max-w-sm mx-auto bg-white rounded-3xl shadow-2xl p-6 flex flex-col items-center">
      <video
        ref={videoRef}
        className="rounded-2xl border-4 border-indigo-500 shadow-lg mb-6 w-full aspect-video object-cover"
        playsInline
        muted
      />
      <button
        onClick={capturePhoto}
        className="w-full py-3 rounded-full bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 transition-colors shadow-md active:scale-95 transform focus:outline-none focus:ring-4 focus:ring-indigo-300"
        aria-label="Capture Photo"
      >
        📸 Capture Photo
      </button>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {capturedImage && (
        <img
          src={capturedImage}
          alt="Captured"
          className="mt-8 rounded-3xl border-4 border-indigo-300 shadow-xl w-full max-h-64 object-contain"
        />
      )}
    </div>
  );
}

export default WebcamCapture;
