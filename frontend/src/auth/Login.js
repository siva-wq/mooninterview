import { useState } from "react";

import { useNavigate } from "react-router-dom";

import API from "../api/axios";

import socket from "../socket";

function Login() {

    const navigate = useNavigate();

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
                    "https://mooninterview.onrender.com/api/auth/login",
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

            alert(
                "Login Successful"
            );

            // ==========================================
            // ROLE BASED NAVIGATION
            // ==========================================
            if (
                res.data.user.role ===
                "admin"
            ) {

                navigate("/admin");

            } else {

                navigate("/candidate");
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

        <div className="min-h-screen bg-black flex items-center justify-center px-4">

            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 sm:p-8">

                {/* HEADER */}

                <div className="text-center mb-8">

                    <h1 className="text-3xl sm:text-4xl font-bold text-black">

                        Moon Interview

                    </h1>

                    <p className="text-gray-500 mt-3">

                        AI Powered Interview Platform

                    </p>

                </div>

                {/* FORM */}

                <form
                    onSubmit={submit}
                    className="flex flex-col gap-5"
                >

                    {/* EMAIL */}

                    <div>

                        <label className="block mb-2 text-sm font-medium text-gray-700">

                            Email

                        </label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            className="
                                w-full
                                border
                                border-gray-300
                                p-3
                                rounded-xl
                                outline-none
                                focus:ring-2
                                focus:ring-blue-500
                            "
                            required
                        />

                    </div>

                    {/* PASSWORD */}

                    <div>

                        <label className="block mb-2 text-sm font-medium text-gray-700">

                            Password

                        </label>

                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            className="
                                w-full
                                border
                                border-gray-300
                                p-3
                                rounded-xl
                                outline-none
                                focus:ring-2
                                focus:ring-blue-500
                            "
                            required
                        />

                    </div>

                    {/* BUTTON */}

                    <button
                        type="submit"
                        disabled={
                            !isFormValid ||
                            loading
                        }
                        className={`

                            w-full
                            p-3
                            rounded-xl
                            text-white
                            font-semibold
                            transition-all
                            duration-300

                            ${
                                !isFormValid ||
                                loading

                                    ? "bg-gray-400 cursor-not-allowed"

                                    : "bg-blue-600 hover:bg-blue-700"
                            }
                        `}
                    >

                        {
                            loading

                                ? "Logging In..."

                                : "Login"
                        }

                    </button>

                </form>

            </div>

        </div>
    );
}

export default Login;
