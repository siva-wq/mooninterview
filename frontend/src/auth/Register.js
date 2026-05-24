import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import API from '../api/axios';

import socket from '../socket';

function Register() {

    const navigate = useNavigate();

    const [loading, setLoading] =
        useState(false);

    const [formData, setFormData] =
        useState({

            name: '',

            email: '',

            role: 'admin',

            password: '',

            confirmPassword: ''
        });

    // ==========================================
    // HANDLE INPUT CHANGE
    // ==========================================
    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]:
                e.target.value
        });
    };

    // ==========================================
    // REGISTER USER
    // ==========================================
    const Reg = async (e) => {

        e.preventDefault();

        // PASSWORD CHECK
        if (!isPasswordMatch) {

            alert(
                "Passwords do not match"
            );

            return;
        }

        try {

            setLoading(true);

            // SEND ONLY REQUIRED FIELDS
            const sendData = {

                name:
                    formData.name,

                email:
                    formData.email,

                password:
                    formData.password,

                role:
                    formData.role
            };

            const res =
                await API.post(

                    '/auth/register',

                    sendData
                );

            // ==========================================
            // SOCKET CONNECTION
            // ==========================================
            socket.connect();

            // ==========================================
            // NEW CANDIDATE EVENT
            // ==========================================
            if (
                res.data.user?.role ===
                "candidate"
            ) {

                socket.emit(
                    "register_candidate",
                    res.data.user
                );
            }

            // ==========================================
            // NEW USER NOTIFICATION
            // ==========================================
            socket.emit(
                "notification",
                {
                    type: "success",

                    message:
                        `${sendData.name} registered successfully`
                }
            );

            alert(
                res.data.message
            );

            // REDIRECT LOGIN
            navigate('/login');

        } catch (err) {

            console.log(err);

            alert(

                err.response?.data?.message ||

                'Registration Failed'
            );

        } finally {

            setLoading(false);
        }
    };

    // ==========================================
    // VALIDATIONS
    // ==========================================
    const isPasswordMatch =

        formData.password ===
        formData.confirmPassword;

    const isFormValid =

        formData.name &&
        formData.email &&
        formData.password &&
        formData.confirmPassword &&
        isPasswordMatch;

    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

            <div className="bg-white w-full max-w-md p-6 sm:p-8 rounded-2xl shadow-lg">

                {/* HEADER */}

                <div className="text-center mb-8">

                    <h1 className="text-3xl font-bold text-black">

                        Moon Interview

                    </h1>

                    <p className="text-gray-500 mt-2">

                        Create your account

                    </p>

                </div>

                {/* FORM */}

                <form
                    onSubmit={Reg}
                    className="flex flex-col gap-4"
                >

                    {/* NAME */}

                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="
                            border
                            p-3
                            rounded-lg
                            outline-none
                            w-full
                            focus:ring-2
                            focus:ring-blue-500
                        "
                        required
                    />

                    {/* EMAIL */}

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="
                            border
                            p-3
                            rounded-lg
                            outline-none
                            w-full
                            focus:ring-2
                            focus:ring-blue-500
                        "
                        required
                    />

                    {/* ROLE */}

                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="
                            border
                            p-3
                            rounded-lg
                            outline-none
                            w-full
                            focus:ring-2
                            focus:ring-blue-500
                        "
                    >

                        <option value="admin">
                            Admin
                        </option>

                        <option value="candidate">
                            Candidate
                        </option>

                        <option value="interviewer">
                            Interviewer
                        </option>

                    </select>

                    {/* PASSWORD */}

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="
                            border
                            p-3
                            rounded-lg
                            outline-none
                            w-full
                            focus:ring-2
                            focus:ring-blue-500
                        "
                        required
                    />

                    {/* CONFIRM PASSWORD */}

                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="
                            border
                            p-3
                            rounded-lg
                            outline-none
                            w-full
                            focus:ring-2
                            focus:ring-blue-500
                        "
                        required
                    />

                    {/* PASSWORD ERROR */}

                    {
                        formData.confirmPassword &&
                        !isPasswordMatch && (

                            <p className="text-red-500 text-sm">

                                Passwords do not match

                            </p>
                        )
                    }

                    {/* BUTTON */}

                    <button
                        type="submit"
                        disabled={
                            !isFormValid ||
                            loading
                        }
                        className={`

                            p-3
                            rounded-lg
                            text-white
                            font-semibold
                            transition-all
                            duration-300

                            ${
                                !isFormValid ||
                                loading

                                    ? "bg-gray-400 cursor-not-allowed"

                                    : "bg-black hover:bg-gray-800"
                            }
                        `}
                    >

                        {
                            loading

                                ? "Registering..."

                                : "Register"
                        }

                    </button>

                </form>

            </div>

        </div>
    );
}

export default Register;