import { useEffect, useState } from "react";

import CandidateTable from "../components/interview/CandidateTable";

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

      // waiting
      const waiting =
        interviews.filter(
          (item) =>
            item.status === "waiting"
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

        waiting,

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

    <div className="flex min-h-screen bg-background text-primary">

      {/* MAIN CONTENT */}

      <div className="flex-1">

      

        {/* PAGE CONTENT */}

        <div className="px-4 py-5 sm:px-6 lg:px-8">

          {/* PAGE HEADER */}

          <div className="mb-8">

            <h1 className="text-2xl sm:text-3xl font-bold text-navy">

              Schedule Interview

            </h1>

            <p className="text-sm sm:text-base text-secondary mt-2">

              Create and manage technical interviews

            </p>

          </div>

          {/* LOADING */}

          {
            loading && (

              <div
                className="
                  card
                  p-5
                  rounded-2xl
                  shadow-sm
                  mb-6
                "
              >

                <p className="text-secondary">

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
              gap-4 sm:gap-6
              mb-6 sm:mb-8
            "
          >

            <DashboardCard
              title="Candidates"
              value={
                stats?.totalCandidates || 0
              }
              //increase="+12%"
            />

            <DashboardCard
              title="Scheduled"
              value={
                stats?.scheduled || 0
              }
              //increase="+8%"
            />

            <DashboardCard
              title="Completed"
              value={
                stats?.completed || 0
              }
              //increase="+18%"
            />

            <DashboardCard
              title="waiting"
              value={
                stats?.waiting || 0
              }
              //increase="+5%"
            />

            <DashboardCard
              title="Live Interviews"
              value={
                stats?.ongoing || 0
              }
              //increase="+3%"
            />

          </div>

          {/* CANDIDATE TABLE */}

          <div
            className="
              card
              border
              border-custom
              rounded-3xl
              shadow-sm
              p-6
            "
          >

            {/* HEADER */}

            <div className="mb-6">

              <h2 className="text-2xl font-bold text-navy">

                Candidate Management

              </h2>

              <p className="text-secondary mt-1">

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