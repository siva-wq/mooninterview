import { useEffect, useState } from "react";

import API from "../../api/axios";

import socket from "../../socket";

import toast from "react-hot-toast"; 

function ReportsTable({ setSelectedCandidate }) {


  const [reports, setReports] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // ==========================================
  // FETCH REPORTS
  // ==========================================
  useEffect(() => {

    fetchReports();

  }, []);

  const fetchReports = async () => {

    try {

      setLoading(true);

      const res = await API.get(
        "/interviews"
      );

      // ONLY COMPLETED REPORTS
      const completedReports =
        res.data.filter(
          (item) =>
            item.status ===
            "completed"
        );

      setReports(completedReports);

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

    // NEW REPORT GENERATED
    socket.on(
      "report_updated",
      (updatedReport) => {

        setReports((prev) => {

          // CHECK EXISTING REPORT
          const exists =
            prev.find(
              (item) =>
                item._id ===
                updatedReport._id
            );

          // UPDATE EXISTING
          if (exists) {

            return prev.map((item) =>

              item._id ===
              updatedReport._id

                ? updatedReport

                : item
            );
          }

          // ADD NEW COMPLETED REPORT
          if (
            updatedReport.status ===
            "completed"
          ) {

            return [

              updatedReport,

              ...prev

            ];
          }

          return prev;
        });
      }
    );

    // INTERVIEW COMPLETED
    socket.on(
      "interview_ended",
      (data) => {

        setReports((prev) =>

          prev.map((item) =>

            item.roomId ===
            data.roomId

              ? {
                  ...item,
                  status: "completed"
                }

              : item
          )
        );
      }
    );

    // REPORT DELETED
    socket.on(
      "report_deleted",
      (id) => {

        setReports((prev) =>

          prev.filter(
            (item) =>
              item._id !== id
          )
        );
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
        "report_deleted"
      );
    };

  }, []);

  const updateResult = async (candidate,status) => {
  try {

    //console.log(candidate);
    //console.log(status);

    await API.post(
              "/result/setres",
              {
                roomId:candidate.roomId,
                status:status,
              }
            );
          fetchReports();
            

    await API.post(
          "/send",
          {
            name: candidate.candidate.name,
            email: candidate.candidate.email,
            date: candidate.date,
            time: candidate.time,
            roomId: candidate.roomId,
            type: status,
          }
        );

      
    

    toast.success("Mail sent successfully");
    

  } catch (error) {

    toast.error("Failed to send mail");

  }
};

  return (

    <div
      className="
        bg-white
        border
        border-zinc-200
        rounded-2xl
        overflow-hidden
        shadow-sm
      "
    >

      {/* LOADING */}

      {
        loading && (

          <div className="p-6 text-zinc-500">

            Loading reports...

          </div>
        )
      }

      {/* TABLE */}

      <table className="w-full">

        <thead className="bg-zinc-50">

          <tr>

            <th className="text-left p-4 text-zinc-600 font-semibold">
              Candidate
            </th>

            <th className="text-left p-4 text-zinc-600 font-semibold">
              Interviewer
            </th>

            <th className="text-left p-4 text-zinc-600 font-semibold">
              Score
            </th>

            <th className="text-left p-4 text-zinc-600 font-semibold">
              Status
            </th>

            <th className="text-left p-4 text-zinc-600 font-semibold">
              Result
            </th>


          </tr>

        </thead>

        <tbody>

          {
            !loading &&
            reports.length > 0 ? (

              reports.map((candidate) => (

                <tr
                  key={candidate._id}
                  
                  className="
                    border-t
                    border-zinc-100
                    hover:bg-zinc-50
                    cursor-pointer
                    transition-all
                    duration-300
                  "
                >

                  {/* CANDIDATE */}

                  <td className="p-4">

                    <div className="flex items-center gap-3">

                      <div
                        className="
                          w-10
                          h-10
                          rounded-full
                          bg-gradient-to-br
                          from-blue-500
                          to-indigo-500
                          flex
                          items-center
                          justify-center
                          text-white
                          font-bold
                        "
                      >

                        {
                          candidate.candidate?.name?.charAt(0)
                        }

                      </div>

                      <div>

                        <p className="font-semibold text-zinc-900">

                          {
                            candidate.candidate?.name
                          }

                        </p>

                        <p className="text-sm text-zinc-500">

                          {
                            candidate.candidate?.email
                          }

                        </p>

                      </div>

                    </div>

                  </td>

                  {/* INTERVIEWER */}

                  <td className="p-4 text-zinc-700">

                    {
                      candidate.interviewer?.name ||
                      "N/A"
                    }

                  </td>

                  {/* SCORE */}

                  <td className="p-4">

                    <span
                      className="
                        bg-blue-100
                        text-blue-700
                        px-4
                        py-1.5
                        rounded-full
                        text-sm
                        font-semibold
                      "
                    >

                      {
                        candidate.score || 82
                      }%

                    </span>

                  </td>

                  {/* STATUS */}

                  <td className="p-4">

                    <span
                      className={`
                        px-4
                        py-1.5
                        rounded-full
                        text-xs
                        font-semibold

                        ${
                          candidate.status ===
                          "completed"

                          ? "bg-green-100 text-green-700"

                          : candidate.status ===
                            "ongoing"

                          ? "bg-yellow-100 text-yellow-700"

                          : "bg-blue-100 text-blue-700"
                        }
                      `}
                    >

                      {
                        candidate.status
                      }

                    </span>

                  </td>

                  {/* RESULT */}

                  <td className="p-4">

                    <span
                      className={`
                        px-4
                        py-1.5
                        rounded-full
                        text-xs
                        font-semibold
                        capitalize

                        ${
                          candidate.result ===
                          "selected"

                          ? "bg-green-100 text-green-700"

                          : candidate.result ===
                            "rejected"

                          ? "bg-red-100 text-red-700"

                          : candidate.result === "pending"
                            ? "bg-gray-100 text-gray-700"
                            : "bg-gray-100 text-gray-700"

                        }
                      `}
                    >

                      {candidate.result === "pending" ? (
  <select
  value={candidate.result}
  onChange={(e) =>
    updateResult(
      candidate,
      e.target.value
    )
  }
>
  <option value="pending">Pending</option>
  <option value="selected">Selected</option>
  <option value="rejected">Rejected</option>
</select>
) : (
  <span>{candidate.result}</span>
)}

                    </span>

                  </td>

                  

                </tr>
              ))

            ) : (

              !loading && (

                <tr>

                  <td
                    colSpan="5"
                    className="
                      text-center
                      py-16
                      text-zinc-500
                    "
                  >

                    No reports found

                  </td>

                </tr>
              )
            )
          }

        </tbody>

      </table>

    </div>
  );
}

export default ReportsTable;
