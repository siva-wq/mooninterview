import React from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, ShieldAlert } from "lucide-react";

const SessionExpired = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center">

        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
            <ShieldAlert className="w-10 h-10 text-red-600" />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Session Expired
        </h1>

        <p className="text-gray-600 mb-3">
          Your session has expired for security reasons.
        </p>

        <p className="text-gray-500 mb-8">
          Please sign in again to continue using MoonInterview.
        </p>

        <button
          onClick={() => navigate("/login")}
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          <LogIn size={18} />
          Login Again
        </button>

      </div>
    </div>
  );
};

export default SessionExpired;