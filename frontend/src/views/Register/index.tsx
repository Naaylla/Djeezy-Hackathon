"use client"

import { useFaceVerification } from "../../hooks/use-face-verification"
import { Upload } from "lucide-react"
import Image from "../../assets/9oufa.png"
import { useState, useEffect } from "react"
import { cn } from "../../lib/utils"

export default function Register() {
  const {
    videoRef,
    canvasRef,
    isVerified,
    isLoading,
    formData,
    idCardImage,
    isIdVerified,
    errorMessage,
    successMessage,
    modelsLoaded,
    faceVerificationFailed,
    currentMatchDistance,
    dataVerificationResults,
    loadingStage,
    handleChange,
    handleImageUpload,
    handleVerification,
    handleRetryFaceVerification,
    handleReset,
    FACE_MATCH_THRESHOLD,
  } = useFaceVerification()

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full p-4 bg-[#FEF9E1] relative overflow-hidden">
      <div className="w-[120vw] h-[120vw] md:w-[80vw] md:h-[80vw] absolute rounded-full -right-[60vw] top-[-10vw] md:top-[-20vw] lg:-right-[45vw] bg-[#C14600]"></div>

      <div className=" p-4 md:p-8 flex items-center space-x-2 md:space-x-3 z-10">
        <div className="relative w-8 h-8 md:w-12 md:h-12">
          <img src={Image} width={48} height={48} className="object-contain"/>
        </div>
        <h1 className="text-2xl md:text-4xl text-[#FF9D23] font-semibold">9OUFA</h1>
      </div>

      <div className="w-full max-w-4xl md:max-w-2xl lg:max-w-3xl z-10 rounded-xl p-6 md:p-8">
        {isVerified ? (
          <div className="text-center space-y-4 py-8">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-xl font-medium text-green-600">Verification Complete!</h3>
            <p className="text-gray-600">You have been successfully registered.</p>
            <button
              onClick={handleReset}
              className="mt-4 bg-gray-500 hover:bg-gray-600 transition-colors text-white px-6 py-2 rounded-lg"
            >
              Start New Verification
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={isLoading || isIdVerified}
                  className="w-full p-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#FF9D23]/50 focus:border-[#FF9D23] outline-none transition-all"
                />
                {dataVerificationResults.firstName !== undefined && (
                  <div
                    className={`text-xs mt-1 ${dataVerificationResults.firstName ? "text-green-500" : "text-red-500"} flex items-center`}
                  >
                    {dataVerificationResults.firstName ? (
                      <>
                        <span className="mr-1">✓</span> Matched
                      </>
                    ) : (
                      <>
                        <span className="mr-1">✗</span> Not found on ID
                      </>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={isLoading || isIdVerified}
                  className="w-full p-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#FF9D23]/50 focus:border-[#FF9D23] outline-none transition-all"
                />
                {dataVerificationResults.lastName !== undefined && (
                  <div
                    className={`text-xs mt-1 ${dataVerificationResults.lastName ? "text-green-500" : "text-red-500"} flex items-center`}
                  >
                    {dataVerificationResults.lastName ? (
                      <>
                        <span className="mr-1">✓</span> Matched
                      </>
                    ) : (
                      <>
                        <span className="mr-1">✗</span> Not found on ID
                      </>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  placeholder="27"
                  value={formData.age}
                  onChange={handleChange}
                  disabled={isLoading || isIdVerified}
                  className="w-full p-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#FF9D23]/50 focus:border-[#FF9D23] outline-none transition-all"
                />
                {dataVerificationResults.age !== undefined && (
                  <div
                    className={`text-xs mt-1 ${dataVerificationResults.age ? "text-green-500" : "text-red-500"} flex items-center`}
                  >
                    {dataVerificationResults.age ? (
                      <>
                        <span className="mr-1">✓</span> Matched
                      </>
                    ) : (
                      <>
                        <span className="mr-1">✗</span> Not found on ID
                      </>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="johndoe@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading || isIdVerified}
                  className="w-full p-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#FF9D23]/50 focus:border-[#FF9D23] outline-none transition-all"
                />
                {dataVerificationResults.email !== undefined && (
                  <div
                    className={`text-xs mt-1 ${dataVerificationResults.email ? "text-green-500" : "text-red-500"} flex items-center`}
                  >
                    {dataVerificationResults.email ? (
                      <>
                        <span className="mr-1">✓</span> Matched
                      </>
                    ) : (
                      <>
                        <span className="mr-1">✗</span> Not found on ID
                      </>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading || isIdVerified}
                  className="w-full p-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#FF9D23]/50 focus:border-[#FF9D23] outline-none transition-all"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  placeholder="••••••••"
                  onChange={handleChange}
                  disabled={isLoading || isIdVerified}
                  className="w-full p-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#FF9D23]/50 focus:border-[#FF9D23] outline-none transition-all"
                />
              </div>

              <div>
                <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  ID Number
                </label>
                <input
                  type="text"
                  id="idNumber"
                  name="idNumber"
                  placeholder="123456789"
                  value={formData.idNumber}
                  onChange={handleChange}
                  disabled={isLoading || isIdVerified}
                  className="w-full p-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#FF9D23]/50 focus:border-[#FF9D23] outline-none transition-all"
                />
                {dataVerificationResults.idNumber !== undefined && (
                  <div
                    className={`text-xs mt-1 ${dataVerificationResults.idNumber ? "text-green-500" : "text-red-500"} flex items-center`}
                  >
                    {dataVerificationResults.idNumber ? (
                      <>
                        <span className="mr-1">✓</span> Matched
                      </>
                    ) : (
                      <>
                        <span className="mr-1">✗</span> Not found on ID
                      </>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="fileInput" className="block text-sm font-medium text-gray-700 mb-1">
                  ID Card Picture
                </label>
                <label
                  htmlFor="fileInput"
                  className={cn(
                    "flex items-center justify-between w-full px-4 py-2.5 border border-gray-300 rounded-lg cursor-pointer text-gray-600 bg-white hover:bg-gray-50 transition-colors",
                    (isLoading || isIdVerified) && "opacity-50 cursor-not-allowed",
                  )}
                >
                  <span className="truncate max-w-[180px]">{idCardImage?.name || "Upload"}</span>
                  <Upload className="w-5 h-5 text-gray-500 flex-shrink-0" />
                </label>

                <input
                  type="file"
                  id="fileInput"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isLoading || isIdVerified}
                  className="hidden"
                />

                <p className="mt-1 text-xs text-gray-500">
                  Please upload a clear image of your ID card with your face clearly visible.
                </p>
              </div>
            </div>

            {isLoading && loadingStage && (
              <div className="mt-6 flex items-center justify-center flex-col">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#FF9D23] mb-2"></div>
                <div className="text-sm text-center">{loadingStage}</div>
              </div>
            )}

            <div className="mt-8 flex justify-center">
              {!isIdVerified ? (
                <button
                  onClick={handleVerification}
                  disabled={isLoading || !modelsLoaded}
                  className={cn(
                    "px-8 sm:px-16 md:px-24 py-3 rounded-lg text-white font-medium transition-colors",
                    isLoading || !modelsLoaded
                      ? "bg-[#FF9D23]/70 cursor-not-allowed"
                      : "bg-[#FF9D23] hover:bg-[#FA8A00] shadow-md hover:shadow-lg",
                  )}
                >
                  {isLoading ? "Verifying..." : "Verify"}
                </button>
              ) : (
                <div className="text-center space-y-1 bg-blue-50 p-3 rounded-lg">
                  <div className="text-sm text-blue-600 font-medium">Looking for your face...</div>
                  <div className="text-xs text-gray-500">Please position your face in the camera frame</div>
                </div>
              )}
            </div>

            {errorMessage && (
              <div className="mt-4 text-red-500 text-sm text-center p-3 bg-red-50 rounded-lg border border-red-100">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="mt-4 text-green-500 text-sm text-center p-3 bg-green-50 rounded-lg border border-green-100">
                {successMessage}
              </div>
            )}

            {currentMatchDistance !== null && (
              <div
                className={cn(
                  "mt-4 text-sm text-center p-3 rounded-lg",
                  currentMatchDistance < FACE_MATCH_THRESHOLD
                    ? "bg-green-50 text-green-600 border border-green-100"
                    : "bg-yellow-50 text-yellow-600 border border-yellow-100",
                )}
              >
                Match score: {((1 - currentMatchDistance) * 100).toFixed(0)}%
                {currentMatchDistance < FACE_MATCH_THRESHOLD ? " (Good match)" : " (Not matching)"}
              </div>
            )}

            <div className="mt-6">
              {isIdVerified && !faceVerificationFailed && (
                <div className="space-y-2">
                  <div className="rounded-lg overflow-hidden border-2 border-blue-500 max-w-lg mx-auto">
                    <video
                      ref={videoRef}
                      width="640"
                      height="480"
                      autoPlay
                      playsInline
                      muted
                      className="rounded-lg w-full h-auto bg-gray-100"
                      style={{ minHeight: isMobile ? "240px" : "360px" }}
                    />
                    <canvas ref={canvasRef} className="hidden" />
                  </div>
                </div>
              )}
            </div>

            {isIdVerified && faceVerificationFailed && (
              <div className="text-center mt-6">
                <button
                  onClick={handleRetryFaceVerification}
                  className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md"
                >
                  Retry Face Verification
                </button>
              </div>
            )}

            {isIdVerified && !isVerified && !faceVerificationFailed && (
              <div className="text-center text-sm text-blue-500 mt-3 animate-pulse">
                Face verification in progress...
              </div>
            )}
          </>
        )}

        <div className="mt-8 pt-4 border-t border-gray-200">
          <div className="flex justify-center">
            <ol className="flex items-center w-full max-w-md">
              <li
                className={cn(
                  "flex items-center",
                  formData.firstName && formData.lastName && formData.age && formData.idNumber && idCardImage
                    ? "text-blue-600"
                    : "text-gray-400",
                )}
              >
                <span className="flex items-center justify-center w-6 h-6 rounded-full border border-current mr-2">
                  1
                </span>
                <span className="text-xs sm:text-sm">Info</span>
              </li>
              <li className="flex-1 border-t-2 mx-2 border-gray-300"></li>
              <li className={cn("flex items-center", isIdVerified ? "text-blue-600" : "text-gray-400")}>
                <span className="flex items-center justify-center w-6 h-6 rounded-full border border-current mr-2">
                  2
                </span>
                <span className="text-xs sm:text-sm">ID Scan</span>
              </li>
              <li className="flex-1 border-t-2 mx-2 border-gray-300"></li>
              <li className={cn("flex items-center", isVerified ? "text-green-600" : "text-gray-400")}>
                <span className="flex items-center justify-center w-6 h-6 rounded-full border border-current mr-2">
                  3
                </span>
                <span className="text-xs sm:text-sm">Face Scan</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}