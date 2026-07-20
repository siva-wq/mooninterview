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
        card
        border-custom
        rounded-2xl
        overflow-hidden
        shadow-sm
      "
    >

      <div className="overflow-x-auto">

      {/* LOADING */}

      {
        loading && (

          <div className="p-4 sm:p-6 text-secondary">

            Loading reports...

          </div>
        )
      }

      {/* TABLE */}

      <table className="w-full min-w-[600px]">

        <thead className="bg-zinc-50">

          <tr>

            <th className="text-left p-3 sm:p-4 text-secondary font-semibold text-sm sm:text-base">
              Candidate
            </th>

            <th className="text-left p-3 sm:p-4 text-secondary font-semibold text-sm sm:text-base">
              Interviewer
            </th>

            <th className="text-left p-3 sm:p-4 text-secondary font-semibold text-sm sm:text-base">
              Score
            </th>

            <th className="text-left p-3 sm:p-4 text-secondary font-semibold text-sm sm:text-base">
              Status
            </th>

            <th className="text-left p-3 sm:p-4 text-secondary font-semibold text-sm sm:text-base">
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
                    border-custom
                    hover:bg-zinc-50
                    cursor-pointer
                    transition-all
                    duration-300
                  "
                >

                  {/* CANDIDATE */}

                  <td className="p-3 sm:p-4">

                    <div className="flex items-center gap-3">

                      <div
                        className="
                          w-8 h-8 sm:w-10 sm:h-10
                          rounded-full
                          bg-gradient-to-br
                          from-navy
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

                        <p className="font-semibold text-navy text-sm sm:text-base">

                          {
                            candidate.candidate?.name
                          }

                        </p>

                        <p className="text-xs sm:text-sm text-secondary">

                          {
                            candidate.candidate?.email
                          }

                        </p>

                      </div>

                    </div>

                  </td>

                  {/* INTERVIEWER */}

                  <td className="p-3 sm:p-4 text-navy text-sm sm:text-base">

                    {
                      candidate.interviewer?.name ||
                      "N/A"
                    }

                  </td>

                  {/* SCORE */}

                  <td className="p-3 sm:p-4">

                    <span
                      className="
                        bg-blue-100
                        text-navy
                        px-3 sm:px-4
                        py-1.5
                        rounded-full
                        text-xs sm:text-sm
                        font-semibold
                      "
                    >

                      {
                        candidate.score || 82
                      }%

                    </span>

                  </td>

                  {/* STATUS */}

                  <td className="p-3 sm:p-4">

                    <span
                      className={`
                        px-3 sm:px-4
                        py-1.5
                        rounded-full
                        text-xs sm:text-sm
                        font-semibold

                        ${
                          candidate.status ===
                          "completed"

                          ? "bg-green-100 text-success"

                          : candidate.status ===
                            "ongoing"

                          ? "bg-yellow-100 text-warning"

                          : "bg-blue-100 text-primary"
                        }
                      `}
                    >

                      {
                        candidate.status
                      }

                    </span>

                  </td>

                  {/* RESULT */}

                  <td className="p-3 sm:p-4">

                    <span
                      className={`
                        px-3 sm:px-4
                        py-1.5
                        rounded-full
                        text-xs sm:text-sm
                        font-semibold
                        capitalize

                        ${
                          candidate.result ===
                          "selected"

                          ? "bg-green-100 text-success"

                          : candidate.result ===
                            "rejected"

                          ? "bg-red-100 text-danger"

                          : candidate.result === "pending"
                            ? "bg-gray-100 text-primary"
                            : "bg-gray-100 text-primary"

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
                      py-12 sm:py-16
                      text-secondary
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

    </div>
  );
}

export default ReportsTable;