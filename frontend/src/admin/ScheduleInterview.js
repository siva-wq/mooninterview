import { useEffect, useState } from "react";

import CandidateTable from "../components/interview/CandidateTable";

import Sidebar from "../components/common/Sidebar";
import Navbar from "../components/common/Navbar";

import DashboardCard from "../components/dashboard/DashboardCard";

import API from "../api/axios";

import socket from "../socket";

function ScheduleInterview() {

  const [stats, setStats] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  // ==========================================
  // FETCH INTERVIEW STATS
  // ==========================================
  useEffect(() => {

    fetchStats();

  }, []);

  const fetchStats = async () => {

    try {

      setLoading(true);

      const usersRes =
        await API.get("/users");

      const interviewsRes =
        await API.get("/interviews");

      const users =
        usersRes.data;

      const interviews =
        interviewsRes.data;

      // CANDIDATES
      const totalCandidates =
        users.filter(
          (user) =>
            user.role === "candidate"
        ).length;

      // SCHEDULED
      const scheduled =
        interviews.filter(
          (item) =>
            item.status === "scheduled"
        ).length;

      // COMPLETED
      const completed =
        interviews.filter(
          (item) =>
            item.status === "completed"
        ).length;

      // PENDING
      const pending =
        interviews.filter(
          (item) =>
            item.status === "pending"
        ).length;

      // LIVE
      const ongoing =
        interviews.filter(
          (item) =>
            item.status === "ongoing"
        ).length;

      setStats({

        totalCandidates,

        scheduled,

        completed,

        pending,

        ongoing
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

        fetchStats();
      }
    );

    // INTERVIEW STARTED
    socket.on(
      "interview_started",
      () => {

        fetchStats();
      }
    );

    // INTERVIEW ENDED
    socket.on(
      "interview_ended",
      () => {

        fetchStats();
      }
    );

    // NEW CANDIDATE
    socket.on(
      "new_candidate",
      () => {

        fetchStats();
      }
    );

    // REPORT UPDATED
    socket.on(
      "report_updated",
      () => {

        fetchStats();
      }
    );

    // INTERVIEW DELETED
    socket.on(
      "interview_deleted",
      () => {

        fetchStats();
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
        "new_candidate"
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

    <div className="flex min-h-screen bg-[#F5F7FB] text-black">

      {/* SIDEBAR */}

      <Sidebar />

      {/* MAIN CONTENT */}

      <div className="flex-1">

        {/* NAVBAR */}

        <Navbar />

        {/* PAGE CONTENT */}

        <div className="p-6">

          {/* PAGE HEADER */}

          <div className="mb-8">

            <h1 className="text-3xl font-bold text-zinc-900">

              Schedule Interview

            </h1>

            <p className="text-zinc-500 mt-2">

              Create and manage technical interviews

            </p>

          </div>

          {/* LOADING */}

          {
            loading && (

              <div
                className="
                  bg-white
                  p-5
                  rounded-2xl
                  shadow-sm
                  mb-6
                "
              >

                <p className="text-zinc-500">

                  Loading interview data...

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
              lg:grid-cols-5
              gap-6
              mb-8
            "
          >

            <DashboardCard
              title="Candidates"
              value={
                stats?.totalCandidates || 0
              }
              increase="+12%"
            />

            <DashboardCard
              title="Scheduled"
              value={
                stats?.scheduled || 0
              }
              increase="+8%"
            />

            <DashboardCard
              title="Completed"
              value={
                stats?.completed || 0
              }
              increase="+18%"
            />

            <DashboardCard
              title="Pending"
              value={
                stats?.pending || 0
              }
              increase="+5%"
            />

            <DashboardCard
              title="Live Interviews"
              value={
                stats?.ongoing || 0
              }
              increase="+3%"
            />

          </div>

          {/* CANDIDATE TABLE */}

          <div
            className="
              bg-white
              border
              border-zinc-200
              rounded-3xl
              shadow-sm
              p-6
            "
          >

            {/* HEADER */}

            <div className="mb-6">

              <h2 className="text-2xl font-bold text-zinc-900">

                Candidate Management

              </h2>

              <p className="text-zinc-500 mt-1">

                Select candidates and schedule interviews

              </p>

            </div>

            {/* TABLE */}

            <div className="space-y-6">

              <CandidateTable />

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ScheduleInterview;