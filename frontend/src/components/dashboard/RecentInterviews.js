import { useEffect, useState } from "react";

import API from "../../api/axios";

import socket from "../../socket";

function RecentInterviews() {

  const [interviews, setInterviews] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

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
        "http://localhost:5000/api/interviews"
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

    // NEW INTERVIEW
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

            item.roomId === data.roomId

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

            item.roomId === data.roomId

              ? {
                  ...item,
                  status: "completed"
                }

              : item
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
    };

  }, []);

  // ==========================================
  // FORMAT DATE
  // ==========================================
  const formatDate = (date) => {

    return new Date(date)
      .toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
      });
  };

  return (

    <div className="bg-white p-5 rounded-2xl">

      <h2 className="text-black text-xl font-semibold mb-4">

        Recent Interviews

      </h2>

      {/* LOADING */}

      {
        loading && (

          <p className="text-zinc-400">

            Loading interviews...

          </p>
        )
      }

      {/* INTERVIEW LIST */}

      <div className="space-y-4">

        {
          !loading &&
          interviews.length > 0 ? (

            interviews.map((item) => (

              <div
                key={item._id}
                className="bg-zinc-800 p-4 rounded-xl hover:bg-zinc-700 transition"
              >

                <div className="flex items-center justify-between">

                  {/* LEFT */}

                  <div>

                    <h3 className="text-black font-medium text-lg">

                      {
                        item.candidate?.name ||
                        "Candidate"
                      }

                    </h3>

                    <p className="text-gray-400 text-sm mt-1">

                      Interviewer:
                      {" "}
                      {
                        item.interviewer?.name ||
                        "N/A"
                      }

                    </p>

                  </div>

                  {/* STATUS */}

                  <span
                    className={`text-xs px-3 py-1 rounded-full capitalize

                    ${
                      item.status ===
                      "completed"

                        ? "bg-green-500/20 text-green-400"

                        : item.status ===
                          "scheduled"

                        ? "bg-blue-500/20 text-blue-400"

                        : item.status ===
                          "ongoing"

                        ? "bg-yellow-500/20 text-yellow-400"

                        : "bg-zinc-500/20 text-zinc-400"
                    }
                  `}
                  >

                    {item.status}

                  </span>

                </div>

                {/* BOTTOM */}

                <div className="mt-4 flex items-center justify-between">

                  <p className="text-blue-400 text-sm">

                    {formatDate(item.date)}

                  </p>

                  <p className="text-zinc-400 text-xs">

                    Room:
                    {" "}
                    {item.roomId}

                  </p>

                </div>

              </div>
            ))

          ) : (

            !loading && (

              <p className="text-zinc-400">

                No interviews found

              </p>
            )
          )
        }

      </div>

    </div>
  );
}

export default RecentInterviews;