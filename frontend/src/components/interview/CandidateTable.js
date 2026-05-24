import { useEffect, useState } from "react";
import DashboardCard from "../dashboard/DashboardCard";
import API from "../../api/axios";
import socket from "../../socket";
import SendMail from "./SendMail";

function CandidateTable() {

    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] =
        useState("All Status");

    // ==========================================
    // FETCH CANDIDATES
    // ==========================================
    const fetchCandidates = async () => {

        try {

            setLoading(true);

            const usersRes =
                await API.get("/users");

            const interviewsRes =
                await API.get("/interviews");

            const candidateUsers =
                usersRes.data.filter(
                    (user) =>
                        user.role === "candidate"
                );

            const mergedData =
                candidateUsers.map((candidate) => {

                    const interview =
                        interviewsRes.data.find(
                            (item) =>
                                item.candidate?._id ===
                                candidate._id
                        );

                    return {

                        ...candidate,

                        interviewId:
                            interview?._id || "",

                        interviewer:
                            interview?.interviewer?.name ||
                            "N/A",

                        status:
                            interview?.status ||
                            "Pending",

                        roomId:
                            interview?.roomId ||
                            "N/A",

                        date:
                            interview?.date || "",

                        interviewType:
                            interview?.type ||
                            "Technical",

                        ready: false
                    };
                });

            setCandidates(mergedData);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);
        }
    };

    // ==========================================
    // FETCH ON LOAD
    // ==========================================
    useEffect(() => {

        fetchCandidates();

    }, []);

    // ==========================================
    // SOCKET EVENTS
    // ==========================================
    useEffect(() => {

        socket.connect();

        socket.on(
            "new_candidate",
            (candidate) => {

                setCandidates((prev) => [

                    {
                        ...candidate,
                        status: "Pending",
                        interviewer: "N/A",
                        roomId: "N/A",
                        interviewType: "Technical"
                    },

                    ...prev
                ]);
            }
        );

        socket.on(
            "candidate_ready_status",
            (data) => {

                setCandidates((prev) =>

                    prev.map((candidate) =>

                        candidate._id ===
                            data.candidateId

                            ? {
                                ...candidate,
                                ready: true
                            }

                            : candidate
                    )
                );
            }
        );

        socket.on(
            "interview_started",
            (data) => {

                setCandidates((prev) =>

                    prev.map((candidate) =>

                        candidate.roomId ===
                            data.roomId

                            ? {
                                ...candidate,
                                status: "ongoing"
                            }

                            : candidate
                    )
                );
            }
        );

        socket.on(
            "interview_ended",
            (data) => {

                setCandidates((prev) =>

                    prev.map((candidate) =>

                        candidate.roomId ===
                            data.roomId

                            ? {
                                ...candidate,
                                status: "completed"
                            }

                            : candidate
                    )
                );
            }
        );

        return () => {

            socket.off("new_candidate");
            socket.off("candidate_ready_status");
            socket.off("interview_started");
            socket.off("interview_ended");
        };

    }, []);

    // ==========================================
    // FILTER
    // ==========================================
    const filteredCandidates =
        candidates.filter((candidate) => {

            const matchesSearch =

                candidate.name
                    .toLowerCase()
                    .includes(
                        search.toLowerCase()
                    )

                ||

                candidate.email
                    .toLowerCase()
                    .includes(
                        search.toLowerCase()
                    );

            const matchesStatus =

                statusFilter ===
                "All Status"

                ||

                candidate.status ===
                statusFilter;

            return (
                matchesSearch &&
                matchesStatus
            );
        });

    // ==========================================
    // COUNTS
    // ==========================================
    const totalCandidates =
        candidates.length;

    const scheduledCount =
        candidates.filter(
            (c) =>
                c.status === "scheduled"
        ).length;

    const completedCount =
        candidates.filter(
            (c) =>
                c.status === "completed"
        ).length;

    const pendingCount =
        candidates.filter(
            (c) =>
                c.status === "Pending"
        ).length;

    // ==========================================
    // SEND MAIL
    // ==========================================
    const sendMail = async (candidate) => {

        await SendMail(candidate);
    };

    // ==========================================
    // FORMAT DATE
    // ==========================================
    const formatDate = (date) => {

        if (!date) return "N/A";

        return new Date(date)
            .toLocaleDateString(
                "en-IN",
                {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                }
            );
    };

    // ==========================================
    // FORMAT TIME
    // ==========================================
    const formatTime = (date) => {

        if (!date) return "N/A";

        return new Date(date)
            .toLocaleTimeString(
                "en-IN",
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );
    };

    // ==========================================
    // LOADING UI
    // ==========================================
    if (loading) {

        return (

            <div className="
                min-h-screen
                flex
                items-center
                justify-center
                text-2xl
                font-bold
            ">

                Loading Candidates...

            </div>
        );
    }

    return (

        <div className="min-h-screen bg-[#f5f7fb] p-6 space-y-6">

            {/* TOP CARDS */}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                <DashboardCard
                    title="Total Candidates"
                    value={totalCandidates}
                    increase="+12%"
                />

                <DashboardCard
                    title="Scheduled"
                    value={scheduledCount}
                    increase="+5%"
                />

                <DashboardCard
                    title="Completed"
                    value={completedCount}
                    increase="+3%"
                />

                <DashboardCard
                    title="Pending"
                    value={pendingCount}
                    increase="+2%"
                />

            </div>

            {/* SEARCH */}

            <div className="flex flex-col md:flex-row justify-between gap-4">

                <input
                    type="text"
                    placeholder="Search candidates..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    className="
                        border
                        border-black
                        rounded-2xl
                        px-5
                        py-3
                        outline-none
                        w-full
                        md:w-80
                    "
                />

                <select
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(
                            e.target.value
                        )
                    }
                    className="
                        border
                        border-black
                        rounded-2xl
                        px-5
                        py-3
                    "
                >

                    <option>
                        All Status
                    </option>

                    <option>
                        Pending
                    </option>

                    <option>
                        scheduled
                    </option>

                    <option>
                        ongoing
                    </option>

                    <option>
                        completed
                    </option>

                </select>

            </div>

            {/* TABLE */}

            <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-black text-white">

                            <tr>

                                <th className="p-4 text-left">
                                    Candidate
                                </th>

                                <th className="p-4 text-left">
                                    Interviewer
                                </th>

                                <th className="p-4 text-left">
                                    Date
                                </th>

                                <th className="p-4 text-left">
                                    Time
                                </th>

                                <th className="p-4 text-left">
                                    Status
                                </th>

                                <th className="p-4 text-left">
                                    Actions
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredCandidates.map(
                                (candidate) => (

                                    <tr
                                        key={candidate._id}
                                        className="
                                            border-b
                                            hover:bg-zinc-50
                                        "
                                    >

                                        <td className="p-4">

                                            <div className="font-semibold">
                                                {candidate.name}
                                            </div>

                                            <div className="text-sm text-zinc-500">
                                                {candidate.email}
                                            </div>

                                        </td>

                                        <td className="p-4">
                                            {candidate.interviewer}
                                        </td>

                                        <td className="p-4">
                                            {formatDate(candidate.date)}
                                        </td>

                                        <td className="p-4">
                                            {formatTime(candidate.date)}
                                        </td>

                                        <td className="p-4">

                                            <span className="
                                                px-4
                                                py-1
                                                rounded-full
                                                text-sm
                                                bg-blue-100
                                                text-blue-700
                                            ">

                                                {candidate.status}

                                            </span>

                                        </td>

                                        <td className="p-4">

                                            <button
                                                onClick={() =>
                                                    sendMail(candidate)
                                                }
                                                className="
                                                    bg-black
                                                    text-white
                                                    px-4
                                                    py-2
                                                    rounded-xl
                                                "
                                            >

                                                Send Email

                                            </button>

                                        </td>

                                    </tr>
                                ))}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}

export default CandidateTable;
