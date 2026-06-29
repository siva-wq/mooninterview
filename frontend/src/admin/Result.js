import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import API from "../api/axios";

function Result() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [candidate, setCandidate] = useState(null);
  const [resume, setResume] = useState("");
  const [status, setStatus] = useState("selected");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const res = await API.get(
          `/room/${roomId}`
        );

        //console.log(res.data);

        setInterview(res.data);
        setCandidate(
          res.data.candidate
        );
        setResume(
          res.data.resume
        );

      } catch (error) {

        console.error(error);

        toast.error(
          "Failed to load interview details"
        );

      } finally {

        setLoading(false);

      }
    };

    fetchInterview();
  }, [roomId]);

  const handleFinalize =
    async () => {

      try {

        setSubmitting(true);

        // Save Result

        await API.post(
          "/result/setres",
          {
            roomId,
            status,
          }
        );

        // Send Email

        await API.post(
          "/send",
          {
            name: candidate.name,
            email: candidate.email,
            date: interview.date,
            time: interview.time,
            roomId,
            type: status,
          }
        );

        toast.success(
          "Result finalized and email sent successfully"
        );

        navigate("/admin");

      } catch (error) {

        console.error(error);

        toast.error(
          "Failed to finalize result"
        );

      } finally {

        setSubmitting(false);

      }
    };

  if (loading) {
    return (
      <div className="
        min-h-screen
        flex
        items-center
        justify-center
      ">
        <p className="text-lg">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="
      min-h-screen
      bg-slate-100
      p-6
    ">

      {/* Header */}

      <div className="
        flex
        justify-between
        items-center
        mb-6
      ">
        <h1 className="
          text-3xl
          font-bold
          text-slate-800
        ">
          Interview Result
        </h1>
      </div>

      <div className="
        grid
        grid-cols-1
        lg:grid-cols-3
        gap-6
      ">

        {/* Resume Section */}

        <div className="
          lg:col-span-2
        ">
          <div className="
            bg-white
            rounded-2xl
            shadow-md
            overflow-hidden
            h-[800px]
          ">
            {resume ? (
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <Viewer
                  fileUrl={resume}
                />
              </Worker>
            ) : (
              <div className="
                h-full
                flex
                items-center
                justify-center
              ">
                <p>
                  Resume not available
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Candidate Details */}

        <div>
          <div className="
            bg-white
            rounded-2xl
            shadow-md
            p-6
          ">
            <h2 className="
              text-xl
              font-semibold
              mb-6
            ">
              Candidate Details
            </h2>

            <div className="
              space-y-5
            ">

              <div>
                <p className="
                  text-sm
                  text-gray-500
                ">
                  Name
                </p>

                <p className="
                  text-lg
                  font-medium
                ">
                  {candidate?.name}
                </p>
              </div>

              <div>
                <p className="
                  text-sm
                  text-gray-500
                ">
                  Email
                </p>

                <p className="
                  text-lg
                  font-medium
                  break-all
                ">
                  {candidate?.email}
                </p>
              </div>

              <div>
                <p className="
                  text-sm
                  text-gray-500
                ">
                  Status
                </p>

                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    mt-2
                    border
                    border-gray-300
                    rounded-xl
                    p-3
                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-500
                  "
                >
                  <option value="hold">
                    Hold
                  </option>

                  <option value="selected">
                    Selected
                  </option>

                  <option value="rejected">
                    Rejected
                  </option>
                </select>
              </div>

              <button
                onClick={
                  handleFinalize
                }
                disabled={
                  submitting
                }
                className="
                  w-full
                  py-3
                  rounded-xl
                  text-white
                  font-semibold
                  bg-gradient-to-r
                  from-blue-600
                  to-purple-600
                  hover:opacity-90
                  transition-all
                  disabled:opacity-50
                "
              >
                {submitting
                  ? "Processing..."
                  : "Finalize Result & Send Email"}
              </button>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Result;


