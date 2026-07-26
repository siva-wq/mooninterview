import { useEffect, useState } from "react";

import DashboardCard from "../components/dashboard/DashboardCard";
import RecentInterviews from "../components/dashboard/RecentInterviews";
import Candidates from "../components/dashboard/Candidates";

import API from "../api/axios";

import socket from "../socket";

function Admin() {

  const [cards, setCards] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  // ==========================================
  // FETCH DASHBOARD CARDS
  // ==========================================
  useEffect(() => {

    fetchDashboardCards();

  }, []);

  const fetchDashboardCards = async () => {

    try {

      setLoading(true);

      const usersRes =
        await API.get("/users/cards");

      const interviewsRes =
        await API.get("/interviews");

      const interviews =
        interviewsRes.data;

      // COMPLETED
      const completed =
        interviews.filter(
          (item) =>
            item.status === "completed"
        );

      // SELECTED
      const selected =
        completed.filter(
          (item) =>
            item.result === "selected"
        );

      // REJECTED
      const rejected =
        completed.filter(
          (item) =>
            item.result === "rejected"
        );

      setCards({

        ...usersRes.data,

        totalInterviews:
          interviews.length,

        scheduled:
          interviews.filter(
            (item) =>
              item.status === "scheduled"
          ).length,

        ongoing:
          interviews.filter(
            (item) =>
              item.status === "ongoing"
          ).length,

        completed:
          completed.length,

        selected:
          selected.length,

        rejected:
          rejected.length,
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

    // NEW INTERVIEW
    socket.on(
      "new_interview_created",
      () => {

        fetchDashboardCards();
      }
    );

    // INTERVIEW STARTED
    socket.on(
      "interview_started",
      () => {

        fetchDashboardCards();
      }
    );

    // INTERVIEW ENDED
    socket.on(
      "interview_ended",
      () => {

        fetchDashboardCards();
      }
    );

    // NEW CANDIDATE
    socket.on(
      "new_candidate",
      () => {

        fetchDashboardCards();
      }
    );

    // REPORT UPDATED
    socket.on(
      "report_updated",
      () => {

        fetchDashboardCards();
      }
    );

    // INTERVIEW DELETED
    socket.on(
      "interview_deleted",
      () => {

        fetchDashboardCards();
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

    <>

      {/* PAGE HEADER */}

      <div className="mb-8">

        <h1 className="text-2xl sm:text-3xl font-bold text-navy">

          Dashboard Overview

        </h1>

        <p className="text-secondary mt-1">

          Monitor interviews, candidates, and reports in real-time.

        </p>

      </div>

      {/* LOADING */}

      {
        loading && (

          <div className="card p-6 mb-6">

            <p className="text-secondary">

              Loading dashboard...

            </p>

          </div>
        )
      }

      {/* STATS CARDS */}

      <div className="grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-5
              gap-4 sm:gap-6
              mb-6 sm:mb-8">

        <DashboardCard
          title="Total Interviews"
          value={
            cards?.totalInterviews || 0
          }
          //increase="+12%"
        />

        <DashboardCard
          title="Scheduled"
          value={
            cards?.scheduled || 0
          }
         // increase="+5%"
        />

        <DashboardCard
          title="Ongoing"
          value={
            cards?.ongoing || 0
          }
         // increase="+7%"
        />

        <DashboardCard
          title="Completed"
          value={
            cards?.completed || 0
          }
          //increase="+18%"
        />

        <DashboardCard
          title="Selected Candidates"
          value={
            cards?.selected || 0
          }
         // increase="+12%"
        />


      </div>

      {/* BOTTOM SECTION */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">

        <RecentInterviews />

        <Candidates />

      </div>

    </>
  );
}

export default Admin;