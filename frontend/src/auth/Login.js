import { useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import API from "../api/axios";

import socket from "../socket";

function Login() {

    const navigate = useNavigate();
    const { roomId } = useParams();

    const [loading, setLoading] =
        useState(false);

    const [formData, setFormData] =
        useState({
            email: "",
            password: ""
        });

    // ==========================================
    // HANDLE CHANGE
    // ==========================================
    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]:
                e.target.value
        });
    };

    // ==========================================
    // LOGIN SUBMIT
    // ==========================================
    const submit = async (e) => {

        e.preventDefault();

        if (
            !formData.email ||
            !formData.password
        ) {

            alert(
                "Please fill all fields"
            );

            return;
        }

        try {

            setLoading(true);

            const res =
                await API.post(
                    "http://192.168.29.28:5000/api/auth/login",
                    formData
                );

            // STORE TOKEN
            localStorage.setItem(
                "token",
                res.data.token
            );

            // STORE USER
            localStorage.setItem(
                "user",
                JSON.stringify(
                    res.data.user
                )
            );

            // ==========================================
            // SOCKET CONNECTION
            // ==========================================
            socket.connect();

            // USER ONLINE EVENT
            socket.emit(
                "user_online",
                {
                    userId:
                        res.data.user._id,

                    name:
                        res.data.user.name,

                    role:
                        res.data.user.role
                }
            );

            // LOGIN NOTIFICATION
            socket.emit(
                "notification",
                {
                    type: "success",

                    message:
                        `${res.data.user.name} logged in`
                }
            );



            // ==========================================
            // ROLE BASED NAVIGATION
            // ==========================================
            if (
                res.data.user.role ===
                "admin" || res.data.user.role === "interviewer"
            ) {

                navigate("/admin");

            } else {
                if (!roomId) {

                    localStorage.clear();

                    socket.disconnect();

                    return navigate("/candidate/invalid");
                }

                navigate(`/candidate/waiting/${roomId}`);
            }


        } catch (err) {

            console.log(err);

            alert(

                err.response?.data?.message ||

                "Login Failed"
            );

        } finally {

            setLoading(false);
        }
    };

    // ==========================================
    // FORM VALIDATION
    // ==========================================
    const isFormValid =

        formData.email &&
        formData.password;

    return (
  <div className="min-h-screen bg-[#0F172A] flex">

    {/* LEFT SIDE */}

    <div className="hidden lg:flex w-1/2 flex-col justify-center px-16 text-[#F8FAFC]">

      <h1 className="text-6xl font-bold mb-6">
        <span className="bg-gradient-to-br from-[#B8860B] via-[#D4A017] to-[#FFD76A] bg-clip-text text-transparent">
          Moon
        </span>
        <span className="text-[#7C3AED]">
          Interview
        </span>
      </h1>

      <p className="text-2xl text-[#94A3B8] mb-10">
        Smart Interviews. Better Hiring.
      </p>

      <div className="space-y-5 text-lg">

        <div className="flex items-center gap-3">
          <span className="text-[#FBBF24]">✓</span>
          <span className="text-[#F8FAFC]">Live Video Interviews</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[#FBBF24]">✓</span>
          <span className="text-[#F8FAFC]">Real-Time Screen Sharing</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[#FBBF24]">✓</span>
          <span className="text-[#F8FAFC]">Integrated Code Editor</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[#FBBF24]">✓</span>
          <span className="text-[#F8FAFC]">Resume Evaluation</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[#FBBF24]">✓</span>
          <span className="text-[#F8FAFC]">Automated Interview Workflow</span>
        </div>

      </div>

    </div>

    {/* RIGHT SIDE */}

    <div className="w-full lg:w-1/2 flex items-center justify-center p-8">

      <div
        className="
          w-full
          max-w-md
          bg-[#1E293B]
          border
          border-[#334155]
          rounded-3xl
          shadow-xl
          p-10
        "
      >

        <div className="text-center mb-8">

          <h2 className="text-4xl font-bold text-[#F8FAFC]">
            Welcome Back
          </h2>

          <p className="text-[#94A3B8] mt-3">
            Sign in to continue
          </p>

        </div>

        <form
          onSubmit={submit}
          className="space-y-5"
        >

          {/* EMAIL */}

          <div>

            <label className="block mb-2 text-[#94A3B8] text-sm">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="
                w-full
                p-3
                rounded-xl
                bg-[#0F172A]
                border
                border-[#334155]
                text-[#F8FAFC]
                placeholder-[#64748B]
                outline-none
                focus:border-[#7C3AED]
focus:ring-2
focus:ring-[#7C3AED]/30
              "
            />

          </div>

          {/* PASSWORD */}

          <div>

            <label className="block mb-2 text-[#94A3B8] text-sm">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="
                w-full
                p-3
                rounded-xl
                bg-[#0F172A]
                border
                border-[#334155]
                text-[#F8FAFC]
                placeholder-[#64748B]
                outline-none
                focus:border-[#7C3AED]
                focus:ring-2
                focus:ring-[#7C3AED]/30
              "
            />

          </div>

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            disabled={!isFormValid || loading}
            className="
              w-full
              py-3
              rounded-xl
              font-semibold
              text-white
              bg-[#7C3AED]
              hover:bg-[#6D28D9]
              shadow-[0_0_25px_rgba(124,58,237,0.35)]
              transition-all
              disabled:opacity-50
            "
          >

            {loading
              ? "Logging In..."
              : "Login"}

          </button>
          <p className="text-[#94A3B8] mt-4 text-center">
            Need to Register? <span className="text-[#FBBF24]  cursor-pointer hover:underline" onClick={() => navigate('/register')}>Register here</span>
          </p>


        </form>

      </div>

    </div>

  </div>
);
}

export default Login;