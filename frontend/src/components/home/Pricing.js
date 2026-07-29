import React, { useState } from "react";
import toast from "react-hot-toast";
import API from "../../api/axios";

function Pricing({ onClose, price }) {
  const [data, setData] = useState({
    name: "",
    email: "",
    organisation: "",
    pricing: price,
    type: "pricing",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const getTitle = () => {
    switch (price) {
      case "One-Time Trial":
        return "Start Your One-Time Trial";
      case "Daily Plan":
        return "Purchase Daily Access";
      case "Professional Plan":
        return "Subscribe to Professional Plan";
      default:
        return "Choose Your Plan";
    }
  };

  const getDescription = () => {
    switch (price) {
      case "One-Time Trial":
        return "Register your organization to activate your one-time 3-day trial.";
      case "Daily Plan":
        return "Fill in your organization details to request 24-hour access.";
      case "Professional Plan":
        return "Fill in your organization details and we'll contact you to complete your subscription.";
      default:
        return "Fill in your organization details.";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await API.post("/demo", data);

      if (response.data.success) {
        toast.success(
          price === "One-Time Trial"
            ? "Your free trial request has been received. We'll register your organization and send your login credentials shortly."
            : "Your request has been received successfully. We'll contact you shortly regarding your selected plan.",
          {
            duration: 6000,
          }
        );

        setData({
          name: "",
          email: "",
          organisation: "",
          pricing: price,
          type: "pricing",
        });

        onClose?.();
      } else {
        toast.error("Failed to submit your request. Please try again.");
      }
    } catch (error) {
      console.error("Pricing request failed:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fadeIn">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-2xl text-gray-500 hover:text-red-500 transition"
        >
          ✕
        </button>

        {/* Heading */}
        <h2 className="text-3xl font-bold text-center text-navy mb-2">
          {getTitle()}
        </h2>

        <p className="text-center text-gray-500 mb-6">
          {getDescription()}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Selected Plan */}
          <input
            type="text"
            value={price}
            disabled
            className="w-full border border-gray-300 rounded-lg p-3 bg-gray-100 text-gray-700 font-semibold"
          />

          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Contact Person"
            value={data.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary"
            required
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Work Email Address"
            value={data.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary"
            required
          />

          {/* Organization */}
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
            {loading
              ? "Submitting..."
              : price === "One-Time Trial"
              ? "Start Free Trial"
              : price === "Daily Plan"
              ? "Request Daily Access"
              : "Request Subscription"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default Pricing;