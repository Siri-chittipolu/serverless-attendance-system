import React, { useRef, useState } from 'react';

function WebcamCapture({ onCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);

  // Start webcam
  React.useEffect(() => {
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
    <div>
      <video ref={videoRef} style={{ width: '320px', height: '240px' }} />
      <button onClick={capturePhoto}>Capture Photo</button>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {capturedImage && <img src={capturedImage} alt="Captured" />}
    </div>
  );
}

export default WebcamCapture;