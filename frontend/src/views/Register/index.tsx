"use client";

import type React from "react";

import { useRef, useState, useEffect } from "react";
import * as faceapi from "face-api.js";
import Tesseract from "tesseract.js";

export default function FaceRecognition() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    idNumber: "",
  });
  const [idCardImage, setIdCardImage] = useState<File | null>(null);
  const [idFaceDescriptor, setIdFaceDescriptor] = useState<Float32Array | null>(
    null
  );
  const [isIdVerified, setIsIdVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [cameraStatus, setCameraStatus] = useState<string>("waiting");
  const [showCamera, setShowCamera] = useState(false);

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load face-api.js models
  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
        await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
        await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
        console.log("📚 Models loaded successfully");
        setModelsLoaded(true);
      } catch (err) {
        console.error("Error loading models:", err);
        setErrorMessage(
          "⚠️ Failed to load face recognition models. Please try again."
        );
      }
    };

    loadModels();

    // Cleanup function
    return () => {
      stopVideo();
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, []);

  // Create video element when needed
  useEffect(() => {
    if (isIdVerified && showCamera) {
      // Ensure we have a clean start
      stopVideo();

      // Small delay to ensure DOM is updated
      setTimeout(() => {
        startVideo();
      }, 100);
    }
  }, [isIdVerified, showCamera]);

  // Handle user input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle ID image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setIdCardImage(event.target.files[0]);
      setErrorMessage(null); // Clear any errors when a new image is uploaded
    }
  };

  // Extract text from ID card using OCR (Tesseract.js)
  const extractTextFromImage = async (image: File): Promise<string> => {
    try {
      const { data } = await Tesseract.recognize(image, "eng");
      return data.text;
    } catch (error) {
      console.error("OCR error:", error);
      return "";
    }
  };

  // Extract face descriptor from ID card
  const extractFaceDescriptor = async (
    image: File
  ): Promise<Float32Array | null> => {
    try {
      const img = await faceapi.bufferToImage(image);
      const detections = await faceapi
        .detectSingleFace(img)
        .withFaceLandmarks()
        .withFaceDescriptor();
      return detections ? detections.descriptor : null;
    } catch (error) {
      console.error("Face extraction error:", error);
      return null;
    }
  };

  // Step 1: Validate ID data and start webcam if ID is correct
  const handleVerification = async () => {
    if (!modelsLoaded) {
      setErrorMessage(
        "⚠️ Face recognition models are still loading. Please wait."
      );
      return;
    }

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.age ||
      !formData.idNumber ||
      !idCardImage
    ) {
      setErrorMessage("⚠️ Please fill in all fields and upload an ID card.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      console.log("📤 Extracting data from ID card...");
      const extractedText = await extractTextFromImage(idCardImage);
      console.log("🔎 Extracted Text:", extractedText);

      // For demo purposes, always consider the data valid
      // In a real app, you would validate the extracted text against the form data
      const isDataValid = true;

      // Uncomment this for real validation:
      /*
      const isDataValid =
        extractedText.toLowerCase().includes(formData.firstName.toLowerCase()) &&
        extractedText.toLowerCase().includes(formData.lastName.toLowerCase()) &&
        extractedText.includes(formData.age) &&
        extractedText.includes(formData.idNumber)
      */

      if (isDataValid) {
        console.log("✅ User input matches ID card!");

        // Extract face descriptor from the ID card image
        const faceDescriptor = await extractFaceDescriptor(idCardImage);
        if (faceDescriptor) {
          console.log("📸 Face detected in ID card!");
          setIdFaceDescriptor(faceDescriptor);
          setIsIdVerified(true);
          setShowCamera(true);

          // We'll let the useEffect trigger the camera
        } else {
          throw new Error("No face detected in the ID card");
        }
      } else {
        throw new Error("Incorrect information on the ID card");
      }
    } catch (error) {
      console.error("Verification error:", error);
      setErrorMessage(
        `⚠️ ${error instanceof Error ? error.message : "Verification failed"}`
      );
      setIsLoading(false);
    }
  };

  // Step 2: Start webcam
  const startVideo = async () => {
    console.log("Starting video initialization...", videoRef.current);
    setCameraStatus("initializing");

    if (!videoRef.current) {
      console.error("Video ref not available");
      setErrorMessage("⚠️ Video initialization failed - ref not available");
      setIsLoading(false);
      return;
    }

    try {
      // First, check if getUserMedia is supported
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("getUserMedia is not supported in this browser");
      }

      // Stop any existing streams
      stopVideo();

      console.log("Requesting camera access...");
      setCameraStatus("requesting_permission");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      console.log("Camera access granted, setting up video stream...");
      setCameraStatus("stream_acquired");

      // Ensure video ref still exists
      if (!videoRef.current) {
        throw new Error("Video element no longer available");
      }

      // Set up the video element
      videoRef.current.srcObject = stream;
      mediaStreamRef.current = stream;

      // Wait for video to be ready using a proper Promise
      await new Promise((resolve, reject) => {
        if (!videoRef.current) {
          reject(new Error("Video element not available"));
          return;
        }

        const videoElement = videoRef.current;

        // Handle successful video load
        videoElement.onloadedmetadata = () => {
          console.log("Video metadata loaded");
          setCameraStatus("metadata_loaded");

          videoElement
            .play()
            .then(() => {
              console.log("Video playback started");
              setCameraStatus("playing");
              resolve(true);
            })
            .catch((error) => {
              console.error("Error playing video:", error);
              reject(error);
            });
        };

        // Handle video errors
        videoElement.onerror = (event) => {
          console.error("Video element error:", event);
          reject(new Error("Video element encountered an error"));
        };
      });

      console.log("Video stream successfully initialized");
      setCameraStatus("ready");
      setErrorMessage(null);

      // Start face detection with a slight delay to ensure video is stable
      setTimeout(() => {
        console.log("Starting face detection...");
        detectAndCompareFace();
      }, 1000);
    } catch (error) {
      console.error("Camera initialization error:", error);
      setCameraStatus("error");

      let errorMsg = "⚠️ Failed to start camera";

      if (error instanceof DOMException) {
        switch (error.name) {
          case "NotAllowedError":
            errorMsg =
              "⚠️ Camera access denied. Please allow camera access and try again.";
            break;
          case "NotFoundError":
            errorMsg =
              "⚠️ No camera found. Please connect a camera and try again.";
            break;
          case "NotReadableError":
            errorMsg =
              "⚠️ Camera is in use by another application. Please close other apps using the camera.";
            break;
          default:
            errorMsg = `⚠️ Camera error: ${error.message}`;
        }
      }

      setErrorMessage(errorMsg);
      setIsLoading(false);
    }
  };

  // Step 3: Detect face and compare it with the ID card face
  const detectAndCompareFace = () => {
    if (!videoRef.current || !idFaceDescriptor) {
      setErrorMessage("⚠️ Video or ID face data not available.");
      setIsLoading(false);
      return;
    }

    const video = videoRef.current;

    // Clear previous interval if it exists
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }

    // Start face detection at regular intervals
    detectionIntervalRef.current = setInterval(async () => {
      if (!video || !idFaceDescriptor) return;

      try {
        const detections = await faceapi
          .detectSingleFace(video)
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (!detections) {
          setErrorMessage(
            "⚠️ Please position your face in the center of the camera."
          );
          return;
        }

        console.log("📸 Face detected in video.");
        setErrorMessage(null); // Clear positioning error message

        const distance = faceapi.euclideanDistance(
          detections.descriptor,
          idFaceDescriptor
        );
        console.log("🔍 Face match distance:", distance);

        // Check if faces match within a threshold (lower value = better match)
        if (distance < 0.6) {
          // Stop the interval
          if (detectionIntervalRef.current) {
            clearInterval(detectionIntervalRef.current);
            detectionIntervalRef.current = null;
          }

          setIsVerified(true);
          setIsLoading(false);
          setSuccessMessage("✅ Registered successfully!");
          console.log("✅ Face matched! Verification successful.");

          // Stop webcam once verified
          stopVideo();
        }
      } catch (error) {
        console.error("Face detection error:", error);
      }
    }, 500); // Check every 500ms for better performance
  };

  // Stop webcam stream
  const stopVideo = () => {
    if (mediaStreamRef.current) {
      const tracks = mediaStreamRef.current.getTracks();
      tracks.forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Reset everything
  const handleReset = () => {
    stopVideo();
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }

    setFormData({
      firstName: "",
      lastName: "",
      age: "",
      idNumber: "",
    });
    setIdCardImage(null);
    setIdFaceDescriptor(null);
    setIsIdVerified(false);
    setIsVerified(false);
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(false);
    setShowCamera(false);
    setCameraStatus("waiting");
  };

  // For testing - manually trigger camera
  const handleManualCameraStart = () => {
    startVideo();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">
          ID Verification
        </h2>

        {isVerified ? (
          // Success state
          <div className="text-center space-y-4">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-xl font-medium text-green-600">
              Verification Complete!
            </h3>
            <p className="text-gray-600">
              You have been successfully registered.
            </p>
            <button
              onClick={handleReset}
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg"
            >
              Start New Verification
            </button>
          </div>
        ) : (
          // Form state
          <>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={isLoading || isIdVerified}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={isLoading || isIdVerified}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="age"
                  className="block text-sm font-medium text-gray-700"
                >
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  disabled={isLoading || isIdVerified}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="idNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  ID Number
                </label>
                <input
                  type="text"
                  id="idNumber"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleChange}
                  disabled={isLoading || isIdVerified}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="idCardImage"
                  className="block text-sm font-medium text-gray-700"
                >
                  Upload ID Card Image
                </label>
                <input
                  type="file"
                  id="idCardImage"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isLoading || isIdVerified}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              {!isIdVerified ? (
                <button
                  onClick={handleVerification}
                  disabled={isLoading || !modelsLoaded}
                  className={`px-6 py-3 rounded-lg text-white ${
                    isLoading || !modelsLoaded
                      ? "bg-blue-300 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  {isLoading ? "Verifying..." : "Verify"}
                </button>
              ) : (
                <div className="text-center space-y-1">
                  <div className="text-sm text-blue-600">
                    Looking for your face...
                  </div>
                  <div className="text-xs text-gray-500">
                    Please position your face in the camera frame
                  </div>
                </div>
              )}
            </div>

            {errorMessage && (
              <div className="mt-4 text-red-500 text-sm text-center p-2 bg-red-50 rounded-md">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="mt-4 text-green-500 text-sm text-center p-2 bg-green-50 rounded-md">
                {successMessage}
              </div>
            )}

            <div className="mt-6" ref={videoContainerRef}>
              {isIdVerified && (
                <div className="space-y-2">
                  <div className="rounded-lg overflow-hidden border-2 border-blue-500">
                    <video
                      ref={videoRef}
                      width="640"
                      height="480"
                      autoPlay
                      playsInline
                      muted
                      className="rounded-lg w-full h-auto bg-gray-100"
                      style={{ minHeight: "360px" }}
                    />
                  </div>
                  {/* Debug info */}
                  <div className="text-xs text-gray-500 text-center">
                    Camera status: {cameraStatus}
                  </div>

                  {/* Manual camera trigger for testing */}
                  {cameraStatus === "error" && (
                    <div className="text-center mt-2">
                      <button
                        onClick={handleManualCameraStart}
                        className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded"
                      >
                        Retry Camera
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {isIdVerified && !isVerified && (
              <div className="text-center text-sm text-gray-500 mt-2">
                Face verification in progress...
              </div>
            )}
          </>
        )}

        {/* Status indicator */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-center">
            <ol className="flex items-center w-full">
              <li
                className={`flex items-center ${
                  formData.firstName &&
                  formData.lastName &&
                  formData.age &&
                  formData.idNumber &&
                  idCardImage
                    ? "text-blue-600"
                    : "text-gray-400"
                }`}
              >
                <span className="flex items-center justify-center w-6 h-6 rounded-full border border-current mr-2">
                  1
                </span>
                <span className="text-xs">Info</span>
              </li>
              <li className="flex-1 border-t-2 mx-2 border-gray-300"></li>
              <li
                className={`flex items-center ${
                  isIdVerified ? "text-blue-600" : "text-gray-400"
                }`}
              >
                <span className="flex items-center justify-center w-6 h-6 rounded-full border border-current mr-2">
                  2
                </span>
                <span className="text-xs">ID Scan</span>
              </li>
              <li className="flex-1 border-t-2 mx-2 border-gray-300"></li>
              <li
                className={`flex items-center ${
                  isVerified ? "text-green-600" : "text-gray-400"
                }`}
              >
                <span className="flex items-center justify-center w-6 h-6 rounded-full border border-current mr-2">
                  3
                </span>
                <span className="text-xs">Face Scan</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
