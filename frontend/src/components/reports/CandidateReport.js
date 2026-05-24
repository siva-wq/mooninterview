import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import API from "../../api/axios";

import socket from "../../socket";

function CandidateReport() {

  const { id } = useParams();

  const [candidate, setCandidate] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  // ==========================================
  // FETCH INTERVIEW REPORT
  // ==========================================
 

  useEffect(() => {

    const fetchInterview = async () => {

        try {

      setLoading(true);

      const res = await API.get(
        `/interviews/${id}`
      );

      setCandidate(res.data);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);
    }
    };

    fetchInterview();

}, []);

  // ==========================================
  // SOCKET REALTIME REPORT UPDATES
  // ==========================================
  useEffect(() => {

    socket.connect();

    // REPORT UPDATED
    socket.on(
      "report_updated",
      (updatedReport) => {

        if (
          updatedReport._id === id
        ) {

          setCandidate(updatedReport);
        }
      }
    );

    // INTERVIEW ENDED
    socket.on(
      "interview_ended",
      (data) => {

        if (
          candidate?.roomId ===
          data.roomId
        ) {

          setCandidate((prev) => ({

            ...prev,

            status: "completed"

          }));
        }
      }
    );

    return () => {

      socket.off(
        "report_updated"
      );

      socket.off(
        "interview_ended"
      );
    };

  }, [candidate, id]);

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center text-2xl font-bold">

        Loading Report...

      </div>
    );
  }

  // ==========================================
  // NO DATA
  // ==========================================
  if (!candidate) {

    return (

      <div className="min-h-screen flex items-center justify-center text-2xl font-bold">

        Report Not Found

      </div>
    );
  }

  return (

    <div className="bg-[#F5F7FB] min-h-screen p-8 rounded-[32px]">

      <div className="max-w-7xl mx-auto space-y-8">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div
          className="
            bg-white
            rounded-[28px]
            border
            border-zinc-200
            shadow-sm
            p-8
          "
        >

          <div className="flex items-center justify-between flex-wrap gap-6">

            <div>

              <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider">

                AI Interview Report

              </p>

              <h1 className="text-4xl font-bold text-zinc-900 mt-2">

                Candidate Evaluation

              </h1>

              <p className="text-zinc-500 mt-3">

                Comprehensive AI-powered interview analysis and hiring recommendation

              </p>

            </div>

            {/* SCORE */}

            <div
              className="
                w-36
                h-36
                rounded-full
                bg-gradient-to-br
                from-blue-600
                to-indigo-600
                flex
                items-center
                justify-center
                shadow-xl
              "
            >

              <div className="text-center">

                <h2 className="text-4xl font-bold text-white">

                  {candidate.score || 82}%

                </h2>

                <p className="text-blue-100 text-sm mt-1">

                  Overall Score

                </p>

              </div>

            </div>

          </div>

        </div>

        {/* ==========================================
            CANDIDATE INFO
        ========================================== */}

        <div
          className="
            bg-white
            rounded-[28px]
            border
            border-zinc-200
            shadow-sm
            p-8
          "
        >

          <div className="flex items-center justify-between mb-8">

            <div>

              <h2 className="text-2xl font-bold text-zinc-900">

                Candidate Information

              </h2>

              <p className="text-zinc-500 mt-1">

                Personal and interview details

              </p>

            </div>

            <span
              className={`
                px-5
                py-2
                rounded-full
                text-sm
                font-semibold
                capitalize

                ${
                  candidate.status === "completed"

                  ? "bg-green-100 text-green-700"

                  : candidate.status === "ongoing"

                  ? "bg-yellow-100 text-yellow-700"

                  : "bg-blue-100 text-blue-700"
                }
              `}
            >

              {candidate.status}

            </span>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

            {/* NAME */}

            <div className="bg-zinc-50 rounded-2xl p-5">

              <p className="text-zinc-500 text-sm">
                Full Name
              </p>

              <h3 className="text-lg font-bold text-zinc-900 mt-2">

                {candidate.candidate?.name}

              </h3>

            </div>

            {/* EMAIL */}

            <div className="bg-zinc-50 rounded-2xl p-5">

              <p className="text-zinc-500 text-sm">
                Email Address
              </p>

              <h3 className="text-lg font-bold text-zinc-900 mt-2">

                {candidate.candidate?.email}

              </h3>

            </div>

            {/* INTERVIEWER */}

            <div className="bg-zinc-50 rounded-2xl p-5">

              <p className="text-zinc-500 text-sm">
                Interviewer
              </p>

              <h3 className="text-lg font-bold text-zinc-900 mt-2">

                {candidate.interviewer?.name}

              </h3>

            </div>

            {/* DATE */}

            <div className="bg-zinc-50 rounded-2xl p-5">

              <p className="text-zinc-500 text-sm">
                Interview Date
              </p>

              <h3 className="text-lg font-bold text-zinc-900 mt-2">

                {
                  new Date(candidate.date)
                  .toLocaleDateString("en-IN")
                }

              </h3>

            </div>

            {/* ROOM ID */}

            <div className="bg-zinc-50 rounded-2xl p-5">

              <p className="text-zinc-500 text-sm">
                Room ID
              </p>

              <h3 className="text-lg font-bold text-zinc-900 mt-2">

                {candidate.roomId}

              </h3>

            </div>

            {/* RESULT */}

            <div className="bg-zinc-50 rounded-2xl p-5">

              <p className="text-zinc-500 text-sm">
                Result
              </p>

              <h3 className="text-lg font-bold text-zinc-900 mt-2 capitalize">

                {candidate.result || "Pending"}

              </h3>

            </div>

          </div>

        </div>

        {/* ==========================================
            FEEDBACK
        ========================================== */}

        <div
          className="
            bg-white
            rounded-[28px]
            border
            border-zinc-200
            shadow-sm
            p-8
          "
        >

          <div className="mb-8">

            <h2 className="text-2xl font-bold text-zinc-900">

              Interview Feedback

            </h2>

            <p className="text-zinc-500 mt-1">

              Interviewer feedback and AI analysis

            </p>

          </div>

          <div
            className="
              bg-zinc-50
              rounded-3xl
              p-7
            "
          >

            <p className="text-zinc-700 leading-relaxed text-lg">

              {
                candidate.feedback ||

                "Candidate demonstrated strong technical and communication skills."
              }

            </p>

          </div>

        </div>

        {/* ==========================================
            FINAL RECOMMENDATION
        ========================================== */}

        <div
          className="
            bg-gradient-to-r
            from-blue-600
            to-indigo-600
            rounded-[32px]
            shadow-xl
            p-10
            text-center
          "
        >

          <p className="text-blue-100 font-medium uppercase tracking-wider">

            Final Recommendation

          </p>

          <h2 className="text-5xl font-bold text-white mt-4 capitalize">

            {candidate.result || "Pending"}

          </h2>

          <p className="text-blue-100 text-lg mt-5 max-w-2xl mx-auto leading-relaxed">

            AI-powered interview evaluation generated from interview performance and interviewer feedback.

          </p>

        </div>

      </div>

    </div>
  );
}

export default CandidateReport;
