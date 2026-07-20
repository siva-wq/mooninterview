import React from "react";
import { Link } from "react-router-dom";
import { Clock3, Home } from "lucide-react";

const LinkExpired = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center">

        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center">
            <Clock3 className="w-10 h-10 text-orange-600" />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-navy mb-3">
          Interview Link Expired
        </h1>

        <p className="text-secondary mb-3">
          This interview link is no longer valid and cannot be used to join the interview session.
        </p>

        <p className="text-secondary mb-8">
          Please contact your organization administrator to receive a new interview invitation.
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

export default LinkExpired;