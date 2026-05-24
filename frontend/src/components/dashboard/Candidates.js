import { useEffect, useState } from "react";

import API from "../../api/axios";

import socket from "../../socket";
function Candidates() {

  const [candidates, setCandidates] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // ==========================================
  // FETCH CANDIDATES
  // ==========================================
  useEffect(() => {

    fetchCandidates();

  }, []);

  const fetchCandidates = async () => {

    try {

      setLoading(true);

      const res = await API.get("https://mooninterview.onrender.com/api/users");

      // FILTER ONLY CANDIDATES
      const filteredCandidates =
        res.data.filter(
          (user) =>
            user.role === "candidate"
        );

      setCandidates(filteredCandidates);

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

    // NEW CANDIDATE ADDED
    socket.on(
      "new_candidate",
      (candidate) => {

        setCandidates((prev) => [

          candidate,

          ...prev

        ]);
      }
    );

    // CANDIDATE STATUS UPDATE
    socket.on(
      "candidate_ready_status",
      (data) => {

        setCandidates((prev) =>

          prev.map((candidate) =>

            candidate._id ===
            data.candidateId

              ? {
                  ...candidate,
                  ready: data.ready
                }

              : candidate
          )
        );
      }
    );

    return () => {

      socket.off("new_candidate");

      socket.off(
        "candidate_ready_status"
      );
    };

  }, []);

  return (

    <div className="bg-zinc-900 p-5 rounded-2xl">

      <h2 className="text-white text-xl font-semibold mb-4">

        Recent Candidates

      </h2>

      {/* LOADING */}

      {
        loading && (

          <p className="text-zinc-400">

            Loading candidates...

          </p>
        )
      }

      {/* CANDIDATES */}

      <div className="space-y-3">

        {
          !loading &&
          candidates.length > 0 ? (

            candidates.map(
              (candidate) => (

                <div
                  key={candidate._id}
                  className="bg-zinc-800 p-4 rounded-xl flex items-center justify-between"
                >

                  {/* LEFT */}

                  <div className="flex items-center gap-3">

                    <img
                      src={`https://ui-avatars.com/api/?name=${candidate.name}`}
                      alt="candidate"
                      className="w-10 h-10 rounded-full"
                    />

                    <div>

                      <h3 className="text-white font-medium">

                        {candidate.name}

                      </h3>

                      <p className="text-zinc-400 text-sm">

                        {candidate.email}

                      </p>

                    </div>

                  </div>

                  {/* RIGHT */}

                  <div className="flex items-center gap-2">

                    {/* READY STATUS */}

                    {
                      candidate.ready && (

                        <span className="bg-blue-500/20 text-blue-400 text-xs px-3 py-1 rounded-full">

                          Ready

                        </span>
                      )
                    }

                    {/* ROLE */}

                    <span className="bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full capitalize">

                      {candidate.role}

                    </span>

                  </div>

                </div>
              )
            )

          ) : (

            !loading && (

              <p className="text-zinc-400">

                No candidates found

              </p>
            )
          )
        }

      </div>

    </div>
  );
}

export default Candidates;
