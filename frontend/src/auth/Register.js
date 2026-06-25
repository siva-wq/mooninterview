import { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import axios from "axios";

import API from "../api/axios";

import socket from '../socket';

function Register() {

    const navigate = useNavigate();

    const [loading, setLoading] =
        useState(false);
    const [organisations, setOrganisations] =
    useState([]);


    const [formData, setFormData] =
        useState({

            name: '',

            email: '',

            organisation:'',

            role: '',

            password: '',

            confirmPassword: ''
        });

    //fetch organisations
    useEffect(() => {
        const fetchOrganisations = async () => {
            try {
                const res = await API.get('/organisations');
                console.log(res.data);
                setOrganisations(res.data.organisations);
            } catch (err) {
                console.error('Error fetching organisations:', err);
            }
        };
        fetchOrganisations();
    }, []);

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

                organisation:
                    formData.organisation,

                password:
                    formData.password,

                role:
                    formData.role
            };
            console.log(sendData)

            const res =
                await axios.post(

                    'https://mooninterview.onrender.com/api/auth/register',

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
        formData.organisation &&
        formData.password &&
        formData.confirmPassword &&
        isPasswordMatch;

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
            Create Account
          </h2>

          <p className="text-[#94A3B8] mt-3">
            Join MoonInterview today
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
                            border border-[#334155]
                            p-3
                            rounded-lg
                            outline-none
                            w-full
                            bg-[#0F172A]
                            text-[#F8FAFC]
                            placeholder-[#64748B]
                            focus:border-[#7C3AED]
                            focus:ring-2
                            focus:ring-[#7C3AED]/30
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
                            border border-[#334155]
                            p-3
                            rounded-lg
                            outline-none
                            w-full
                            bg-[#0F172A]
                            text-[#F8FAFC]
                            placeholder-[#64748B]
                            focus:border-[#7C3AED]
                            focus:ring-2
                            focus:ring-[#7C3AED]/30
                        "
                        required
                    />

                    {/*Organisations*/}
                    <select
                        name="organisation"
                        value={formData.organisation}
                        onChange={handleChange}
                        className="
                            border border-[#334155]
                            p-3
                            rounded-lg
                            outline-none
                            w-full
                            bg-[#0F172A]
                            text-[#F8FAFC]
                        "
                        required
                    >

                        <option value="">
                            Select Organisation
                        </option>

                        {
                            organisations.map(
                                (org) => (

                                    <option
                                        key={org._id}
                                        value={org._id}
                                    >
                                        {org.title}
                                    </option>
                                )
                            )
                        }

                    </select>

                    {/* ROLE */}

                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="
                            border border-[#334155]
                            p-3
                            rounded-lg
                            outline-none
                            w-full
                            bg-[#0F172A]
                            text-[#F8FAFC]
                            placeholder-[#64748B]
                            focus:border-[#7C3AED]
                            focus:ring-2
                            focus:ring-[#7C3AED]/30
                        "
                    >

                        <option value="admin">
                            Admin
                        </option>

                        <option value="candidate">
                            Candidate
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
                            border border-[#334155]
                            p-3
                            rounded-lg
                            outline-none
                            w-full
                            bg-[#0F172A]
                            text-[#F8FAFC]
                            placeholder-[#64748B]
                            focus:border-[#7C3AED]
                            focus:ring-2
                            focus:ring-[#7C3AED]/30
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
                            border border-[#334155]
                            p-3
                            rounded-lg
                            outline-none
                            w-full
                            bg-[#0F172A]
                            text-[#F8FAFC]
                            placeholder-[#64748B]
                            focus:border-[#7C3AED]
                            focus:ring-2
                            focus:ring-[#7C3AED]/30
                        "
                        required
                    />

                    {/* PASSWORD ERROR */}

                    {
                        formData.confirmPassword &&
                        !isPasswordMatch && (

                            <p className="text-[#EF4444] text-sm">

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

                                    ? "bg-gray-600 cursor-not-allowed"

                                    : "bg-[#7C3AED] hover:bg-[#6D28D9] shadow-[0_0_25px_rgba(124,58,237,0.35)]"
                            }
                        `}
                    >

                        {
                            loading

                                ? "Registering..."

                                : "Register"
                        }

                    </button>

                    <p className="text-[#94A3B8] mt-4 text-center">
                        Already have an account? <span className="text-[#FBBF24]  cursor-pointer hover:underline" onClick={() => navigate('/login')}>Login here</span>
                    </p>

                    <p className="text-[#94A3B8] mt-4 text-center">
            Did'nt find your Organisation? Mail us at support@mooninterview.com
          </p>

                </form>

      </div>

    </div>

  </div>
    );
}

export default Register;
