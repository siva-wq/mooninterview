import { useEffect, useState } from "react";

import DashboardCard from "../components/dashboard/DashboardCard";

import Sidebar from "../components/common/Sidebar";
import Navbar from "../components/common/Navbar";

import InterviewTable from "../components/interview/InterviewTable";

import API from "../api/axios";

import socket from "../socket";

function Interviews() {

    const [stats, setStats] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    // ==========================================
    // FETCH INTERVIEW STATS
    // ==========================================
    useEffect(() => {

        fetchInterviewStats();

    }, []);

    const fetchInterviewStats = async () => {

        try {

            setLoading(true);

            const res = await API.get(
                "/interviews"
            );

            const interviews =
                res.data;

            // TOTAL
            const totalInterviews =
                interviews.length;

            // LIVE
            const liveInterviews =
                interviews.filter(
                    (item) =>
                        item.status ===
                        "ongoing"
                ).length;

            // COMPLETED
            const completedInterviews =
                interviews.filter(
                    (item) =>
                        item.status ===
                        "completed"
                ).length;

            // PENDING
            const pendingInterviews =
                interviews.filter(
                    (item) =>
                        item.status ===
                        "pending"
                ).length;

            // SCHEDULED
            const scheduledInterviews =
                interviews.filter(
                    (item) =>
                        item.status ===
                        "scheduled"
                ).length;

            // SELECTED
            const selectedCandidates =
                interviews.filter(
                    (item) =>
                        item.result ===
                        "selected"
                ).length;

            // REJECTED
            const rejectedCandidates =
                interviews.filter(
                    (item) =>
                        item.result ===
                        "rejected"
                ).length;

            setStats({

                totalInterviews,

                liveInterviews,

                completedInterviews,

                pendingInterviews,

                scheduledInterviews,

                selectedCandidates,

                rejectedCandidates
            });

        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);
        }
    };

    // ==========================================
    // SOCKET REALTIME EVENTS
    // ==========================================
    useEffect(() => {

        socket.connect();

        // NEW INTERVIEW CREATED
        socket.on(
            "new_interview_created",
            () => {

                fetchInterviewStats();
            }
        );

        // INTERVIEW STARTED
        socket.on(
            "interview_started",
            () => {

                fetchInterviewStats();
            }
        );

        // INTERVIEW ENDED
        socket.on(
            "interview_ended",
            () => {

                fetchInterviewStats();
            }
        );

        // REPORT UPDATED
        socket.on(
            "report_updated",
            () => {

                fetchInterviewStats();
            }
        );

        // INTERVIEW DELETED
        socket.on(
            "interview_deleted",
            () => {

                fetchInterviewStats();
            }
        );

        return () => {

            socket.off(
                "new_interview_created"
            );

            socket.off(
                "interview_started"
            );

            socket.off(
                "interview_ended"
            );

            socket.off(
                "report_updated"
            );

            socket.off(
                "interview_deleted"
            );
        };

    }, []);

    return (

        <div className="flex h-screen bg-[#F5F7FB] overflow-hidden">

            {/* SIDEBAR */}

            <div className="h-screen sticky top-0">

                <Sidebar />

            </div>

            {/* MAIN CONTENT */}

            <div className="flex-1 flex flex-col overflow-hidden">

                {/* NAVBAR */}

                <div className="sticky top-0 z-50 bg-[#F5F7FB]">

                    <Navbar />

                </div>

                {/* CONTENT */}

                <div className="flex-1 overflow-y-auto p-6">

                    <div className="space-y-6">

                        {/* PAGE HEADER */}

                        <div className="flex items-center justify-between">

                            <div>

                                <h1 className="text-3xl font-bold text-gray-900">

                                    Interviews Dashboard

                                </h1>

                                <p className="text-gray-500 mt-1">

                                    Monitor interviews, candidates, and hiring progress

                                </p>

                            </div>

                        </div>

                        {/* LOADING */}

                        {
                            loading && (

                                <div className="bg-white p-5 rounded-2xl shadow-sm">

                                    <p className="text-zinc-500">

                                        Loading interview statistics...

                                    </p>

                                </div>
                            )
                        }

                        {/* DASHBOARD CARDS */}

                        <div
                            className="
                                grid
                                grid-cols-1
                                sm:grid-cols-2
                                lg:grid-cols-4
                                gap-5
                            "
                        >

                            <DashboardCard
                                title="Total Interviews"
                                value={
                                    stats?.totalInterviews || 0
                                }
                                increase="+12%"
                            />

                            <DashboardCard
                                title="Live Interviews"
                                value={
                                    stats?.liveInterviews || 0
                                }
                                increase="+8%"
                            />

                            <DashboardCard
                                title="Completed"
                                value={
                                    stats?.completedInterviews || 0
                                }
                                increase="+18%"
                            />

                            <DashboardCard
                                title="Pending"
                                value={
                                    stats?.pendingInterviews || 0
                                }
                                increase="+5%"
                            />

                            <DashboardCard
                                title="Scheduled"
                                value={
                                    stats?.scheduledInterviews || 0
                                }
                                increase="+10%"
                            />

                            <DashboardCard
                                title="Selected"
                                value={
                                    stats?.selectedCandidates || 0
                                }
                                increase="+10%"
                            />

                            <DashboardCard
                                title="Rejected"
                                value={
                                    stats?.rejectedCandidates || 0
                                }
                                increase="-2%"
                            />

                        </div>

                        {/* INTERVIEW TABLE SECTION */}

                        <div
                            className="
                                bg-white
                                rounded-3xl
                                shadow-sm
                                border
                                border-gray-200
                                p-6
                            "
                        >

                            {/* HEADER */}

                            <div className="flex items-center justify-between mb-6">

                                <div>

                                    <h2 className="text-xl font-bold text-gray-900">

                                        Upcoming Interviews

                                    </h2>

                                    <p className="text-gray-500 text-sm mt-1">

                                        Manage and track scheduled interviews

                                    </p>

                                </div>

                            </div>

                            {/* TABLE */}

                            <InterviewTable />

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );
}

export default Interviews;