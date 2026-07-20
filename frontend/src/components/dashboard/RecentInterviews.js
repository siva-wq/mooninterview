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
    <div className="card border-custom rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-semibold text-navy">
            <Video
              size={20}
              className="text-gold"
            />
            Recent Interviews
          </h2>

          <p className="text-sm text-secondary mt-1">
            Total Interviews:{" "}
            {interviews.length}
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-green-50 border border-green-100">
          <span className="font-semibold text-green-600">
            {completedCount}
          </span>

          <span className="ml-1 text-sm text-secondary">
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
              className="mx-auto text-gold"
            />

            <h3 className="mt-4 text-lg font-medium text-navy">
              No Interviews Found
            </h3>

            <p className="mt-1 text-sm text-secondary">
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
          <div className="space-y-4 max-h-[400px] sm:max-h-[550px] overflow-y-auto pr-2">
            {interviews.map(
              (item) => (
                <div
                  key={item._id}
                  className="
                    card
                    border-custom
                    rounded-xl
                    p-5
                    shadow-sm
                    hover:shadow-md
                    hover:border-primary
                    transition-all
                  "
                >
                  <div className="flex justify-between items-start">
                    {/* Candidate Info */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-blue-100 text-navy flex items-center justify-center font-semibold text-lg">
                        {item
                          .candidate?.name?.charAt(
                            0
                          )
                          ?.toUpperCase() ||
                          "C"}
                      </div>

                      <div>
                        <h3 className="text-navy font-semibold text-lg">
                          {
                            item
                              .candidate
                              ?.name
                          }
                        </h3>

                        <div className="flex items-center gap-2 text-sm text-navy mt-1">
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
                  <div className="mt-5 pt-4 border-t border-custom flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-navy">
                      <CalendarDays
                        size={
                          14
                        }
                      />
                      {formatDate(
                        item.date
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-navy">
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