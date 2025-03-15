"use client";

import type React from "react";

import { useRef, useState, useEffect } from "react";
import * as faceapi from "face-api.js";
import Tesseract from "tesseract.js";

export default function FaceRecognition() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
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
  const [faceVerificationFailed, setFaceVerificationFailed] = useState(false);

  // Loading stage state
  const [loadingStage, setLoadingStage] = useState("");

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const processingImageRef = useRef<boolean>(false);
  const faceMatchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const matchAttemptsRef = useRef<number>(0);
  const MAX_MATCH_ATTEMPTS = 30; // About 3 seconds with 100ms interval

  // Load face-api.js models - optimized to load faster
  useEffect(() => {
    const loadModels = async () => {
      try {
        setLoadingStage("Loading face detection models...");

        // Only load the essential models for faster loading
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"), // Faster than SSD Mobilenet
          faceapi.nets.faceLandmark68TinyNet.loadFromUri("/models"), // Tiny version is faster
          faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        ]);

        console.log("📚 Models loaded successfully");
        setModelsLoaded(true);
        setLoadingStage("");
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
      if (faceMatchTimeoutRef.current) {
        clearTimeout(faceMatchTimeoutRef.current);
      }
    };
  }, []);

  // Create video element when needed
  useEffect(() => {
    if (isIdVerified && showCamera) {
      // Ensure we have a clean start
      stopVideo();

      // Start video immediately
      startVideo();
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

  // Optimize image for faster processing
  const optimizeImage = async (file: File): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        // Create a canvas to resize the image
        const canvas = document.createElement("canvas");
        // Resize to smaller dimensions for faster processing
        const maxDimension = 300;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDimension) {
            height = Math.round(height * (maxDimension / width));
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round(width * (maxDimension / height));
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw the resized image
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas to an image element
        const optimizedImg = new Image();
        optimizedImg.onload = () => resolve(optimizedImg);
        optimizedImg.onerror = reject;
        optimizedImg.src = canvas.toDataURL("image/jpeg", 0.7); // Lower quality for faster processing
      };

      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  // Extract text from ID card using OCR (Tesseract.js) - highly optimized for speed
  const extractTextFromImage = async (image: File): Promise<string> => {
    try {
      setLoadingStage("Reading ID card text...");

      // Optimize image before OCR
      const optimizedImg = await optimizeImage(image);

      // Use minimal settings for faster processing
      // Use type assertion to fix TypeScript error
      const { data } = await Tesseract.recognize(optimizedImg.src, "eng", {
        logger: (m) => console.log("OCR progress:", m),
      } as Tesseract.WorkerOptions);

      return data.text;
    } catch (error) {
      console.error("OCR error:", error);
      return "";
    }
  };

  // Extract face descriptor from ID card - highly optimized for speed
  const extractFaceDescriptor = async (
    image: File
  ): Promise<Float32Array | null> => {
    try {
      setLoadingStage("Detecting face on ID card...");

      // Optimize image before face detection
      const optimizedImg = await optimizeImage(image);

      // Use TinyFaceDetector which is faster than SSD Mobilenet
      const detections = await faceapi
        .detectSingleFace(
          optimizedImg,
          new faceapi.TinyFaceDetectorOptions({
            inputSize: 160,
            scoreThreshold: 0.3,
          })
        )
        .withFaceLandmarks(true) // Use tiny landmarks model
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
    setFaceVerificationFailed(false);

    try {
      console.log("📤 Extracting data from ID card...");
      const extractedText = await extractTextFromImage(idCardImage);
      console.log("🔎 Extracted Text:", extractedText);

      // Very lenient text matching for faster verification
      const extractedTextLower = extractedText.toLowerCase();
      const firstNameLower = formData.firstName.toLowerCase();
      const lastNameLower = formData.lastName.toLowerCase();

      // Check if any part of the name is in the extracted text
      const isFirstNameFound = extractedTextLower.includes(firstNameLower);
      const isLastNameFound = extractedTextLower.includes(lastNameLower);

      // Check if ID number is in the extracted text (more strict)
      const isIdNumberFound = extractedTextLower.includes(formData.idNumber);

      // Age can be in various formats, so be very lenient
      const isAgeFound =
        extractedTextLower.includes(formData.age) ||
        extractedTextLower.includes(`age: ${formData.age}`) ||
        extractedTextLower.includes(`age ${formData.age}`) ||
        extractedTextLower.includes(`${formData.age} years`);

      // For demo purposes, require only name and ID to match
      const isDataValid =
        (isFirstNameFound || isLastNameFound) && isIdNumberFound;

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
      setLoadingStage("");
    }
  };

  // Step 2: Start webcam - optimized for faster initialization
  const startVideo = async () => {
    console.log("Starting video initialization...", videoRef.current);
    setCameraStatus("initializing");
    setLoadingStage("Initializing camera...");
    setFaceVerificationFailed(false);

    if (!videoRef.current) {
      console.error("Video ref not available");
      setErrorMessage("⚠️ Video initialization failed - ref not available");
      setIsLoading(false);
      setLoadingStage("");
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

      // Use very low resolution for much faster processing
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 240 }, // Very low resolution for faster processing
          height: { ideal: 180 },
        },
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

      // Reset match attempts counter
      matchAttemptsRef.current = 0;

      // Start face detection immediately
      detectAndCompareFace();

      // Set a timeout for face matching - if no match after MAX_ATTEMPTS, show error
      if (faceMatchTimeoutRef.current) {
        clearTimeout(faceMatchTimeoutRef.current);
      }

      faceMatchTimeoutRef.current = setTimeout(() => {
        if (!isVerified && detectionIntervalRef.current) {
          clearInterval(detectionIntervalRef.current);
          detectionIntervalRef.current = null;
          setErrorMessage(
            "⚠️ Face verification failed. The face does not match the ID card."
          );
          setIsLoading(false);
          setLoadingStage("");
          setFaceVerificationFailed(true);
          // Stop the webcam when face verification fails
          stopVideo();
        }
      }, MAX_MATCH_ATTEMPTS * 100 + 1000); // A bit longer than our max attempts
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
      setLoadingStage("");
    }
  };

  // Step 3: Detect face and compare it with the ID card face - highly optimized for speed
  const detectAndCompareFace = () => {
    if (!videoRef.current || !idFaceDescriptor) {
      setErrorMessage("⚠️ Video or ID face data not available.");
      setIsLoading(false);
      return;
    }

    const video = videoRef.current;
    setLoadingStage("Comparing your face with ID...");

    // Clear previous interval if it exists
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }

    // Process every other frame to reduce CPU usage
    let frameCount = 0;

    // Start face detection at regular intervals - using a faster interval and lower confidence threshold
    detectionIntervalRef.current = setInterval(async () => {
      if (!video || !idFaceDescriptor) return;

      // Increment match attempts
      matchAttemptsRef.current++;

      // If we've exceeded max attempts, stop trying
      if (matchAttemptsRef.current > MAX_MATCH_ATTEMPTS) {
        if (detectionIntervalRef.current) {
          clearInterval(detectionIntervalRef.current);
          detectionIntervalRef.current = null;
        }
        setErrorMessage(
          "⚠️ Face verification failed. The face does not match the ID card."
        );
        setIsLoading(false);
        setLoadingStage("");
        setFaceVerificationFailed(true);
        // Stop the webcam when face verification fails
        stopVideo();
        return;
      }

      // Skip every other frame for better performance
      frameCount++;
      if (frameCount % 2 !== 0) return;

      // Skip if already processing an image
      if (processingImageRef.current) return;

      processingImageRef.current = true;

      try {
        // Use TinyFaceDetector which is much faster than SSD Mobilenet
        const detections = await faceapi
          .detectSingleFace(
            video,
            new faceapi.TinyFaceDetectorOptions({
              inputSize: 160, // Smaller input size for faster processing
              scoreThreshold: 0.3, // Lower threshold for faster detection
            })
          )
          .withFaceLandmarks(true) // Use tiny landmarks model
          .withFaceDescriptor();

        if (!detections) {
          setErrorMessage(
            "⚠️ Please position your face in the center of the camera."
          );
          processingImageRef.current = false;
          return;
        }

        console.log("📸 Face detected in video.");
        setErrorMessage(null); // Clear positioning error message

        const distance = faceapi.euclideanDistance(
          detections.descriptor,
          idFaceDescriptor
        );
        console.log("🔍 Face match distance:", distance);

        // Use a reasonable threshold for matching (0.6)
        // Lower values = stricter matching, higher values = more lenient
        if (distance < 0.6) {
          // Stop the interval and timeout
          if (detectionIntervalRef.current) {
            clearInterval(detectionIntervalRef.current);
            detectionIntervalRef.current = null;
          }
          if (faceMatchTimeoutRef.current) {
            clearTimeout(faceMatchTimeoutRef.current);
            faceMatchTimeoutRef.current = null;
          }

          setIsVerified(true);
          setIsLoading(false);
          setSuccessMessage("✅ Registered successfully!");
          setLoadingStage("");
          console.log("✅ Face matched! Verification successful.");

          // Stop webcam once verified
          stopVideo();
        } else {
          // Face detected but not matching
          console.log(
            `Face detected but not matching. Attempt ${matchAttemptsRef.current}/${MAX_MATCH_ATTEMPTS}`
          );
        }

        processingImageRef.current = false;
      } catch (error) {
        console.error("Face detection error:", error);
        processingImageRef.current = false;
      }
    }, 100); // Check every 100ms
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

  // Retry face verification
  const handleRetryFaceVerification = () => {
    // Clear error message
    setErrorMessage(null);
    // Reset match attempts
    matchAttemptsRef.current = 0;
    // Reset face verification failed state
    setFaceVerificationFailed(false);
    // Start video again
    startVideo();
  };

  // Reset everything
  const handleReset = () => {
    stopVideo();
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    if (faceMatchTimeoutRef.current) {
      clearTimeout(faceMatchTimeoutRef.current);
      faceMatchTimeoutRef.current = null;
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
    setLoadingStage("");
    matchAttemptsRef.current = 0;
    setFaceVerificationFailed(false);
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

            {/* Loading spinner indicator */}
            {isLoading && loadingStage && (
              <div className="mt-4 flex items-center justify-center flex-col">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-2"></div>
                <div className="text-sm text-center">{loadingStage}</div>
              </div>
            )}

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
              {isIdVerified && !faceVerificationFailed && (
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
                    <canvas ref={canvasRef} className="hidden" />
                  </div>

                  {/* Status info */}
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Camera: {cameraStatus}</span>
                    {loadingStage && <span>{loadingStage}</span>}
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

            {/* Retry button for face verification */}
            {isIdVerified && faceVerificationFailed && (
              <div className="text-center mt-4">
                <button
                  onClick={handleRetryFaceVerification}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Retry Face Verification
                </button>
              </div>
            )}

            {isIdVerified && !isVerified && !faceVerificationFailed && (
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
