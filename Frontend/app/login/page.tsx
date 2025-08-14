"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // important to send cookies
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // After successful login, fetch user info from backend (using cookie)
      const userRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
        {
          credentials: "include",
        }
      );

      if (!userRes.ok) {
        setError("Failed to get user info");
        return;
      }

      const { user } = await userRes.json();
      const userRole = user.role.toLowerCase();

      if (userRole === "admin") {
        router.push("/admin");
      } else if (userRole === "contactperson") {
        router.push("/welcome");
      } else if (userRole === "universal") {
        router.push("/universal");
      } else {
        router.push("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#6da7cb] to-[#a0c7e0] px-4">
      {/* Top Title */}
      <div className="text-center mb-10">
        <div className="bg-white text-[#2c4a61] px-6 py-2 rounded-full text-4xl font-[Italianno] italic shadow mb-2">
          Mesob
        </div>
        <h1 className="text-xl sm:text-2xl font-semibold text-white drop-shadow-md">
          Data Exchange Portal
        </h1>
      </div>

      {/* Login Card */}
      <div className="bg-white shadow-xl rounded-xl px-8 py-10 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-[#2c4a61] mb-2">
          Sign in
        </h2>
        <p className="text-sm text-center text-gray-600 mb-6">
          Please use the credentials provided by the administrator to log in.
        </p>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 text-sm rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          {/* Email Field */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg bg-[#eaf5fb] focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Field */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-lg bg-[#eaf5fb] focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Remember me */}
          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              id="remember"
              className="mr-2 accent-[#2c4a61]"
            />
            <label htmlFor="remember" className="text-sm text-gray-700">
              Remember me
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#2c4a61] to-[#3a6583] hover:from-[#1f354a] hover:to-[#2c4a61] text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Sign in
          </button>
        </form>

        {/* Forgot Password */}
        <p className="text-center text-sm text-gray-700 mt-6">
          Forgot your password?{" "}
          <span className="font-medium text-[#2c4a61]">
            Contact your administrator
          </span>
        </p>
      </div>
    </div>
  );
}
