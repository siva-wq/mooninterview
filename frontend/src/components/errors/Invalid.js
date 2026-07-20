import React from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, Home } from "lucide-react";

const Invalid = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center">

        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center">
            <ShieldAlert className="w-10 h-10 text-yellow-600" />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-navy mb-3">
          Invalid Interview Link
        </h1>

        <p className="text-secondary mb-3">
          The interview link you are trying to access is invalid or incomplete.
        </p>

        <p className="text-secondary mb-8">
          Please use the interview link provided in your email invitation. If the problem persists, contact your organization administrator.
        </p>

        <Link
          to="/"
          className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-lg"
        >
          <Home size={18} />
          Back to Home
        </Link>

      </div>
    </div>
  );
};

export default Invalid;