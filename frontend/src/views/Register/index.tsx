"use client";

import { useFaceVerification } from "../../hooks/use-face-verification";

export default function FaceRecognition() {
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">ID Verification</h2>

        {isVerified ? (
          <div className="text-center space-y-4">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-xl font-medium text-green-600">Verification Complete!</h3>
            <p className="text-gray-600">You have been successfully registered.</p>
            <button onClick={handleReset} className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg">
              Start New Verification
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
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
                {dataVerificationResults.firstName !== undefined && (
                  <div
                    className={`text-xs mt-1 ${dataVerificationResults.firstName ? "text-green-500" : "text-red-500"}`}
                  >
                    {dataVerificationResults.firstName ? "✓ Matched" : "✗ Not found on ID"}
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
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
                {dataVerificationResults.lastName !== undefined && (
                  <div
                    className={`text-xs mt-1 ${dataVerificationResults.lastName ? "text-green-500" : "text-red-500"}`}
                  >
                    {dataVerificationResults.lastName ? "✓ Matched" : "✗ Not found on ID"}
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700">
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
                {dataVerificationResults.age !== undefined && (
                  <div className={`text-xs mt-1 ${dataVerificationResults.age ? "text-green-500" : "text-red-500"}`}>
                    {dataVerificationResults.age ? "✓ Matched" : "✗ Not found on ID"}
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700">
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
                {dataVerificationResults.idNumber !== undefined && (
                  <div
                    className={`text-xs mt-1 ${dataVerificationResults.idNumber ? "text-green-500" : "text-red-500"}`}
                  >
                    {dataVerificationResults.idNumber ? "✓ Matched" : "✗ Not found on ID"}
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="idCardImage" className="block text-sm font-medium text-gray-700">
                  Upload ID Card Image
                </label>
                <div className="mt-1">
                  <input
                    type="file"
                    id="idCardImage"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isLoading || isIdVerified}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Please upload a clear image of your ID card with your face clearly visible.
                  </p>
                </div>
              </div>
            </div>

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
                    isLoading || !modelsLoaded ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  {isLoading ? "Verifying..." : "Verify"}
                </button>
              ) : (
                <div className="text-center space-y-1">
                  <div className="text-sm text-blue-600">Looking for your face...</div>
                  <div className="text-xs text-gray-500">Please position your face in the camera frame</div>
                </div>
              )}
            </div>

            {errorMessage && (
              <div className="mt-4 text-red-500 text-sm text-center p-2 bg-red-50 rounded-md">{errorMessage}</div>
            )}

            {successMessage && (
              <div className="mt-4 text-green-500 text-sm text-center p-2 bg-green-50 rounded-md">{successMessage}</div>
            )}

            {currentMatchDistance !== null && (
              <div
                className={`mt-4 text-sm text-center p-2 rounded-md ${
                  currentMatchDistance < FACE_MATCH_THRESHOLD
                    ? "bg-green-50 text-green-600"
                    : "bg-yellow-50 text-yellow-600"
                }`}
              >
                Match score: {((1 - currentMatchDistance) * 100).toFixed(0)}%
                {currentMatchDistance < FACE_MATCH_THRESHOLD ? " (Good match)" : " (Not matching)"}
              </div>
            )}

            <div className="mt-6">
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
                </div>
              )}
            </div>

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
              <div className="text-center text-sm text-gray-500 mt-2">Face verification in progress...</div>
            )}
          </>
        )}

        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-center">
            <ol className="flex items-center w-full">
              <li
                className={`flex items-center ${
                  formData.firstName && formData.lastName && formData.age && formData.idNumber && idCardImage
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
              <li className={`flex items-center ${isIdVerified ? "text-blue-600" : "text-gray-400"}`}>
                <span className="flex items-center justify-center w-6 h-6 rounded-full border border-current mr-2">
                  2
                </span>
                <span className="text-xs">ID Scan</span>
              </li>
              <li className="flex-1 border-t-2 mx-2 border-gray-300"></li>
              <li className={`flex items-center ${isVerified ? "text-green-600" : "text-gray-400"}`}>
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
  )
}

