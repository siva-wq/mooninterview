import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import API from "../../../api/axios";

import socket from "../../../socket";

import uploadResume from "../../cloudinary/UploadResume";

import {ErrorHandler} from "../../errors/ErrorHandler";

function CandidateWaiting() {

  const navigate = useNavigate();

  const { roomId } = useParams();

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

  const [message, setMessage] =
    useState("");

  const [resumeFile, setResumeFile] = useState(null);
  const [resumeUploaded, setResumeUploaded] =
    useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {

    if (!user) {

      navigate("/login");

      return;
    }

  }, [user, navigate]);

 useEffect(() => {

    const checkInterview = async () => {
      try {

        await API.get(
          `/validate/${roomId}`
        );

        const res = await API.get( `/interview/${roomId}` ); 
        if ( res.data.status === "ongoing" ) { 
          navigate( `/candidate/interview/${roomId}` );
        }

      } catch (error) {
         console.log("Validation Error:", error);
          console.log("Status:", error.response?.status);
          console.log("Data:", error.response?.data);

        ErrorHandler(
          navigate,
          error.response?.data?.type
        );

      }
    };

    checkInterview();

  }, [roomId, navigate]);


  useEffect(() => {

  const checkInterview = async () => {

    try {

      //await API.get(
     //   `/interview/${roomId}`
     // );

    } catch (error) {

      localStorage.clear();

      socket.disconnect();

      navigate("/candidate/invalid");
    }
  };

  checkInterview();

}, [roomId]);

  // ==========================================
  // JOIN WAITING ROOM
  // ==========================================


  const joinWaitingRoom = async () => {

    try {

      // SOCKET JOIN ROOM
      socket.emit(
        "join_room",
        {
          roomId: roomId
        }
      );

      // BACKEND JOIN
      await API.post(
        "/waiting/join",
        {
          roomId
        }
      );

    } catch (err) {

      console.log(err);
    }
  }

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
          data.roomId === roomId
        ) {
          setMessage(
            "Interviewer approved your interview."
          );
          navigate(
            `/candidate/interview/${roomId}`
          );
        }
      }
    );

    // INTERVIEW ENDED
    socket.on(
      "interview_ended",
      () => {

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

  }, [roomId,navigate]);

  const handleResumeChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setResumeFile(file);
    //setResumeUploaded(true);

  };
  const handleResumeUpload = async () => {
    try {

      if (!resumeFile) {
        alert("Please select a resume");
        return;
      }

      const result = await uploadResume(
        resumeFile,
        user.id
      );
     // console.log(result)

      const response=await API.post(
        "/candidate/update-resume",
        {
          id: user.id,
          resumeUrl: result.secure_url
        }
      );

     // console.log(response);

      setResumeUploaded(true);

      alert("Resume uploaded successfully");

    } catch (error) {

      console.log(error);

      alert("Resume upload failed in backend, try again");
    }
  };

  // ==========================================
  // HANDLE PERMISSIONS
  // ==========================================
  const handlePermissions = async () => {
  try {

    setLoading(true);

    // Resume check first
    if (!resumeUploaded) {
      alert("Please upload your resume first");
      return;
    }

    // Camera + Mic
    const mediaStream =
      await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

    // Screen Share
    const screenStream =
      await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });

    // Validate permissions
    const cameraGranted =
      mediaStream.getVideoTracks().length > 0;

    const micGranted =
      mediaStream.getAudioTracks().length > 0;

    const screenGranted =
      screenStream.getVideoTracks().length > 0;

    if (!cameraGranted) {
      alert("Camera permission not granted");
      return;
    }

    if (!micGranted) {
      alert("Microphone permission not granted");
      return;
    }

    if (!screenGranted) {
      alert("Screen share permission not granted");
      return;
    }

    if(!resumeUploaded){
      alert("resume is not uploaded");
      return;
    }

    // Update UI
    setCameraPermission(true);
    setMicPermission(true);
    setScreenPermission(true);

    // Backend Verify
    await API.post(
      "/waiting/permissions",
      {
        camera: true,
        microphone: true,
        screenShare: true,
        resume: true,
      }
    );

    // Ready Status
    await API.post(
      "/waiting/ready",
      {
        candidateId: user?.id,
        ready: true,
      }
    );

    // Notify Admin
    socket.emit(
      "candidate_ready",
      {
        roomId,
        candidateId: user?.id,
        organisationId: user?.organisation
      }
    );

    setSubmitted(true);

    setMessage(
      "Waiting for interviewer approval..."
    );

  } catch (error) {

    console.error(error);

    alert(
      "Permission denied or an error occurred"
    );

  } finally {

    setLoading(false);
  }
};

  // ==========================================
  // JOIN INTERVIEW ROOM
  // ==========================================

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

                {roomId}

              </h2>

            </div>

          </div>

        </div>

        {/* PERMISSIONS */}

        <div className="mt-12 space-y-5">
          {/*resume upload */}

          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleResumeChange}
          />

          <button
            onClick={handleResumeUpload}
            disabled={!resumeFile}
            className="
              w-full
              bg-purple-600
              hover:bg-purple-700
              transition-all
              duration-300
              text-white
              py-4
              rounded-2xl
              text-lg
              font-semibold
              disabled:bg-gray-400
              disabled:cursor-not-allowed
            "
          >
            Upload Updated Resume
          </button>
          <PermissionCard
            title="Resume Upload"
            description={
              resumeUploaded
                ? "Resume uploaded successfully"
                : "Please upload your latest resume"
            }
            granted={resumeUploaded}
          />

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

            ) : (

              <div
                className="
                  bg-green-100
                  border
                  border-green-200
                  rounded-2xl
                  p-6
                  text-center
                "
              >

                <h2 className="text-2xl font-bold text-white-700">

                  Waiting For Approval

                </h2>

                <p className="text-white-600 mt-3 text-lg">

                  Interviewer will allow you shortly.

                </p><br />
                <p>Note:This is the pre check of the requirements, you must turn-on camera and microphone in the interview room</p>

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
