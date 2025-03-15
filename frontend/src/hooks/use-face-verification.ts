"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import * as FaceRecognitionLib from "../lib/face-recognition" 

export function useFaceVerification() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isVerified, setIsVerified] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<FaceRecognitionLib.FormData>({
    firstName: "",
    lastName: "",
    age: "",
    idNumber: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [idCardImage, setIdCardImage] = useState<File | null>(null)
  const [idFaceDescriptor, setIdFaceDescriptor] = useState<Float32Array | null>(null)
  const [isIdVerified, setIsIdVerified] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [modelsLoaded, setModelsLoaded] = useState(false)
  const [cameraStatus, setCameraStatus] = useState<string>("waiting")
  const [showCamera, setShowCamera] = useState(false)
  const [faceVerificationFailed, setFaceVerificationFailed] = useState(false)
  const [currentMatchDistance, setCurrentMatchDistance] = useState<number | null>(null)
  const [dataVerificationResults, setDataVerificationResults] = useState<FaceRecognitionLib.VerificationResults>({})
  const [loadingStage, setLoadingStage] = useState("")

  const mediaStreamRef = useRef<MediaStream | null>(null)
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const processingImageRef = useRef<boolean>(false)
  const faceMatchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const matchAttemptsRef = useRef<number>(0)

  useEffect(() => {
    const loadModels = async () => {
      const success = await FaceRecognitionLib.loadFaceApiModels(setLoadingStage)
      setModelsLoaded(success)
      if (!success) {
        setErrorMessage("⚠️ Failed to load face recognition models. Please try again.")
      }
      setLoadingStage("")
    }

    loadModels()

    return () => {
      stopVideo()
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current)
      }
      if (faceMatchTimeoutRef.current) {
        clearTimeout(faceMatchTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (isIdVerified && showCamera) {
      stopVideo()
      startVideo()
    }
  }, [isIdVerified, showCamera])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setIdCardImage(event.target.files[0])
      setErrorMessage(null)
      setDataVerificationResults({})
    }
  }

  const handleVerification = async () => {
    if (!modelsLoaded) {
      setErrorMessage("⚠️ Face recognition models are still loading. Please wait.")
      return
    }

    if (!formData.firstName || !formData.lastName || !formData.age || !formData.idNumber || !idCardImage) {
      setErrorMessage("⚠️ Please fill in all fields and upload an ID card.")
      return
    }

    setIsLoading(true)
    setErrorMessage(null)
    setSuccessMessage(null)
    setFaceVerificationFailed(false)
    setCurrentMatchDistance(null)
    setDataVerificationResults({})

    try {
      const text = await FaceRecognitionLib.extractTextFromImage(idCardImage, setLoadingStage)
      const { isValid, results } = FaceRecognitionLib.verifyDataWithID(text, formData)
      setDataVerificationResults(results)

      if (isValid) {
        setLoadingStage("Detecting face on ID card...")
        const faceDescriptor = await FaceRecognitionLib.extractFaceDescriptor(idCardImage, setLoadingStage)
        if (faceDescriptor) {
          setIdFaceDescriptor(faceDescriptor)
          setIsIdVerified(true)
          setShowCamera(true)
        } else {
          throw new Error("No face detected in the ID card. Please upload a clearer image with a visible face.")
        }
      } else {
        const failedFields = Object.entries(results)
          .filter(([_, matched]) => !matched)
          .map(([field]) => field)
          .join(", ")

        throw new Error(`Information doesn't match ID card: ${failedFields}`)
      }
    } catch (error) {
      console.error("Verification error:", error)
      setErrorMessage(`⚠️ ${error instanceof Error ? error.message : "Verification failed"}`)
      setIsLoading(false)
      setLoadingStage("")
    }
  }

  const startVideo = async () => {
    setCameraStatus("initializing")
    setLoadingStage("Initializing camera...")
    setFaceVerificationFailed(false)
    setCurrentMatchDistance(null)

    if (!videoRef.current) {
      setErrorMessage("⚠️ Video initialization failed - ref not available")
      setIsLoading(false)
      setLoadingStage("")
      setCameraStatus("error")
      return
    }

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("getUserMedia is not supported in this browser")
      }

      stopVideo()
      setCameraStatus("requesting_permission")

      const stream = await FaceRecognitionLib.requestCameraAccess()
      setCameraStatus("stream_acquired")

      if (!videoRef.current) {
        throw new Error("Video element no longer available")
      }

      videoRef.current.srcObject = stream
      mediaStreamRef.current = stream

      await new Promise((resolve, reject) => {
        if (!videoRef.current) {
          reject(new Error("Video element not available"))
          return
        }

        const videoElement = videoRef.current

        videoElement.onloadedmetadata = () => {
          setCameraStatus("metadata_loaded")

          videoElement
            .play()
            .then(() => {
              setCameraStatus("playing")
              resolve(true)
            })
            .catch((error) => {
              console.error("Error playing video:", error)
              reject(error)
            })
        }

        videoElement.onerror = (event) => {
          console.error("Video element error:", event)
          reject(new Error("Video element encountered an error"))
        }
      })

      setCameraStatus("ready")
      setErrorMessage(null)
      matchAttemptsRef.current = 0
      detectAndCompareFace()

      if (faceMatchTimeoutRef.current) {
        clearTimeout(faceMatchTimeoutRef.current)
      }

      faceMatchTimeoutRef.current = setTimeout(
        () => {
          if (!isVerified && detectionIntervalRef.current) {
            clearInterval(detectionIntervalRef.current)
            detectionIntervalRef.current = null
            setErrorMessage("⚠️ Face verification failed. The face does not match the ID card.")
            setIsLoading(false)
            setLoadingStage("")
            setFaceVerificationFailed(true)
            stopVideo()
          }
        },
        FaceRecognitionLib.MAX_MATCH_ATTEMPTS * 100 + 1000,
      )
    } catch (error) {
      console.error("Camera initialization error:", error)
      setCameraStatus("error")

      let errorMsg = "⚠️ Failed to start camera"

      if (error instanceof DOMException) {
        switch (error.name) {
          case "NotAllowedError":
            errorMsg = "⚠️ Camera access denied. Please allow camera access and try again."
            break
          case "NotFoundError":
            errorMsg = "⚠️ No camera found. Please connect a camera and try again."
            break
          case "NotReadableError":
            errorMsg = "⚠️ Camera is in use by another application. Please close other apps using the camera."
            break
          default:
            errorMsg = `⚠️ Camera error: ${error.message}`
        }
      }

      setErrorMessage(errorMsg)
      setIsLoading(false)
      setLoadingStage("")
    }
  }

  const detectAndCompareFace = () => {
    if (!videoRef.current || !idFaceDescriptor) {
      setErrorMessage("⚠️ Video or ID face data not available.")
      setIsLoading(false)
      return
    }

    const video = videoRef.current
    setLoadingStage("Comparing your face with ID...")

    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current)
    }

    let frameCount = 0

    detectionIntervalRef.current = setInterval(async () => {
      if (!video || !idFaceDescriptor) return

      matchAttemptsRef.current++

      if (matchAttemptsRef.current > FaceRecognitionLib.MAX_MATCH_ATTEMPTS) {
        if (detectionIntervalRef.current) {
          clearInterval(detectionIntervalRef.current)
          detectionIntervalRef.current = null
        }
        setErrorMessage("⚠️ Face verification failed. The face does not match the ID card.")
        setIsLoading(false)
        setLoadingStage("")
        setFaceVerificationFailed(true)
        stopVideo()
        return
      }

      frameCount++
      if (frameCount % 2 !== 0) return

      if (processingImageRef.current) return

      processingImageRef.current = true

      try {
        const detections = await FaceRecognitionLib.detectFaceInVideo(video)

        if (!detections) {
          setErrorMessage("⚠️ Please position your face in the center of the camera.")
          processingImageRef.current = false
          return
        }

        setErrorMessage(null)

        const distance = FaceRecognitionLib.compareFaceDescriptors(detections.descriptor, idFaceDescriptor)
        setCurrentMatchDistance(distance)

        if (distance < FaceRecognitionLib.FACE_MATCH_THRESHOLD) {
          if (detectionIntervalRef.current) {
            clearInterval(detectionIntervalRef.current)
            detectionIntervalRef.current = null
          }
          if (faceMatchTimeoutRef.current) {
            clearTimeout(faceMatchTimeoutRef.current)
            faceMatchTimeoutRef.current = null
          }

          setIsVerified(true)
          setIsLoading(false)
          setSuccessMessage("✅ Registered successfully!")
          setLoadingStage("")

          stopVideo()
        }

        processingImageRef.current = false
      } catch (error) {
        console.error("Face detection error:", error)
        processingImageRef.current = false
      }
    }, 100)
  }

  const stopVideo = () => {
    if (mediaStreamRef.current) {
      const tracks = mediaStreamRef.current.getTracks()
      tracks.forEach((track) => track.stop())
      mediaStreamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }

  const handleRetryFaceVerification = () => {
    setErrorMessage(null)
    matchAttemptsRef.current = 0
    setFaceVerificationFailed(false)
    setCurrentMatchDistance(null)
    setTimeout(() => {
      startVideo()
    }, 100)
  }

  const handleReset = () => {
    stopVideo()
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current)
      detectionIntervalRef.current = null
    }
    if (faceMatchTimeoutRef.current) {
      clearTimeout(faceMatchTimeoutRef.current)
      faceMatchTimeoutRef.current = null
    }

    setFormData({
      firstName: "",
      lastName: "",
      age: "",
      idNumber: "",
      email: "",
      password: "",
      confirmPassword: ""

    })
    setIdCardImage(null)
    setIdFaceDescriptor(null)
    setIsIdVerified(false)
    setIsVerified(false)
    setErrorMessage(null)
    setSuccessMessage(null)
    setIsLoading(false)
    setShowCamera(false)
    setCameraStatus("waiting")
    setLoadingStage("")
    matchAttemptsRef.current = 0
    setFaceVerificationFailed(false)
    setCurrentMatchDistance(null)
    setDataVerificationResults({})
  }

  return {
    // Refs
    videoRef,
    canvasRef,

    // State
    isVerified,
    isLoading,
    formData,
    idCardImage,
    isIdVerified,
    errorMessage,
    successMessage,
    modelsLoaded,
    cameraStatus,
    faceVerificationFailed,
    currentMatchDistance,
    dataVerificationResults,
    loadingStage,

    // Event handlers
    handleChange,
    handleImageUpload,
    handleVerification,
    handleRetryFaceVerification,
    handleReset,

    // Constants
    FACE_MATCH_THRESHOLD: FaceRecognitionLib.FACE_MATCH_THRESHOLD,
  }
}

