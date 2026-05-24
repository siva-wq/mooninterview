import { useEffect, useState } from "react";

import Navbar from "../../common/Navbar";
import Sidebar from "../../common/Sidebar";

import API from "../../../api/axios";

import socket from "../../../socket";

import { useNavigate } from "react-router-dom";

function AdminWaiting() {

  const navigate = useNavigate();

  const [candidates, setCandidates] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // ==========================================
  // FETCH WAITING CANDIDATES
  // ==========================================
  useEffect(() => {

    fetchWaitingCandidates();

  }, []);

  const fetchWaitingCandidates = async () => {

    try {

      setLoading(true);

      // FETCH INTERVIEWS
      const interviewsRes =
        await API.get("/interviews");

      // ONLY SCHEDULED
      const waitingCandidates =
        interviewsRes.data.filter(
          (item) =>
            item.status ===
            "scheduled"
        );

      setCandidates(waitingCandidates);

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

    // JOIN ADMIN ROOM
    socket.emit(
      "join_room",
      "admin_waiting_room"
    );

    // NEW CANDIDATE READY
    socket.on(
      "candidate_ready_status",
      (data) => {

        setCandidates((prev) =>

          prev.map((candidate) =>

            candidate.candidate?._id ===
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

    // NEW INTERVIEW CREATED
    socket.on(
      "new_interview_created",
      (newInterview) => {

        if (
          newInterview.status ===
          "scheduled"
        ) {

          setCandidates((prev) => [

            {
              ...newInterview,
              ready: false
            },

            ...prev

          ]);
        }
      }
    );

    // INTERVIEW STARTED
    socket.on(
      "interview_started",
      (data) => {

        setCandidates((prev) =>

          prev.filter(
            (candidate) =>

              candidate.roomId !==
              data.roomId
          )
        );
      }
    );

    // CANDIDATE REJECTED
    socket.on(
      "candidate_rejected",
      (id) => {

        setCandidates((prev) =>

          prev.filter(
            (candidate) =>

              candidate._id !== id
          )
        );
      }
    );

    return () => {

      socket.off(
        "candidate_ready_status"
      );

      socket.off(
        "new_interview_created"
      );

      socket.off(
        "interview_started"
      );

      socket.off(
        "candidate_rejected"
      );
    };

  }, []);

  // ==========================================
  // JOIN INTERVIEW ROOM
  // ==========================================
  const joinRoom = async (candidate) => {

    try {

      // UPDATE STATUS
      await API.put(
        `/interviews/${candidate._id}`,
        {
          status: "ongoing"
        }
      );

      // SOCKET EVENT
      socket.emit(
        "start_interview",
        {
          roomId: candidate.roomId
        }
      );

      // NAVIGATE
      navigate(
        `/interview-room/${candidate.roomId}`
      );

    } catch (err) {

      console.log(err);

      alert("Failed to join room");
    }
  };

  // ==========================================
  // REJECT CANDIDATE
  // ==========================================
  const rejectCandidate = async (candidate) => {

    try {

      const confirmReject =
        window.confirm(
          "Reject this candidate?"
        );

      if (!confirmReject) return;

      await API.put(
        `/interviews/${candidate._id}`,
        {
          status: "rejected",
          result: "rejected",
          feedback:
            "Candidate rejected before interview"
        }
      );

      // REALTIME REMOVE
      socket.emit(
        "reject_candidate",
        candidate._id
      );

      setCandidates((prev) =>

        prev.filter(
          (item) =>
            item._id !== candidate._id
        )
      );

      alert("Candidate rejected");

    } catch (err) {

      console.log(err);

      alert("Failed to reject");
    }
  };

  // ==========================================
  // FORMAT TIME
  // ==========================================
  const formatTime = (date) => {

    return new Date(date)
      .toLocaleTimeString(
        "en-IN",
        {
          hour: "2-digit",
          minute: "2-digit"
        }
      );
  };

  return (

    <div className="flex min-h-screen bg-gray-50 text-black">

      {/* SIDEBAR */}

      <Sidebar />

      {/* MAIN */}

      <div className="flex-1">

        {/* NAVBAR */}

        <Navbar />

        {/* CONTENT */}

        <div className="p-6">

          {/* HEADER */}

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">

            <div>

              <h1 className="text-4xl font-bold">

                Admin Waiting Room

              </h1>

              <p className="text-gray-500 mt-2">

                Manage and approve candidates before interview

              </p>

            </div>

            {/* LIVE STATUS */}

            <div
              className="
                bg-white
                border
                border-gray-200
                px-6
                py-5
                rounded-2xl
                shadow-sm
                min-w-[220px]
              "
            >

              <p className="text-gray-500 text-sm">

                Waiting Candidates

              </p>

              <h2 className="text-4xl font-bold text-blue-600 mt-2">

                {candidates.length}

              </h2>

            </div>

          </div>

          {/* WAITING SECTION */}

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">

            {/* SECTION HEADER */}

            <div className="flex items-center justify-between mb-8">

              <h2 className="text-2xl font-bold text-black">

                Waiting Candidates

              </h2>

              <span className="bg-blue-600 text-white text-sm px-4 py-2 rounded-full">

                {candidates.length} Waiting

              </span>

            </div>

            {/* LOADING */}

            {
              loading && (

                <p className="text-gray-500">

                  Loading waiting candidates...

                </p>
              )
            }

            {/* EMPTY */}

            {
              !loading &&
              candidates.length === 0 && (

                <div className="text-center py-20">

                  <h2 className="text-2xl font-bold text-zinc-700">

                    No Candidates Waiting

                  </h2>

                  <p className="text-zinc-500 mt-2">

                    Waiting room is currently empty

                  </p>

                </div>
              )
            }

            {/* CANDIDATES GRID */}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

              {
                candidates.map((candidate) => (

                  <div
                    key={candidate._id}
                    className="
                      bg-white
                      border
                      border-gray-200
                      rounded-2xl
                      p-5
                      hover:border-blue-500
                      hover:shadow-xl
                      transition-all
                      duration-300
                    "
                  >

                    {/* TOP */}

                    <div className="flex items-start justify-between">

                      <div>

                        <h3 className="text-xl font-semibold text-black">

                          {
                            candidate.candidate?.name
                          }

                        </h3>

                        <p className="text-gray-600 mt-1">

                          {
                            candidate.candidate?.email
                          }

                        </p>

                      </div>

                      <div className="bg-black px-3 py-1 rounded-lg text-sm text-white">

                        {
                          formatTime(
                            candidate.date
                          )
                        }

                      </div>

                    </div>

                    {/* STATUS */}

                    <div className="mt-5 flex gap-2 flex-wrap">

                      <span className="bg-yellow-100 text-yellow-700 text-sm px-3 py-2 rounded-full font-medium capitalize">

                        {candidate.status}

                      </span>

                      {
                        candidate.ready && (

                          <span className="bg-green-100 text-green-700 text-sm px-3 py-2 rounded-full font-medium">

                            Ready
                          </span>
                        )
                      }

                    </div>

                    {/* ROOM ID */}

                    <div className="mt-4">

                      <p className="text-sm text-zinc-500">

                        Room ID

                      </p>

                      <h3 className="font-semibold text-zinc-800 mt-1">

                        {candidate.roomId}

                      </h3>

                    </div>

                    {/* BUTTONS */}

                    <div className="flex gap-4 mt-6">

                      {/* JOIN */}

                      <button
                        onClick={() =>
                          joinRoom(candidate)
                        }
                        className="
                          flex-1
                          bg-green-600
                          hover:bg-green-700
                          transition-all
                          duration-300
                          py-3
                          rounded-xl
                          font-semibold
                          text-white
                        "
                      >

                        Join To Room

                      </button>

                      {/* REJECT */}

                      <button
                        onClick={() =>
                          rejectCandidate(candidate)
                        }
                        className="
                          flex-1
                          bg-red-600
                          hover:bg-red-700
                          transition-all
                          duration-300
                          py-3
                          rounded-xl
                          font-semibold
                          text-white
                        "
                      >

                        Reject

                      </button>

                    </div>

                  </div>
                ))
              }

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminWaiting;