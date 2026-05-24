import { useEffect, useState } from 'react';

import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';

import DashboardCard from '../components/dashboard/DashboardCard';

import ReportsTable from '../components/reports/ReportsTable';
import AIEvalution from '../components/reports/AIEvalution';
import CandidateReport from '../components/reports/CandidateReport';

import API from '../api/axios';

import socket from '../socket';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend
} from 'recharts';

function Reports() {

  // ==========================================
  // STATES
  // ==========================================
  const [selectedCandidate, setSelectedCandidate] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [performanceData, setPerformanceData] =
    useState([]);

  const [statusData, setStatusData] =
    useState([]);

  const [weeklyData, setWeeklyData] =
    useState([]);

  const [cards, setCards] =
    useState(null);

  const COLORS = [
    '#3B82F6',
    '#EF4444',
    '#F59E0B'
  ];

  // ==========================================
  // FETCH REPORTS DATA
  // ==========================================
  useEffect(() => {

    fetchReportsData();

  }, []);

  const fetchReportsData = async () => {

    try {

      setLoading(true);

      const res = await API.get(
        "/interviews"
      );

      const interviews =
        res.data;

      // ======================================
      // COMPLETED INTERVIEWS ONLY
      // ======================================

      const completed =
        interviews.filter(
          (item) =>
            item.status === "completed"
        );

      // ======================================
      // PERFORMANCE DATA
      // ======================================

      const performance =
        completed.map((item) => ({

          name:
            item.candidate?.name || "Unknown",

          score:
            item.score || 80
        }));

      setPerformanceData(performance);

      // ======================================
      // STATUS DATA
      // ======================================

      const selected =
        completed.filter(
          (item) =>
            item.result === "selected"
        ).length;

      const rejected =
        completed.filter(
          (item) =>
            item.result === "rejected"
        ).length;

      const pending =
        completed.filter(
          (item) =>
            !item.result
        ).length;

      setStatusData([
        {
          name: 'Selected',
          value: selected
        },
        {
          name: 'Rejected',
          value: rejected
        },
        {
          name: 'Pending',
          value: pending
        }
      ]);

      // ======================================
      // WEEKLY TREND
      // ======================================

      const days = [
        'Sun',
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat'
      ];

      const weeklyMap = {};

      days.forEach((day) => {

        weeklyMap[day] = 0;
      });

      interviews.forEach((item) => {

        const day =
          days[
            new Date(item.date).getDay()
          ];

        weeklyMap[day]++;
      });

      const weekly =
        Object.keys(weeklyMap).map(
          (day) => ({

            day,

            interviews:
              weeklyMap[day]
          })
        );

      setWeeklyData(weekly);

      // ======================================
      // AVG SCORE
      // ======================================

      const totalScore =
        completed.reduce(
          (acc, item) =>
            acc + (item.score || 80),
          0
        );

      const avgScore =
        completed.length > 0

          ? Math.round(
              totalScore /
              completed.length
            )

          : 0;

      // ======================================
      // WEEK INTERVIEWS
      // ======================================

      const currentWeek =
        new Date();

      const weekInterviews =
        interviews.filter((item) => {

          const interviewDate =
            new Date(item.date);

          const diff =
            currentWeek - interviewDate;

          const daysDiff =
            diff / (
              1000 * 60 * 60 * 24
            );

          return daysDiff <= 7;
        }).length;

      // ======================================
      // CARDS
      // ======================================

      setCards({

        totalInterviews:
          interviews.length,

        rejected,

        selected,

        avgScore,

        weekInterviews
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

    // REPORT UPDATED
    socket.on(
      "report_updated",
      () => {

        fetchReportsData();
      }
    );

    // INTERVIEW ENDED
    socket.on(
      "interview_ended",
      () => {

        fetchReportsData();
      }
    );

    // NEW INTERVIEW
    socket.on(
      "new_interview_created",
      () => {

        fetchReportsData();
      }
    );

    // INTERVIEW DELETED
    socket.on(
      "report_deleted",
      () => {

        fetchReportsData();
      }
    );

    return () => {

      socket.off(
        "report_updated"
      );

      socket.off(
        "interview_ended"
      );

      socket.off(
        "new_interview_created"
      );

      socket.off(
        "report_deleted"
      );
    };

  }, []);

  return (

    <div className="flex min-h-screen bg-white text-black">

      {/* SIDEBAR */}

      <Sidebar />

      {/* MAIN */}

      <div className="flex-1">

        {/* NAVBAR */}

        <Navbar />

        <div className="p-6">

          {/* LOADING */}

          {
            loading && (

              <div className="bg-white p-6 rounded-2xl mb-6">

                <p className="text-zinc-500">

                  Loading reports...

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
              title="Total Interviews"
              value={
                cards?.totalInterviews || 0
              }
              increase="+12%"
            />

            <DashboardCard
              title="Rejected"
              value={
                cards?.rejected || 0
              }
              increase="+5%"
            />

            <DashboardCard
              title="Selected"
              value={
                cards?.selected || 0
              }
              increase="+18%"
            />

            <DashboardCard
              title="Avg Score"
              value={`${cards?.avgScore || 0}%`}
              increase="+9%"
            />

            <DashboardCard
              title="Week Interviews"
              value={
                cards?.weekInterviews || 0
              }
              increase="+11%"
            />

          </div>

          {/* CHARTS */}

          <div
            className="
              grid
              grid-cols-1
              lg:grid-cols-3
              gap-6
              mb-8
            "
          >

            {/* BAR CHART */}

            <div
              className="
                bg-white
                rounded-2xl
                p-5
                border
                border-zinc-200
                shadow-sm
              "
            >

              <h2 className="text-lg font-semibold mb-4">

                Candidate Performance

              </h2>

              <div className="w-full h-[300px]">

                <ResponsiveContainer>

                  <BarChart data={performanceData}>

                    <CartesianGrid
                      strokeDasharray="3 3"
                    />

                    <XAxis dataKey="name" />

                    <YAxis />

                    <Tooltip />

                    <Legend />

                    <Bar
                      dataKey="score"
                      fill="#3B82F6"
                      radius={[10, 10, 0, 0]}
                    />

                  </BarChart>

                </ResponsiveContainer>

              </div>

            </div>

            {/* PIE CHART */}

            <div
              className="
                bg-white
                rounded-2xl
                p-5
                border
                border-zinc-200
                shadow-sm
              "
            >

              <h2 className="text-lg font-semibold mb-4">

                Interview Status

              </h2>

              <div className="w-full h-[300px]">

                <ResponsiveContainer>

                  <PieChart>

                    <Pie
                      data={statusData}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >

                      {
                        statusData.map(
                          (entry, index) => (

                            <Cell
                              key={index}
                              fill={COLORS[index]}
                            />
                          )
                        )
                      }

                    </Pie>

                    <Tooltip />

                    <Legend />

                  </PieChart>

                </ResponsiveContainer>

              </div>

            </div>

            {/* LINE CHART */}

            <div
              className="
                bg-white
                rounded-2xl
                p-5
                border
                border-zinc-200
                shadow-sm
              "
            >

              <h2 className="text-lg font-semibold mb-4">

                Weekly Trend

              </h2>

              <div className="w-full h-[300px]">

                <ResponsiveContainer>

                  <LineChart data={weeklyData}>

                    <CartesianGrid
                      strokeDasharray="3 3"
                    />

                    <XAxis dataKey="day" />

                    <YAxis />

                    <Tooltip />

                    <Legend />

                    <Line
                      type="monotone"
                      dataKey="interviews"
                      stroke="#3B82F6"
                      strokeWidth={3}
                    />

                  </LineChart>

                </ResponsiveContainer>

              </div>

            </div>

          </div>

          {/* REPORTS TABLE */}

          <div className="mb-8">

            <ReportsTable
              setSelectedCandidate={
                setSelectedCandidate
              }
            />

          </div>

          {/* AI EVALUATION */}

          <AIEvalution />

        </div>

      </div>

      {/* REPORT MODAL */}

      {
        selectedCandidate && (

          <div
            className="
              fixed
              inset-0
              bg-black/70
              backdrop-blur-sm
              flex
              items-center
              justify-center
              z-50
              p-4
            "
          >

            <div
              className="
                relative
                w-full
                max-w-6xl
                max-h-[95vh]
                overflow-y-auto
                bg-white
                rounded-2xl
              "
            >

              {/* CLOSE */}

              <button
                onClick={() =>
                  setSelectedCandidate(null)
                }
                className="
                  absolute
                  top-4
                  right-4
                  w-10
                  h-10
                  rounded-full
                  bg-zinc-100
                  hover:bg-zinc-200
                  text-xl
                  z-10
                "
              >

                ✕

              </button>

              {/* REPORT */}

              <CandidateReport
                candidate={selectedCandidate}
              />

            </div>

          </div>
        )
      }

    </div>
  );
}

export default Reports;