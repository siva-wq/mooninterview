import React, { useState } from "react";
import toast from "react-hot-toast";
import API from "../../api/axios";

function Demo({ onClose }) {
  const [data, setData] = useState({
    name: "",
    email: "",
    organisation: "",
    type: "demo",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await API.post("/demo", data);

      if (response.data.success) {
        toast.success(
    "Demo booked successfully! Check your Inbox or Spam folder for updates from MoonInterview.",
    {
      duration: 6000,
    }
  );
        setData({
          name: "",
          email: "",
          organisation: "",
        });

        onClose?.();

      } else {
        toast.error("Failed to book demo. Please try again.");
      }
    } catch (error) {
      console.error("Demo booking failed:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fadeIn">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-2xl text-gray-500 hover:text-red-500 transition"
        >
          ✕
        </button>

        {/* Heading */}
        <h2 className="text-3xl font-bold text-center text-navy mb-2">
          Book a Demo
        </h2>

        <p className="text-center text-gray-500 mb-6">
          Fill in your details and we'll contact you to schedule a personalized demo.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={data.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={data.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary"
            required
          />

          <input
            type="text"
            name="organisation"
            placeholder="Organization Name"
            value={data.organisation}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`btn-primary w-full ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Booking Demo..." : "Book Demo"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default Demo;