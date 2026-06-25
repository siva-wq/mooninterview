import React from "react";
import { CheckCircle } from "lucide-react";

function ThankYou() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-3xl p-10 max-w-lg w-full text-center">

        <CheckCircle
          size={80}
          className="text-green-500 mx-auto mb-6"
        />

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Thank You!
        </h1>

        <p className="text-gray-600 mb-3">
          Thank you for participating in the interview.
        </p>

        <p className="text-gray-600 mb-3">
          Our team will review your interview performance and resume.
        </p>

        <p className="text-gray-600">
          The interview result and further updates will be sent to your registered email address.
        </p>

        <div className="mt-8">
          <p className="text-sm text-gray-500">
            MoonInterview Team
          </p>
        </div>

      </div>
    </div>
  );
}

export default ThankYou;