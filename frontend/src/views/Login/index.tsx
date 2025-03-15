import logo from "../../assets/Logo9oufa.png"
import da2ira from "../../assets/da2ira.png"
import { useState } from "react"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ email, password })
  }

  return (
    <div className="flex min-h-screen bg-[#FEF9E1] p-0 m-0">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-[50%] p-8 flex flex-col justify-between">
        <div className="mb-12">
          <div className="flex items-center gap-2">
            <img src={logo} alt="9OUFA Logo" className="max-h-[100px] text-[#C14817] mt-8 ml-8" />
          </div>
        </div>

        <div className="max-w-md w-full mx-auto">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C14817] focus:border-[#C14817]"
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C14817] focus:border-[#C14817]"
                placeholder="Enter your password"
              />
            </div>

            <div className="text-sm">
              <a href="#" className="text-[#C14817] hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              className="w-full bg-[#C14817] hover:bg-[#A13807] text-white py-2 rounded-md transition-colors"
              type="submit"
            >
              Login
            </button>

            <button
              className="w-full border border-gray-300 bg-white text-gray-700 py-2 rounded-md flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
              type="button"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Login with Google
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Or don't have an account yet?{" "}
            <a href="#" className="text-[#C14817] hover:underline font-medium">
              Register
            </a>
          </p>
        </div>
      </div>

      <div className="hidden lg:block w-[50%] relative ml-auto overflow-hidden">
        <div className="absolute top-0 right-0 h-full w-full">
            <img
            src={da2ira}
            alt="Illustration"
            className="h-full object-cover w-[110%]" // Adjusted width
            />
        </div>
      </div>
    </div>
  )
}