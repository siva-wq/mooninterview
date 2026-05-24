import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import API from "../../api/axios";

import socket from "../../socket";

function InterviewTable() {

    const navigate = useNavigate();

    const [interviews, setInterviews] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [search, setSearch] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("All Status");

    // ==========================================
    // FETCH INTERVIEWS
    // ==========================================
    useEffect(() => {

        fetchInterviews();

    }, []);

    const fetchInterviews = async () => {

        try {

            setLoading(true);

            const res = await API.get(
                "/interviews"
            );

            setInterviews(res.data);

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
            (newInterview) => {

                setInterviews((prev) => [

                    newInterview,

                    ...prev

                ]);
            }
        );

        // INTERVIEW STARTED
        socket.on(
            "interview_started",
            (data) => {

                setInterviews((prev) =>

                    prev.map((item) =>

                        item.roomId ===
                        data.roomId

                            ? {
                                  ...item,
                                  status: "ongoing"
                              }

                            : item
                    )
                );
            }
        );

        // INTERVIEW ENDED
        socket.on(
            "interview_ended",
            (data) => {

                setInterviews((prev) =>

                    prev.map((item) =>

                        item.roomId ===
                        data.roomId

                            ? {
                                  ...item,
                                  status: "completed"
                              }

                            : item
                    )
                );
            }
        );

        // INTERVIEW DELETED
        socket.on(
            "interview_deleted",
            (deletedId) => {

                setInterviews((prev) =>

                    prev.filter(
                        (item) =>
                            item._id !== deletedId
                    )
                );
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
                "interview_deleted"
            );
        };

    }, []);

    // ==========================================
    // NAVIGATE TO SCHEDULE
    // ==========================================
    const navigateToSchedule = () => {

        navigate("/admin/schedule");
    };

    // ==========================================
    // FILTERING
    // ==========================================
    const filteredInterviews =
        interviews.filter((item) => {

            const candidateName =
                item.candidate?.name || "";

            const candidateEmail =
                item.candidate?.email || "";

            const interviewerName =
                item.interviewer?.name || "";

            const matchesSearch =

                candidateName
                    .toLowerCase()
                    .includes(
                        search.toLowerCase()
                    )

                ||

                candidateEmail
                    .toLowerCase()
                    .includes(
                        search.toLowerCase()
                    )

                ||

                interviewerName
                    .toLowerCase()
                    .includes(
                        search.toLowerCase()
                    );

            const matchesStatus =

                statusFilter ===
                "All Status"

                ||

                item.status ===
                statusFilter.toLowerCase();

            return (
                matchesSearch &&
                matchesStatus
            );
        });

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
    // DELETE INTERVIEW
    // ==========================================
    const deleteInterview = async (id) => {

        try {

            const confirmDelete =
                window.confirm(
                    "Delete this interview?"
                );

            if (!confirmDelete) return;

            const res = await API.delete(
                `/interviews/${id}`
            );

            alert(res.data.message);

            // REALTIME DELETE
            socket.emit(
                "delete_interview",
                id
            );

            setInterviews((prev) =>

                prev.filter(
                    (item) =>
                        item._id !== id
                )
            );

        } catch (err) {

            console.log(err);

            alert(
                err.response?.data?.message ||
                "Delete failed"
            );
        }
    };

    // ==========================================
    // JOIN INTERVIEW
    // ==========================================
    const joinInterview = (roomId) => {

        navigate(
            `/admin/waiting`
        );
    };

    // ==========================================
    // VIEW REPORT
    // ==========================================
    const viewReport = (id) => {

        navigate(`/report/${id}`);
    };

    return (

    <div className="space-y-6">

        {/* SEARCH + FILTER */}

        <div className="flex flex-col md:flex-row justify-between gap-4">

            {/* SEARCH */}

            <input
                type="text"
                placeholder="Search candidates..."
                value={search}
                onChange={(e) =>
                    setSearch(e.target.value)
                }
                className="
                    bg-white
                    border
                    border-zinc-200
                    rounded-2xl
                    px-5
                    py-3
                    outline-none
                    focus:ring-4
                    focus:ring-blue-100
                    focus:border-blue-400
                    shadow-sm
                    transition-all
                    duration-300
                    w-full
                    md:w-80
                    text-zinc-800
                "
            />

            {/* FILTER */}

            <select
                value={statusFilter}
                onChange={(e) =>
                    setStatusFilter(e.target.value)
                }
                className="
                    bg-white
                    border
                    border-zinc-200
                    rounded-2xl
                    px-5
                    py-3
                    outline-none
                    focus:ring-4
                    focus:ring-blue-100
                    focus:border-blue-400
                    shadow-sm
                    text-zinc-700
                "
            >

                <option>All Status</option>
                <option>scheduled</option>
                <option>ongoing</option>
                <option>completed</option>
                <option>pending</option>

            </select>

        </div>

        {/* TABLE */}

        <div
            className="
                bg-white
                border
                border-zinc-200
                rounded-3xl
                p-6
                shadow-sm
            "
        >

            {/* HEADER */}

            <div className="flex items-center justify-between mb-8">

                <div>

                    <h2 className="text-2xl font-bold text-zinc-900">
                        Interviews
                    </h2>

                    <p className="text-zinc-500 text-sm mt-1">
                        Manage scheduled interviews
                    </p>

                </div>

                <button
                    onClick={navigateToSchedule}
                    className="
                        bg-blue-600
                        hover:bg-blue-700
                        text-white
                        px-5
                        py-3
                        rounded-2xl
                        font-semibold
                        shadow-lg
                        transition-all
                        duration-300
                    "
                >
                    + Schedule Interview
                </button>

            </div>

            {/* LOADING */}

            {loading ? (

                <div className="py-20 text-center text-zinc-500">
                    Loading interviews...
                </div>

            ) : (

                <div className="overflow-x-auto">

                    <table className="w-full min-w-[1200px]">

                        <thead>

                            <tr className="border-b border-zinc-200 text-zinc-500 text-sm">

                                <th className="pb-5 text-left font-semibold">
                                    Candidate
                                </th>

                                <th className="pb-5 text-left font-semibold">
                                    Interviewer
                                </th>

                                <th className="pb-5 text-left font-semibold">
                                    Role
                                </th>

                                <th className="pb-5 text-left font-semibold">
                                    Date
                                </th>

                                <th className="pb-5 text-left font-semibold">
                                    Time
                                </th>

                                <th className="pb-5 text-left font-semibold">
                                    Status
                                </th>

                                <th className="pb-5 text-left font-semibold">
                                    Action
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredInterviews.length > 0 ? (

                                filteredInterviews.map((item) => (

                                    <tr
                                        key={item._id}
                                        className="
                                            border-b
                                            border-zinc-100
                                            hover:bg-zinc-50
                                            transition-all
                                            duration-300
                                        "
                                    >

                                        {/* CANDIDATE */}

                                        <td className="py-6">

                                            <div className="flex items-center gap-4">

                                                <div
                                                    className="
                                                        w-11
                                                        h-11
                                                        rounded-2xl
                                                        bg-gradient-to-br
                                                        from-blue-500
                                                        to-indigo-500
                                                        flex
                                                        items-center
                                                        justify-center
                                                        text-white
                                                        font-bold
                                                    "
                                                >

                                                    {
                                                        item.candidate?.name?.charAt(0)
                                                    }

                                                </div>

                                                <div>

                                                    <p className="text-zinc-900 font-semibold">
                                                        {
                                                            item.candidate?.name
                                                        }
                                                    </p>

                                                    <p className="text-zinc-500 text-sm">
                                                        {
                                                            item.candidate?.email
                                                        }
                                                    </p>

                                                </div>

                                            </div>

                                        </td>

                                        {/* INTERVIEWER */}

                                        <td className="py-6 text-zinc-700">

                                            {
                                                item.interviewer?.name || "N/A"
                                            }

                                        </td>

                                        {/* ROLE */}

                                        <td className="py-6 text-zinc-700">

                                            {
                                                item.role || "Developer"
                                            }

                                        </td>

                                        {/* DATE */}

                                        <td className="py-6 text-zinc-700">

                                            {formatDate(item.date)}

                                        </td>

                                        {/* TIME */}

                                        <td className="py-6 text-zinc-700">

                                            {formatTime(item.date)}

                                        </td>

                                        {/* STATUS */}

                                        <td className="py-6">

                                            <span
                                                className={`
                                                    px-4
                                                    py-1.5
                                                    rounded-full
                                                    text-xs
                                                    font-semibold

                                                    ${
                                                        item.status === "scheduled"
                                                            ? "bg-blue-100 text-blue-700"

                                                            : item.status === "ongoing"
                                                            ? "bg-green-100 text-green-700"

                                                            : item.status === "completed"
                                                            ? "bg-zinc-200 text-zinc-700"

                                                            : "bg-yellow-100 text-yellow-700"
                                                    }
                                                `}
                                            >

                                                {item.status}

                                            </span>

                                        </td>

                                        {/* ACTION */}

                                        <td className="py-6">

                                            <div className="flex items-center gap-3">

                                                {/* JOIN BUTTON */}

                                                {(item.status === "scheduled" ||
                                                    item.status === "ongoing") && (

                                                    <button
                                                        onClick={() =>
                                                            joinInterview(
                                                                item.roomId
                                                            )
                                                        }
                                                        className="
                                                            bg-gradient-to-r
                                                            from-zinc-900
                                                            to-zinc-700
                                                            hover:scale-105
                                                            transition-all
                                                            duration-300
                                                            px-5
                                                            py-2.5
                                                            rounded-2xl
                                                            text-sm
                                                            font-semibold
                                                            text-white
                                                            shadow-lg
                                                        "
                                                    >
                                                        Join Interview
                                                    </button>

                                                )}

                                                {/* VIEW REPORT */}

                                                {item.status === "completed" && (

                                                    <button
                                                        onClick={() =>
                                                            viewReport(
                                                                item._id
                                                            )
                                                        }
                                                        className="
                                                            bg-blue-100
                                                            hover:bg-blue-200
                                                            transition-all
                                                            duration-300
                                                            px-5
                                                            py-2.5
                                                            rounded-2xl
                                                            text-sm
                                                            font-semibold
                                                            text-blue-700
                                                        "
                                                    >
                                                        View Report
                                                    </button>

                                                )}

                                                {/* DELETE */}

                                                <button
                                                    onClick={() =>
                                                        deleteInterview(
                                                            item._id
                                                        )
                                                    }
                                                    className="
                                                        bg-red-100
                                                        hover:bg-red-200
                                                        transition-all
                                                        duration-300
                                                        px-4
                                                        py-2.5
                                                        rounded-2xl
                                                        text-sm
                                                        font-semibold
                                                        text-red-700
                                                    "
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="
                                            text-center
                                            py-20
                                            text-zinc-500
                                        "
                                    >

                                        No interviews found

                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            )}

        </div>

    </div>
);
}

export default InterviewTable;