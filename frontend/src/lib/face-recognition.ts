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
      const maxDimension = 300
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

      ctx.drawImage(img, 0, 0, width, height)

      const optimizedImg = new Image()
      optimizedImg.onload = () => resolve(optimizedImg)
      optimizedImg.onerror = reject
      optimizedImg.src = canvas.toDataURL("image/jpeg", 0.7)
    }

    img.onerror = reject
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

    return data.text
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

    const detections = await faceapi
      .detectSingleFace(
        optimizedImg,
        new faceapi.TinyFaceDetectorOptions({
          inputSize: 160,
          scoreThreshold: 0.3,
        }),
      )
      .withFaceLandmarks(true)
      .withFaceDescriptor()

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

  const firstNameLower = formData.firstName.toLowerCase()
  results.firstName = extractedTextLower.includes(firstNameLower)

  const lastNameLower = formData.lastName.toLowerCase()
  results.lastName = extractedTextLower.includes(lastNameLower)

  const agePattern = new RegExp(`\\b${formData.age}\\b`)
  results.age = agePattern.test(extractedTextLower)

  const idNumberLower = formData.idNumber.toLowerCase()
  results.idNumber = extractedTextLower.includes(idNumberLower)

  const isValid = Object.values(results).every(Boolean)

  return { isValid, results }
}

export const loadFaceApiModels = async (onProgress?: (stage: string) => void): Promise<boolean> => {
  try {
    onProgress?.("Loading face detection models...")

    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceLandmark68TinyNet.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
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
  > | null | undefined> => {
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
  
      return detections ?? undefined 
    } catch (error) {
      console.error("Face detection error:", error)
      return undefined 
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

