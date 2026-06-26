import { useState } from "react";
import API from "../api/axios";
import { toast } from "react-hot-toast";
import { X, UserPlus } from "lucide-react";

export default function CreateCandidate({ onClose }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await API.post("/users/create-candidate", {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
      });

      toast.success("Candidate created successfully.");

      setForm({
        name: "",
        email: "",
      });

      onClose();

    } catch (err) {
      toast.error(
        err.response?.data?.message || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"   onClick={onClose}>

      {/* Modal */}
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-800 shadow-2xl"   onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700 px-6 py-5">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600">
              <UserPlus className="text-white" size={22} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white">
                Create Candidate
              </h2>

              <p className="text-sm text-slate-400">
                Add a candidate to your organization.
              </p>
            </div>

          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-700 hover:text-white"
          >
            <X size={20} />
          </button>

        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-6"
        >

          {/* Name */}
          <div>

            <label className="mb-2 block text-sm font-medium text-slate-300">
              Candidate Name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              disabled={loading}
              required
              placeholder="Enter candidate name"
              className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-3 text-white outline-none transition focus:border-purple-500 disabled:opacity-60"
            />

          </div>

          {/* Email */}
          <div>

            <label className="mb-2 block text-sm font-medium text-slate-300">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
              required
              placeholder="Enter candidate email"
              className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-3 text-white outline-none transition focus:border-purple-500 disabled:opacity-60"
            />

          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-2">

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-slate-600 px-5 py-2.5 text-slate-300 transition hover:bg-slate-700"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-purple-600 px-5 py-2.5 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Candidate"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}