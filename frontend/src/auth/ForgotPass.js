import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

export default function ForgotPass() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await API.post("/auth/forgot-password", {
        email,
      });

      setMessage(res.data.message);
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#1E293B] rounded-2xl shadow-2xl border border-custom p-8">

        <div className="text-center mb-8">
          <img
            src="/logo2.png"
            alt="MoonInterview"
            className="h-16 mx-auto mb-4"
          />

          <h1 className="text-3xl font-bold text-white">
            Forgot Password
          </h1>

          <p className="text-secondary mt-2">
            Enter your email to receive a link.
          </p>
        </div>

        {message && (
          <div className="mb-4 bg-green-500/20 border border-green-500 text-green-300 rounded-lg p-3">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 bg-red-500/20 border border-red-500 text-red-300 rounded-lg p-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-secondary mb-2">
              Email Address
            </label>

            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg bg-navy border border-custom px-4 py-3 text-white placeholder-secondary outline-none focus:border-primary"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full rounded-lg py-3 font-semibold disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

        </form>

        <div className="mt-6 text-center">

          <Link
            to="/login"
            className="text-primary hover:text-primary-hover"
          >
            ← Back to Login
          </Link>

        </div>

      </div>
    </div>
  );
}


