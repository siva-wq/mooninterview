import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center">
        
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </div>
        </div>

        <h1 className="text-7xl font-bold text-gray-900 mb-2">
          404
        </h1>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Page Not Found
        </h2>

        <p className="text-gray-600 mb-8">
          The page you are looking for doesn't exist or may have been moved.
          Please check the URL or return to the homepage.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          <Home size={18} />
          Back to Home
        </Link>

      </div>
    </div>
  );
};

export default NotFound;