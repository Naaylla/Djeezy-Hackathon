import { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import Tesseract from "tesseract.js";

function FaceRecognition() {
  const videoRef = useRef<HTMLVideoElement>(null);
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
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isIdVerified, setIsIdVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ✅ Load models
  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
      console.log("📚 Models loaded successfully");
    };

    loadModels().catch((err) => console.error("Error loading models:", err));
  }, []);

  // ✅ Handle user input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setIdCardImage(event.target.files[0]);
    }
  };

  // ✅ Extract text from ID card
  const extractTextFromImage = async (image: File): Promise<string> => {
    try {
      const { data } = await Tesseract.recognize(image, "eng");
      return data.text;
    } catch (error) {
      console.error("OCR error:", error);
      return "";
    }
  };

  // ✅ Extract face descriptor from ID card
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

  // ✅ Step 1: Validate & Extract Data
  const handleVerification = async () => {
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

    setIsLoading(true); // Set loading to true when the verification process starts
    setErrorMessage(null); // Clear previous error messages

    console.log("📤 Extracting data from ID card...");
    const extractedText = await extractTextFromImage(idCardImage);
    console.log("🔎 Extracted Text:", extractedText);

    // Extracted text and face image will be printed
    console.log(`Name: ${formData.firstName}, ${formData.lastName}`);
    console.log(`Age: ${formData.age}`);
    console.log(`ID Number: ${formData.idNumber}`);

    if (
      extractedText.includes(formData.firstName) &&
      extractedText.includes(formData.lastName) &&
      extractedText.includes(formData.age) &&
      extractedText.includes(formData.idNumber)
    ) {
      console.log("✅ User input matches ID card!");

      // Extract the face descriptor from the ID card
      const faceDescriptor = await extractFaceDescriptor(idCardImage);
      if (faceDescriptor) {
        console.log("📸 Face detected in ID card!");
        setIdFaceDescriptor(faceDescriptor);

        // Now set the ID as verified
        setIsIdVerified(true); // ID is verified

        // Start face recognition process
        const faceDetected = await detectAndCompareFace();
        if (faceDetected) {
          console.log("✅ Face match confirmed.");
          setIsVerified(true); // Set verification status
        } else {
          console.log("⚠️ Face mismatch or detection failed.");
          setErrorMessage("⚠️ Face does not match the ID card.");
        }
      } else {
        console.log("⚠️ No face detected in the ID card.");
        setErrorMessage("⚠️ No face detected in the ID card.");
      }
    } else {
      console.log("⚠️ User input does not match ID card.");
      setErrorMessage("⚠️ Incorrect information on the ID card.");
    }

    setIsLoading(false); // Set loading to false once the verification process is complete
  };

  // ✅ Detect and compare the user's face with the ID card
  const detectAndCompareFace = async () => {
    if (!videoRef.current || !idFaceDescriptor) return false;

    const video = videoRef.current;

    // Wait until the video is ready and playing
    if (isVideoReady) {
      const canvas = faceapi.createCanvasFromMedia(video);
      document.body.append(canvas);

      const detections = await faceapi
        .detectSingleFace(video)
        .withFaceLandmarks()
        .withFaceDescriptor();
      if (!detections) {
        console.log("⚠️ No face detected in video.");
        setErrorMessage("⚠️ No face detected in the webcam.");
        return false;
      }

      console.log("📸 Face detected in video.");

      const distance = faceapi.euclideanDistance(
        detections.descriptor,
        idFaceDescriptor
      );
      console.log("🔍 Face match distance:", distance);

      return distance < 0.6; // Typically, a threshold to determine a match
    } else {
      console.log("⚠️ Video is not ready yet.");
      setErrorMessage("⚠️ Webcam is not ready.");
      return false;
    }
  };

  useEffect(() => {
    // ✅ Initialize webcam stream
    const startVideo = async () => {
      if (videoRef.current) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          videoRef.current.srcObject = stream;
        } catch (err) {
          console.error("⚠️ Error accessing webcam:", err);
          setErrorMessage("⚠️ Error accessing the webcam.");
        }
      }
    };

    startVideo();

    // ✅ Wait for the video to be ready
    if (videoRef.current) {
      const video = videoRef.current;

      // Wait for the 'canplay' event to ensure the video is ready to play
      video.addEventListener("canplay", () => {
        setIsVideoReady(true);
        console.log("✅ Video is ready for face detection");
      });
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">
          ID Verification
        </h2>
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
              type="text"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
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
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label
              htmlFor="idCardImage"
              className="block text-sm font-medium text-gray-700"
            >
              ID Card Image
            </label>
            <input
              type="file"
              id="idCardImage"
              name="idCardImage"
              onChange={handleImageUpload}
              accept="image/*"
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            />
          </div>

          {errorMessage && (
            <p className="text-red-500 text-sm text-center">{errorMessage}</p>
          )}

          <button
            onClick={handleVerification}
            disabled={isLoading}
            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md disabled:bg-gray-400"
          >
            {isLoading ? "Verifying..." : "Verify"}
          </button>
        </div>
      </div>

      <div className="mt-8">
        {isVerified ? (
          <p className="text-green-600 text-lg">✅ Registration Successful!</p>
        ) : (
          <p className="text-red-600 text-lg">⚠️ Verification Failed</p>
        )}
      </div>

      <video
        ref={videoRef}
        className="hidden"
        width="640"
        height="480"
        autoPlay
        muted
      ></video>
    </div>
  );
}

export default FaceRecognition;
