import { useRef, useEffect } from "react";
import "./style.css";
import * as faceapi from "face-api.js";

function App() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    startVideo(); 
    loadModels(); 
  }, []);

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: unknown) {
      // Ensure err is a DOMException before accessing `.name`
      if (err instanceof DOMException) {
        if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
          console.error("No webcam found.");
          alert("No webcam found on this device.");
        } else if (err.name === "NotAllowedError") {
          console.error("Webcam access denied.");
          alert("Webcam access was denied. Please allow permissions.");
        } else {
          console.error("Webcam error:", err.message);
        }
      } else {
        console.error("Unexpected error:", err);
      }
    }
  };
  
  

  const loadModels = async () => {
    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        faceapi.nets.faceExpressionNet.loadFromUri("/models"),
      ]);
      
      faceDetection();
    } catch (error) {
      console.error("Error loading models:", error);
    }
  };

  const faceDetection = () => {
    setInterval(async () => {
      if (!videoRef.current || !canvasRef.current) return;

      const detections = await faceapi
        .detectAllFaces(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        )
        .withFaceLandmarks()
        .withFaceExpressions();

      if (!detections) return;

      const displaySize = {
        width: videoRef.current.videoWidth,
        height: videoRef.current.videoHeight,
      };

      let canvas = canvasRef.current?.querySelector("canvas");
      if (!canvas) {
        canvas = faceapi.createCanvasFromMedia(videoRef.current);
        canvasRef.current?.appendChild(canvas);
      }
      
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      faceapi.matchDimensions(canvas, displaySize);

      const resizedDetections = faceapi.resizeResults(detections, displaySize);

      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
    }, 1000);
  };

  return (
    <div className="myapp">
      <h1>Face Detection</h1>
      <div className="video-container">
        <video ref={videoRef} autoPlay muted />
        <div ref={canvasRef} className="appcanvas" />
      </div>
    </div>
  );
}

export default App;
