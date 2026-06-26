import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Eye, EyeOff, Lock } from "lucide-react";
import { toast } from "react-hot-toast";
import API from "../api/axios";

export default function CreatePassword() {
  const navigate = useNavigate();
  const { token } = useParams();

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    if (form.password.length < 6) {
      return toast.error(
        "Password must be at least 6 characters."
      );
    }

    try {
      setLoading(true);

      const res = await API.post(
        `/auth/create-password/${token}`,
        {
          password: form.password,
        }
      );

      toast.success(res.data.message);

      setTimeout(() => {
        navigate(`/login/${res.data.roomId}`);
      }, 1200);

    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Unable to create password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">

      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-800 shadow-2xl p-8">

        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center">
            <Lock className="text-white" size={28} />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white text-center">
          Create Password
        </h1>

        <p className="text-slate-400 text-center mt-2 mb-8">
          Create your password to continue to your interview.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <div>
            <label className="block text-slate-300 mb-2">
              Password
            </label>

            <div className="relative">

              <input
                type={
                  showPassword ? "text" : "password"
                }
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Enter password"
                className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-3 pr-12 text-white outline-none focus:border-purple-500"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-4 top-3 text-slate-400"
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>

            </div>

          </div>

          <div>

            <label className="block text-slate-300 mb-2">
              Confirm Password
            </label>

            <div className="relative">

              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm password"
                className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-3 pr-12 text-white outline-none focus:border-purple-500"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                className="absolute right-4 top-3 text-slate-400"
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>

            </div>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-purple-600 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:opacity-50"
          >
            {loading
              ? "Creating..."
              : "Create Password"}
          </button>

        </form>

      </div>

    </div>
  );
}