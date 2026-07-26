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
  const [status, setStatus] = useState("hold");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const res = await API.get(
          `/room/${roomId}`
        );

        console.log(res.data);

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
        <p className="text-base sm:text-lg">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="
      min-h-screen
      bg-background
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
          text-2xl sm:text-3xl
          font-bold
          text-navy
        ">
          Interview Result
        </h1>
      </div>

      <div className="
        grid
        grid-cols-1
        lg:grid-cols-3
        gap-4 sm:gap-6
      ">

        {/* Resume Section */}

        <div className="
          lg:col-span-2
        ">
          <div className="
            card
            rounded-2xl
            shadow-md
            overflow-hidden
            h-[400px] sm:h-[500px] lg:h-[600px] xl:h-[800px]
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
            card
            rounded-2xl
            shadow-md
            p-4 sm:p-6
          ">
            <h2 className="
              text-lg sm:text-xl
              font-semibold
              mb-4 sm:mb-6
              text-navy
            ">
              Candidate Details
            </h2>

            <div className="
              space-y-3 sm:space-y-5
            ">

              <div>
                <p className="
                  text-xs sm:text-sm
                  text-secondary
                ">
                  Name
                </p>

                <p className="
                  text-base sm:text-lg
                  font-medium
                ">
                  {candidate?.name}
                </p>
              </div>

              <div>
                <p className="
                  text-xs sm:text-sm
                  text-secondary
                ">
                  Email
                </p>

                <p className="
                  text-base sm:text-lg
                  font-medium
                  break-all
                ">
                  {candidate?.email}
                </p>
              </div>

              <div>
                <p className="
                  text-xs sm:text-sm
                  text-secondary
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
                    border-custom
                    rounded-xl
                    p-2 sm:p-3
                    text-sm sm:text-base
                    focus:outline-none
                    focus:ring-2
                    focus:ring-primary
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
                  btn-primary
                  w-full
                  py-2 sm:py-3
                  text-sm sm:text-base
                  font-semibold
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


