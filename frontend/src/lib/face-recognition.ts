import * as faceapi from "face-api.js"
import Tesseract from "tesseract.js"

export interface FormData {
  firstName: string
  lastName: string
  age: string
  idNumber: string
}

export interface VerificationResults {
  [key: string]: boolean
}

export const FACE_MATCH_THRESHOLD = 0.5
export const MAX_MATCH_ATTEMPTS = 30

export const optimizeImage = async (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement("canvas")
      // Increase max dimension to preserve more details
      const maxDimension = 500
      let width = img.width
      let height = img.height

      if (width > height) {
        if (width > maxDimension) {
          height = Math.round(height * (maxDimension / width))
          width = maxDimension
        }
      } else {
        if (height > maxDimension) {
          width = Math.round(width * (maxDimension / height))
          height = maxDimension
        }
      }

      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext("2d")
      if (!ctx) {
        reject(new Error("Could not get canvas context"))
        return
      }

      // Draw with better quality settings
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = "high"
      ctx.drawImage(img, 0, 0, width, height)

      const optimizedImg = new Image()
      optimizedImg.onload = () => resolve(optimizedImg)
      optimizedImg.onerror = reject
      // Use higher quality JPEG
      optimizedImg.src = canvas.toDataURL("image/jpeg", 0.9)
    }

    img.onerror = reject
    img.crossOrigin = "anonymous" // Add this to avoid CORS issues
    img.src = URL.createObjectURL(file)
  })
}

export const extractTextFromImage = async (image: File, onProgress?: (stage: string) => void): Promise<string> => {
  try {
    onProgress?.("Reading ID card text...")

    const optimizedImg = await optimizeImage(image)

    const { data } = await Tesseract.recognize(optimizedImg.src, "eng", {
      logger: (m) => console.log("OCR progress:", m),
    } as Tesseract.WorkerOptions)

    // Clean and normalize the extracted text
    const cleanedText = data.text.toLowerCase().replace(/\s+/g, " ").trim()

    console.log("Extracted text:", cleanedText) // For debugging
    return cleanedText
  } catch (error) {
    console.error("OCR error:", error)
    return ""
  }
}

export const extractFaceDescriptor = async (
  image: File,
  onProgress?: (stage: string) => void,
): Promise<Float32Array | null> => {
  try {
    onProgress?.("Detecting face on ID card...")

    const optimizedImg = await optimizeImage(image)

    // Log the image dimensions for debugging
    console.log("Optimized image dimensions:", {
      width: optimizedImg.width,
      height: optimizedImg.height,
    })

    // Try with more lenient parameters first
    let detections = await faceapi
      .detectSingleFace(
        optimizedImg,
        new faceapi.TinyFaceDetectorOptions({
          inputSize: 160,
          scoreThreshold: 0.1, // Lower threshold to detect more faces
        }),
      )
      .withFaceLandmarks(true)
      .withFaceDescriptor()

    // If that fails, try with SSD MobileNet which might be better for ID cards
    if (!detections && faceapi.nets.ssdMobilenetv1.isLoaded) {
      console.log("Trying SSD MobileNet detection as fallback")
      detections = await faceapi
        .detectSingleFace(optimizedImg, new faceapi.SsdMobilenetv1Options())
        .withFaceLandmarks(true)
        .withFaceDescriptor()
    }

    // For debugging
    if (detections) {
      console.log("Face detected successfully:", {
        confidence: detections.detection.score,
        box: detections.detection.box,
      })
    } else {
      console.error("No face detected in the ID card image")
    }

    return detections ? detections.descriptor : null
  } catch (error) {
    console.error("Face extraction error:", error)
    return null
  }
}

export const verifyDataWithID = (
  text: string,
  formData: FormData,
): { isValid: boolean; results: VerificationResults } => {
  const extractedTextLower = text.toLowerCase()
  const results: VerificationResults = {}

  // More strict matching using word boundaries
  const firstNameLower = formData.firstName.toLowerCase().trim()
  results.firstName = new RegExp(`\\b${firstNameLower}\\b`).test(extractedTextLower)

  const lastNameLower = formData.lastName.toLowerCase().trim()
  results.lastName = new RegExp(`\\b${lastNameLower}\\b`).test(extractedTextLower)

  // For age, look for exact number match
  const ageStr = formData.age.trim()
  results.age = new RegExp(`\\b${ageStr}\\b`).test(extractedTextLower)

  // For ID number, look for exact match with optional spaces
  const idNumberPattern = formData.idNumber.toLowerCase().trim().replace(/\s+/g, "\\s*")
  results.idNumber = new RegExp(`\\b${idNumberPattern}\\b`).test(extractedTextLower)

  // All fields must match exactly
  const isValid = Object.values(results).every(Boolean)

  console.log("Verification results:", {
    extractedText: extractedTextLower,
    formData,
    results,
    isValid,
  })

  return { isValid, results }
}

export const loadFaceApiModels = async (onProgress?: (stage: string) => void): Promise<boolean> => {
  try {
    onProgress?.("Loading face detection models...")

    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceLandmark68TinyNet.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      // Add SSD MobileNet as a fallback model - it's better for some types of images
      faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
    ])

    console.log("Models loaded successfully")
    return true
  } catch (err) {
    console.error("Error loading models:", err)
    return false
  }
}

export const compareFaceDescriptors = (descriptor1: Float32Array, descriptor2: Float32Array): number => {
  return faceapi.euclideanDistance(descriptor1, descriptor2)
}

export const detectFaceInVideo = async (
  videoElement: HTMLVideoElement,
): Promise<faceapi.WithFaceDescriptor<
  faceapi.WithFaceLandmarks<{ detection: faceapi.FaceDetection }, faceapi.FaceLandmarks68>
> | null> => {
  try {
    const detections = await faceapi
      .detectSingleFace(
        videoElement,
        new faceapi.TinyFaceDetectorOptions({
          inputSize: 160,
          scoreThreshold: 0.3,
        }),
      )
      .withFaceLandmarks(true)
      .withFaceDescriptor()

    // Convert undefined to null to match our return type
    return detections || null
  } catch (error) {
    console.error("Face detection error:", error)
    return null
  }
}

export const requestCameraAccess = async (): Promise<MediaStream> => {
  return navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: "user",
      width: { ideal: 240 },
      height: { ideal: 180 },
    },
    audio: false,
  })
}

