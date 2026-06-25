import { useEffect, useState } from "react";
import {
  CalendarDays,
  Video,
  User,
  BadgeCheck,
} from "lucide-react";

import API from "../../api/axios";
import socket from "../../socket";

function RecentInterviews() {
  const [interviews, setInterviews] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

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
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    socket.connect();

    socket.on(
      "new_interview_created",
      (newInterview) => {
        setInterviews((prev) => [
          newInterview,
          ...prev,
        ]);
      }
    );

    socket.on(
      "interview_started",
      ({ roomId }) => {
        setInterviews((prev) =>
          prev.map((item) =>
            item.roomId === roomId
              ? {
                  ...item,
                  status: "ongoing",
                }
              : item
          )
        );
      }
    );

    socket.on(
      "interview_ended",
      ({ roomId }) => {
        setInterviews((prev) =>
          prev.map((item) =>
            item.roomId === roomId
              ? {
                  ...item,
                  status: "completed",
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

  const formatDate = (date) =>
    new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );

  const getStatusColor = (
    status
  ) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 border border-green-200";

      case "ongoing":
        return "bg-yellow-100 text-yellow-700 border border-yellow-200";

      case "scheduled":
        return "bg-blue-100 text-blue-700 border border-blue-200";

      default:
        return "bg-gray-100 text-gray-600 border border-gray-200";
    }
  };

  const completedCount =
    interviews.filter(
      (item) =>
        item.status ===
        "completed"
    ).length;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900">
            <Video
              size={20}
              className="text-blue-600"
            />
            Recent Interviews
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Total Interviews:{" "}
            {interviews.length}
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-green-50 border border-green-100">
          <span className="font-semibold text-green-600">
            {completedCount}
          </span>

          <span className="ml-1 text-sm text-gray-500">
            Completed
          </span>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map(
            (item) => (
              <div
                key={item}
                className="h-24 rounded-xl bg-gray-100 animate-pulse"
              />
            )
          )}
        </div>
      )}

      {/* Empty */}
      {!loading &&
        interviews.length ===
          0 && (
          <div className="py-12 text-center">
            <Video
              size={50}
              className="mx-auto text-gray-300"
            />

            <h3 className="mt-4 text-lg font-medium text-gray-800">
              No Interviews Found
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Scheduled
              interviews will
              appear here.
            </p>
          </div>
        )}

      {/* List */}
      {!loading &&
        interviews.length >
          0 && (
          <div className="space-y-4 max-h-[550px] overflow-y-auto pr-2">
            {interviews.map(
              (item) => (
                <div
                  key={item._id}
                  className="
                    bg-white
                    border
                    border-gray-200
                    rounded-xl
                    p-5
                    shadow-sm
                    hover:shadow-md
                    hover:border-blue-300
                    transition-all
                  "
                >
                  <div className="flex justify-between items-start">
                    {/* Candidate Info */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-lg">
                        {item
                          .candidate?.name?.charAt(
                            0
                          )
                          ?.toUpperCase() ||
                          "C"}
                      </div>

                      <div>
                        <h3 className="text-gray-900 font-semibold text-lg">
                          {
                            item
                              .candidate
                              ?.name
                          }
                        </h3>

                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <User
                            size={
                              14
                            }
                          />
                          Interviewer:
                          {
                            item
                              .interviewer
                              ?.name
                          }
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {
                        item.status
                      }
                    </span>
                  </div>

                  {/* Footer */}
                  <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <CalendarDays
                        size={
                          14
                        }
                      />
                      {formatDate(
                        item.date
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <BadgeCheck
                        size={
                          14
                        }
                      />
                      Room ID:
                      {" "}
                      {item.roomId?.slice(
                        0,
                        8
                      )}
                      ...
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}
    </div>
  );
}

export default RecentInterviews;