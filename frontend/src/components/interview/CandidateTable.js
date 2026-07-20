import { useEffect, useState } from "react";
import API from "../../api/axios";
import socket from "../../socket";
import SendMail from "./SendMail";

function CandidateTable() {

    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All Status");
    const [scheduleData, setScheduleData] = useState({});
    const [mailLoading, setMailLoading] =
        useState({});


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
                   // console.log(candidate);

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
                        time: interview?.time || "",

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
    const handleScheduleChange = (
        candidateId,
        field,
        value
    ) => {

        setScheduleData((prev) => ({

            ...prev,

            [candidateId]: {

                ...prev[candidateId],

                [field]: value

            }

        }));

    };

    const handleSchedule = async (candidate) => {

        const selectedData =
            scheduleData[candidate._id];

        if (
            !selectedData?.date ||
            !selectedData?.time
        ) {
            alert(
                "Please select date and time"
            );
            return;
        }

        try {

            const response = await API.post(
                "/interviews",
                {
                    title: "Interview",
                    candidate:
                        candidate._id,

                    date:
                        selectedData.date,

                    time:
                        selectedData.time
                }
            );

           // console.log("API Response:", response.data);

            // Update local state instead of refetching all candidates
            setCandidates(prevCandidates =>
                prevCandidates.map(c =>
                    c._id === candidate._id
                        ? {
                            ...c,
                            interviewId: response.data.interview._id,
                            interviewer: response.data.interview.interviewer?.name || "N/A",
                            roomId: response.data.interview.roomId || "N/A",
                            date: selectedData.date,
                            time: selectedData.time,
                            status: "Scheduled"
                        }
                        : c
                )
            );

            // Clear schedule data for this candidate
            setScheduleData(prev => {
                const newData = { ...prev };
                delete newData[candidate._id];
                return newData;
            });

        } catch (error) {

            console.log(error);

        }
    };
    // ==========================================
    // SEND MAIL
    // ==========================================
    const sendMail = async (candidate) => {
        //console.log(candidate);
        setMailLoading(prev => ({
            ...prev,
            [candidate._id]: "sending mail"
        }));

        const send = await SendMail({ candidate, type: "Interview-invitation" });
        //console.log(send);
        if (send.success) {
            setMailLoading(prev => ({
                ...prev,
                [candidate._id]: "mail sent"
            }));
        }
        //console.log(send);
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
    const formatTime = (time) => {
        if (!time) return "N/A";

        const [hours, minutes] = time.split(":");

        return new Date(
            2000,
            0,
            1,
            Number(hours),
            Number(minutes)
        ).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
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
        <div className="min-h-screen bg-background p-4 sm:p-6 space-y-4 sm:space-y-6">

            {/* TOP CARDS */}

            {/* SEARCH */}

            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">

                <input
                    type="text"
                    placeholder="Search candidates..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    className="
                        border
                        border-custom
                        rounded-2xl
                        px-5
                        py-3
                        outline-none
                        w-full
                        sm:w-64
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
                        border-custom
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

            <div className="card rounded-2xl sm:rounded-3xl shadow-lg overflow-hidden">

                <div className="overflow-x-auto">

                    <table className="w-full min-w-[600px]">

                        <thead className="bg-navy text-white">

                            <tr>

                                <th className="p-3 sm:p-4 text-left text-sm sm:text-base">
                                    Candidate
                                </th>

                                <th className="p-3 sm:p-4 text-left text-sm sm:text-base">
                                    Interviewer
                                </th>

                                <th className="p-3 sm:p-4 text-left text-sm sm:text-base">
                                    Date
                                </th>

                                <th className="p-3 sm:p-4 text-left text-sm sm:text-base">
                                    Time
                                </th>

                                <th className="p-3 sm:p-4 text-left text-sm sm:text-base">
                                    Status
                                </th>

                                <th className="p-3 sm:p-4 text-left text-sm sm:text-base">
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

                                        <td className="p-3 sm:p-4 text-navy">

                                            <div className="font-semibold text-sm sm:text-base">
                                                {candidate.name}
                                            </div>

                                            <div className="text-xs sm:text-sm text-secondary">
                                                {candidate.email}
                                            </div>

                                        </td>

                                        <td className="p-3 sm:p-4 text-navy">
                                            {candidate.interviewer}
                                        </td>

                                        <td className="p-3 sm:p-4 text-navy">

                                            {candidate.date ? (

                                                formatDate(candidate.date)

                                            ) : (

                                                <input
                                                    type="date"
                                                    className="
                border
                border-custom
                rounded-xl
                px-2 sm:px-3
                py-1.5 sm:py-2
                text-sm
            "
                                                    onChange={(e) =>
                                                        handleScheduleChange(
                                                            candidate._id,
                                                            "date",
                                                            e.target.value
                                                        )
                                                    }
                                                />

                                            )}

                                        </td>

                                        <td className="p-3 sm:p-4 text-navy">

                                            {candidate.time ? (

                                                formatTime(candidate.time)

                                            ) : (

                                                <input
                                                    type="time"
                                                    className="
                                                        border
                                                        border-zinc-300
                                                        rounded-xl
                                                        px-2 sm:px-3
                                                        py-1.5 sm:py-2
                                                        text-sm
                                                    "
                                                    onChange={(e) =>
                                                        handleScheduleChange(
                                                            candidate._id,
                                                            "time",
                                                            e.target.value
                                                        )
                                                    }
                                                />

                                            )}

                                        </td>

                                        <td className="p-4">

                                            <span className="
                                                px-3 sm:px-4
                                                py-1
                                                rounded-full
                                                text-xs sm:text-sm
                                                bg-blue-100
                                                text-primary
                                            ">

                                                {candidate.status}

                                            </span>

                                        </td>

                                        <td className="p-4">

                                            {!candidate.date ? (

                                                <button onClick={() => handleSchedule(candidate)}
                                                    className="
                                                        btn-primary
                                                        px-3 sm:px-4
                                                        py-1.5 sm:py-2
                                                        rounded-xl
                                                        text-sm
                                                    "
                                                >
                                                    Schedule
                                                </button>

                                            ) : (

                                                <button
                                                    onClick={() =>
                                                        sendMail(candidate)
                                                    }
                                                    className="
                                                        bg-navy
                                                        text-white
                                                        px-3 sm:px-4
                                                        py-1.5 sm:py-2
                                                        rounded-xl
                                                        text-sm
                                                    "
                                                >
                                                    {
                                                        mailLoading[candidate._id]
                                                        || "Send Mail"
                                                    }
                                                </button>

                                            )}

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