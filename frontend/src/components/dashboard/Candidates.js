import { useEffect, useState } from "react";
import {
  Users,
  Mail,
  CheckCircle,
  UserCircle,
} from "lucide-react";

import API from "../../api/axios";
import socket from "../../socket";

function Candidates() {
  const [candidates, setCandidates] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // =====================================
  // FETCH CANDIDATES
  // =====================================
  const fetchCandidates = async () => {
    try {
      setLoading(true);

      const res = await API.get(
        "/users"
      );

      const filteredCandidates =
        res.data.filter(
          (user) =>
            user.role ===
            "candidate"
        );
        console.log(filteredCandidates)

      setCandidates(
        filteredCandidates
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  // =====================================
  // SOCKET EVENTS
  // =====================================
  useEffect(() => {
    socket.connect();

    socket.on(
      "new_candidate",
      (candidate) => {
        setCandidates((prev) => [
          candidate,
          ...prev,
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
                  ready:
                    data.ready,
                }
              : candidate
          )
        );
      }
    );

    return () => {
      socket.off(
        "new_candidate"
      );
      socket.off(
        "candidate_ready_status"
      );
    };
  }, []);

  const readyCount =
    candidates.filter(
      (candidate) =>
        candidate.ready
    ).length;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900">
            <Users
              size={22}
              className="text-blue-600"
            />
            Candidates
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Total Candidates:{" "}
            {candidates.length}
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-green-50 border border-green-100">
          <span className="font-semibold text-green-600">
            {readyCount}
          </span>

          <span className="ml-1 text-sm text-gray-500">
            Ready
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

      {/* Empty State */}
      {!loading &&
        candidates.length ===
          0 && (
          <div className="text-center py-12">
            <UserCircle
              size={55}
              className="mx-auto text-gray-300"
            />

            <h3 className="mt-4 text-lg font-medium text-gray-800">
              No Candidates Found
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Candidates will
              appear here after
              registration.
            </p>
          </div>
        )}

      {/* Candidate List */}
      {!loading &&
        candidates.length >
          0 && (
          <div className="space-y-4 max-h-[550px] overflow-y-auto pr-2">
            {candidates.map(
              (candidate) => (
                <div
                  key={
                    candidate._id
                  }
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
                  <div className="flex items-center justify-between">
                    {/* Left Side */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-lg">
                        {candidate.name
                          ?.charAt(
                            0
                          )
                          ?.toUpperCase()}
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {
                            candidate.name
                          }
                        </h3>

                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                          <Mail
                            size={
                              14
                            }
                          />
                          {
                            candidate.email
                          }
                        </div>
                      </div>
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-2">

                      <span className="px-3 py-1 rounded-full text-xs font-medium capitalize bg-green-100 text-green-700 border border-green-200">
                        {
                          candidate.role
                        }
                      </span>
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

export default Candidates;