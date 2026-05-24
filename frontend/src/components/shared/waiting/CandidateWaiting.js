import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import API from "../../../api/axios";

import socket from "../../../socket";

function CandidateWaiting() {

  const navigate = useNavigate();

  const { interviewId } = useParams();

  const [cameraPermission, setCameraPermission] =
    useState(false);

  const [micPermission, setMicPermission] =
    useState(false);

  const [screenPermission, setScreenPermission] =
    useState(false);

  const [submitted, setSubmitted] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [approved, setApproved] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const user =
    JSON.parse(localStorage.getItem("user"));

  // ==========================================
  // JOIN WAITING ROOM
  // ==========================================


  const joinWaitingRoom = async () => {

    try {

      // SOCKET JOIN ROOM
      socket.emit(
        "join_room",
        interviewId
      );

      // BACKEND JOIN
      await API.post(
        "/waiting/join",
        {
          candidateName: user?.name,
          interviewId
        }
      );

    } catch (err) {

      console.log(err);
    }
  };
  useEffect(() => {
   joinWaitingRoom();
}, [joinWaitingRoom]);
  
  // ==========================================
  // SOCKET REALTIME EVENTS
  // ==========================================
  useEffect(() => {

    socket.connect();

    // GENERAL NOTIFICATIONS
    socket.on(
      "notification",
      (data) => {

        setMessage(data.message);
      }
    );

    // INTERVIEW STARTED
    socket.on(
      "interview_started",
      (data) => {

        if (
          data.roomId === interviewId
        ) {

          setApproved(true);

          setMessage(
            "Interviewer approved your interview."
          );
        }
      }
    );

    // INTERVIEW ENDED
    socket.on(
      "interview_ended",
      () => {

        setApproved(false);

        setMessage(
          "Interview has ended."
        );
      }
    );

    return () => {

      socket.off(
        "notification"
      );

      socket.off(
        "interview_started"
      );

      socket.off(
        "interview_ended"
      );
    };

  }, [interviewId]);

  // ==========================================
  // HANDLE PERMISSIONS
  // ==========================================
  const handlePermissions = async () => {

    try {

      setLoading(true);

      // CAMERA + MIC
      await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setCameraPermission(true);
      setMicPermission(true);

      // SCREEN SHARE
      await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });

      setScreenPermission(true);

      // BACKEND VERIFY
      const permissionsRes =
        await API.post(
          "/waiting/permissions",
          {
            camera: true,
            microphone: true,
            screenShare: true
          }
        );

      console.log(
        permissionsRes.data
      );

      // READY STATUS
      const readyRes =
        await API.post(
          "/waiting/ready",
          {
            candidateId: user?.id,
            ready: true
          }
        );

      console.log(
        readyRes.data
      );

      // SOCKET READY EVENT
      socket.emit(
        "candidate_ready",
        {
          roomId: interviewId,
          candidateId: user?.id
        }
      );

      setSubmitted(true);

      setMessage(
        "Waiting for interviewer approval..."
      );

    } catch (error) {

      console.log(error);

      alert(
        "Please allow all permissions to continue."
      );

    } finally {

      setLoading(false);
    }
  };

  // ==========================================
  // JOIN INTERVIEW ROOM
  // ==========================================
  const joinInterviewRoom = () => {

    navigate(
      `/interview-room/${interviewId}`
    );
  };

  return (

    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">

      <div
        className="
          w-full
          max-w-3xl
          bg-white
          rounded-3xl
          shadow-xl
          border
          border-gray-200
          p-10
        "
      >

        {/* WELCOME */}

        <div className="text-center">

          <h1 className="text-5xl font-bold text-black">

            Welcome to Moon Interview

          </h1>

          <p className="text-gray-600 mt-5 text-lg leading-relaxed">

            We are excited to have you at the interview.

            <br />

            Please complete the required permissions before joining.

          </p>

          <div className="mt-6 inline-block bg-blue-100 text-blue-700 px-5 py-3 rounded-2xl font-semibold">

            All The Best For Your Interview 🚀

          </div>

        </div>

        {/* LIVE MESSAGE */}

        {
          message && (

            <div
              className="
                mt-8
                bg-green-100
                border
                border-green-200
                text-green-700
                rounded-2xl
                p-5
                text-center
                font-medium
              "
            >

              {message}

            </div>
          )
        }

        {/* USER INFO */}

        <div className="mt-10 bg-zinc-50 border border-zinc-200 rounded-2xl p-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>

              <p className="text-zinc-500 text-sm">
                Candidate Name
              </p>

              <h2 className="text-xl font-bold text-zinc-900 mt-2">

                {user?.name}

              </h2>

            </div>

            <div>

              <p className="text-zinc-500 text-sm">
                Interview ID
              </p>

              <h2 className="text-xl font-bold text-zinc-900 mt-2">

                {interviewId}

              </h2>

            </div>

          </div>

        </div>

        {/* PERMISSIONS */}

        <div className="mt-12 space-y-5">

          {/* CAMERA */}

          <PermissionCard
            title="Camera Access"
            description="Required for video interview monitoring"
            granted={cameraPermission}
          />

          {/* MICROPHONE */}

          <PermissionCard
            title="Microphone Access"
            description="Required for communication during interview"
            granted={micPermission}
          />

          {/* SCREEN */}

          <PermissionCard
            title="Screen Share Access"
            description="Required for coding and monitoring"
            granted={screenPermission}
          />

        </div>

        {/* BUTTON */}

        <div className="mt-10">

          {
            !submitted ? (

              <button
                onClick={handlePermissions}
                disabled={loading}
                className="
                  w-full
                  bg-blue-600
                  hover:bg-blue-700
                  transition-all
                  duration-300
                  text-white
                  py-4
                  rounded-2xl
                  text-lg
                  font-semibold
                  disabled:bg-gray-400
                "
              >

                {
                  loading
                    ? "Checking Permissions..."
                    : "Grant Permissions"
                }

              </button>

            ) : approved ? (

              <button
                onClick={joinInterviewRoom}
                className="
                  w-full
                  bg-green-600
                  hover:bg-green-700
                  transition-all
                  duration-300
                  text-white
                  py-4
                  rounded-2xl
                  text-lg
                  font-semibold
                "
              >

                Join Interview Room

              </button>

            ) : (

              <div
                className="
                  bg-yellow-100
                  border
                  border-yellow-200
                  rounded-2xl
                  p-6
                  text-center
                "
              >

                <h2 className="text-2xl font-bold text-yellow-700">

                  Waiting For Approval

                </h2>

                <p className="text-yellow-600 mt-3 text-lg">

                  Interviewer will allow you shortly.

                </p>

              </div>
            )
          }

        </div>

      </div>

    </div>
  );
}

// ==========================================
// PERMISSION CARD
// ==========================================
function PermissionCard({
  title,
  description,
  granted
}) {

  return (

    <div
      className="
        flex
        items-center
        justify-between
        bg-gray-50
        border
        border-gray-200
        rounded-2xl
        p-5
      "
    >

      <div>

        <h2 className="text-xl font-semibold text-black">

          {title}

        </h2>

        <p className="text-gray-500 mt-1">

          {description}

        </p>

      </div>

      <div>

        {
          granted ? (

            <span className="bg-green-100 text-green-700 px-4 py-2 rounded-xl font-medium">

              Granted

            </span>

          ) : (

            <span className="bg-red-100 text-red-700 px-4 py-2 rounded-xl font-medium">

              Pending

            </span>
          )
        }

      </div>

    </div>
  );
}

export default CandidateWaiting;
