import { useEffect, useRef, useState,useCallback } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import toast from "react-hot-toast";

import { useParams, useNavigate } from "react-router-dom";

import socket from "../../../socket";

import API from "../../../api/axios";

import { ErrorHandler } from "../../errors/ErrorHandler";

import { Camera, CameraOff, Bell, Video, Monitor, MonitorOff, Mic, MicOff, PhoneOff, MessageSquare, FileText, RefreshCw, Save,Speech } from "lucide-react";

function AdminRoom() {

  const { roomId } =
    useParams();

  // ==========================================
  // STATES
  // ==========================================
  const [activeTab, setActiveTab] =
    useState("camera");
  const navigate = useNavigate();

  const [resumeUrl, setResumeUrl] =
    useState("");

  const [candidate, setcandidate] = useState(null);
  const [notes, setNotes] =
    useState("");

  const [isMuted, setIsMuted] =
    useState(false);



  const [cameraConnected, setCameraConnected] =
    useState(false);

  const [screenSharing, setScreenSharing] =
    useState(false);

  const [micActive, setMicActive] =
    useState(true);

  const [notifications, setNotifications] =
    useState([]);

  const [showNotifications, setShowNotifications] =
    useState(false);

  const [timer,
    setTimer] =
    useState(0);
  //admin audio
  const adminStreamRef = useRef(null);
  // ==========================================
  // VIDEO REFS
  // ==========================================
  const candidateVideoRef =
    useRef(null);

  const screenShareRef =
    useRef(null);

  const candidateStreamRef =
    useRef(null);

  const screenStreamRef =
    useRef(null);

  // ==========================================
  // DROPDOWN REF
  // ==========================================
  const notificationRef =
    useRef(null);

  // ==========================================
  // PEERS
  // ==========================================
  const cameraPeer =
    useRef(null);

  const screenPeer =
    useRef(null);

  // ==========================================
  // TIMER
  // ==========================================
  //added 22-06-2026
  useEffect(() => {

  if (
    cameraConnected &&
    candidateVideoRef.current &&
    candidateStreamRef.current
  ) {

    candidateVideoRef.current.srcObject =
      candidateStreamRef.current;

    candidateVideoRef.current
      .play()
      .catch(console.error);
  }

}, [cameraConnected]);

  useEffect(() => {

    const interval =
      setInterval(() => {

        setTimer(prev => prev + 1);

      }, 1000);

    return () =>
      clearInterval(interval);

  }, []);

  useEffect(() => {

    const checkInterview = async () => {
      try {

        await API.get(
          `/validate/${roomId}`
        );

      } catch (error) {

        ErrorHandler(
          navigate,
          error.response?.data?.type
        );

      }
    };

    checkInterview();

  }, [roomId, navigate]);

  // ==========================================
  // FORMAT TIMER
  // ==========================================
  const formatTime = (
    seconds
  ) => {

    const hrs =
      Math.floor(seconds / 3600);

    const mins =
      Math.floor(
        (seconds % 3600) / 60
      );

    const secs =
      seconds % 60;

    return `${String(hrs).padStart(2, "0")}
      :
      ${String(mins).padStart(2, "0")}
      :
      ${String(secs).padStart(2, "0")}`;
  };

  //checking the screen share and camera

 /* useEffect(() => {
    console.log(
      "Camera Stream:",
      candidateStreamRef.current
    );

    console.log(
      "Screen Stream:",
      screenStreamRef.current
    );
  }, [activeTab]);*/
  /*useEffect(() => {
    if (candidateVideoRef.current) {
      console.log(
        "Video Size",
        candidateVideoRef.current.clientWidth,
        candidateVideoRef.current.clientHeight
      );

      console.log(
        "Video Resolution",
        candidateVideoRef.current.videoWidth,
        candidateVideoRef.current.videoHeight
      );
    }
  }, [activeTab]);*/

  // ==========================================
  // ADD NOTIFICATION
  // ==========================================
  const addNotification = (
    message,
    type = 'info'
  ) => {

    setNotifications(prev => [
      {
        id: Date.now(),
        text: message,
        time:
          new Date().toLocaleTimeString(),
        type,
      },
      ...prev,
    ]);
  };

  // ==========================================
  // CLOSE DROPDOWN ON OUTSIDE CLICK
  // ==========================================
  useEffect(() => {

    const handleClickOutside =
      (event) => {

        if (
          notificationRef.current &&
          !notificationRef.current.contains(
            event.target
          )
        ) {

          setShowNotifications(
            false
          );
        }
      };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };

  }, []);

  //get candidate
  useEffect(() => {

    const fetchInterview = async () => {

      try {

        const response = await API.get(`/room/${roomId}`);

        //console.log(response.data);

        setcandidate(response.data.candidate);
        setResumeUrl(response.data.resume);

      } catch (error) {

        console.log(error);

      }
    };

    fetchInterview();

  }, [roomId]);

  // ==========================================
  // REATTACH STREAMS ON TAB SWITCH
  // ==========================================
  useEffect(() => {

    if (
      activeTab === "camera" &&
      candidateVideoRef.current &&
      candidateStreamRef.current
    ) {

      candidateVideoRef.current.srcObject =
        candidateStreamRef.current;
    }

    if (
      activeTab === "screen" &&
      screenShareRef.current &&
      screenStreamRef.current
    ) {

      screenShareRef.current.srcObject =
        screenStreamRef.current;
    }

  }, [activeTab]);

  // ==========================================
  // CREATE PEERS
  // ==========================================
  const createPeers =useCallback( () => {

    // CAMERA PEER
    cameraPeer.current =
      new RTCPeerConnection({
        iceServers: [
          {
            urls: "stun:stun.l.google.com:19302",
          },
        ],
      });
    cameraPeer.current.addTransceiver(
      "video",
      {
        direction: "recvonly"
      }
    );
    cameraPeer.current.onconnectionstatechange =
      () => {

      /*  console.log(
          "Admin Peer State:",
          cameraPeer.current.connectionState
        );*/

      };

    // Add admin audio track to send to candidate
    if (adminStreamRef.current) {
      adminStreamRef.current.getAudioTracks().forEach(track => {
        cameraPeer.current.addTrack(track, adminStreamRef.current);
        //console.log("Admin audio track added in createPeers");
      });
    }

    // SCREEN PEER
    screenPeer.current =
      new RTCPeerConnection({
        iceServers: [
          {
            urls:
              "stun:stun.l.google.com:19302",
          },
        ],
      });
    screenPeer.current.addTransceiver(
      "video",
      {
        direction: "recvonly",
      }
    );


    //camera streams
    cameraPeer.current.ontrack = (event) => {

    /*  console.log(
        "TRACK RECEIVED:",
        event.track.kind
      );*/

      if (event.track.kind !== "video") {
        return;
      }

      const stream = event.streams[0];

      candidateStreamRef.current = stream;

      if (
        candidateVideoRef.current &&
        candidateVideoRef.current.srcObject !== stream
      ) {

        candidateVideoRef.current.srcObject =
          stream;

        candidateVideoRef.current.play()
          .catch(console.error);
      }
    };

    // ==========================================
    // RECEIVE SCREEN STREAM
    // ==========================================
    screenPeer.current.ontrack =
      (event) => {
        //console.log("SCREEN TRACK RECEIVED");

        const stream = event.streams[0];

        screenStreamRef.current = stream;

        if (
          screenShareRef.current
        ) {
         // console.log("ATTACHING SCREEN");
          screenShareRef.current.srcObject =
            stream;
        }
      };

    // ==========================================
    // CAMERA ICE
    // ==========================================
    cameraPeer.current.onicecandidate =
      (event) => {

        if (
          event.candidate
        ) {

          socket.emit(
            "ice_candidate",
            {
              roomId:
                roomId,

              type:
                "camera",

              candidate:
                event.candidate,
            }
          );
        }
      };

    // ==========================================
    // SCREEN ICE
    // ==========================================
    screenPeer.current.onicecandidate =
      (event) => {

        if (
          event.candidate
        ) {

          socket.emit(
            "ice_candidate",
            {
              roomId:
                roomId,

              type:
                "screen",

              candidate:
                event.candidate,
            }
          );
        }
      };
  },[roomId]);


  //end interview
  const handleEndInterview = () => {

    socket.emit("end_interview", {
      roomId
    });

    adminStreamRef.current
      ?.getTracks()
      .forEach(track => track.stop());

    cameraPeer.current?.close();
    screenPeer.current?.close();


    navigate(`/admin/result/${roomId}`);
  };

  //admin mic
  const startAdminMic = async () => {

    try {

      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true
        });

      adminStreamRef.current =
        stream;

      //console.log("Admin mic ready");

    } catch (error) {

      console.log(error);

    }

  };


  const toggleAdminMic = () => {

    const audioTrack =
      adminStreamRef.current
        ?.getAudioTracks()[0];

    if (!audioTrack) return;

    audioTrack.enabled =
      !audioTrack.enabled;

    setIsMuted(!audioTrack.enabled);

    toast.success(
      audioTrack.enabled
        ? "Microphone enabled"
        : "Microphone muted"
    );
  };

  const toggleCandidateMic = () => {
    const newState = !micActive;

    socket.emit("candidateToggle", {
      roomId,
      enable: newState,
    });

    setMicActive(newState);
  };

  // ==========================================
  // SOCKET EVENTS
  // ==========================================
  useEffect(() => {

    // ==========================================
    // OFFER
    // ==========================================
    socket.on(
      "offer",
      async ({
        offer,
        type,
      }) => {
       // console.log("Offer Received", offer, "type:", type);
        try {

          const peer =
            type === "camera"
              ? cameraPeer.current
              : screenPeer.current;

         // console.log("Setting remote description", offer);
          await peer.setRemoteDescription(
            new RTCSessionDescription(
              offer
            )
          );

          const answer =
            await peer.createAnswer();

          await peer.setLocalDescription(
            answer
          );
        /*  console.log(
            "Answer Sent",
            type
          );*/
          socket.emit(
            "answer",
            {
              roomId:

                roomId,

              type,

              answer,
            }
          );

          if (
            type === "camera"
          ) {

            addNotification(
              "Candidate camera connected",
              "success"
            );

            setCameraConnected(true);
            toast.success("Candidate camera connected");
          }

          if (
            type === "screen"
          ) {

            addNotification(
              "Candidate started screen sharing",
              "success"
            );
            setScreenSharing(true);
            toast.success("Candidate started screen sharing");
          }

        } catch (error) {

          console.log(error);
        }
      }
    );

    // ==========================================
    // ICE CANDIDATE
    // ==========================================
    socket.on(
      "ice_candidate",
      async ({
        candidate,
        type,
      }) => {

        try {

          const peer =
            type === "camera"
              ? cameraPeer.current
              : screenPeer.current;

          if (
            peer.remoteDescription
          ) {
            await peer.addIceCandidate(
              new RTCIceCandidate(candidate)
            );
          }

        } catch (error) {

          console.log(error);
        }
      }
    );

    // ==========================================
    // NOTIFICATIONS
    // ==========================================
    socket.on(
      "notification",
      ({ message, type }) => {

        let notificationType = 'info';

        if (
          message.includes("switched tabs")
        ) {
          notificationType = 'warning';
          toast.error(message);
        } else if (
          message.includes("fullscreen")
        ) {
          notificationType = 'warning';
          toast.error(message);
        } else if (
          message.includes("joined")
        ) {
          notificationType = 'success';
          toast.success(message);
        }

        addNotification(message, notificationType);
      }
    );

    // ==========================================
    // SCREEN SHARE STOPPED
    // ==========================================
    socket.on(
      "screen_share_stopped",
      () => {

        setScreenSharing(false);

        if (screenShareRef.current) {
          screenShareRef.current.srcObject = null;
        }

        addNotification(
          "Candidate stopped screen sharing",
          "warning"
        );
        toast.error("Candidate stopped screen sharing");
      }
    );

    // ==========================================
    // CAMERA STATUS
    // ==========================================
    socket.on(
      "camera_status",
      ({ enabled }) => {

        setCameraConnected(
          enabled
        );
        //added 22-06-2026
        if (!enabled) {

          if (candidateVideoRef.current) {
            candidateVideoRef.current.srcObject = null;
          }
        }

        addNotification(
          enabled
            ? "Candidate turned on camera"
            : "Candidate turned off camera",
          enabled
            ? "success"
            : "warning"
        );
        if (enabled) {
          toast.success("Candidate turned on camera");
        } else {
          toast.error("Candidate turned off camera");
        }
      }
    );

    socket.on(
      "mic_status",
      ({ enabled }) => {

        setMicActive(
          enabled
        );

        addNotification(
          enabled
            ? "Candidate unmuted microphone"
            : "Candidate muted microphone",
          enabled
            ? "success"
            : "warning"
        );
        if (enabled) {
          toast.success("Candidate unmuted microphone");
        } else {
          toast.error("Candidate muted microphone");
        }
      }
    );



    // ==========================================
    // INIT CONNECTION
    // ==========================================
    const mic = async () => {
      await startAdminMic();

      //console.log("mic stream", adminStreamRef.current);

      socket.connect();

      socket.emit(
        "join_room",
        {
          roomId
        }
      );
      socket.emit(
        "admin_ready",
        {
          roomId
        }
      );
      socket.emit(
        "request_offer",
        {
          roomId
        }
      );

      createPeers();
    }
    mic();

    return () => {

      socket.off("offer");
      socket.off("ice_candidate");
      socket.off("notification");
      socket.off("screen_share_stopped");
      socket.off("camera_status");
      socket.off("mic_status");

      cameraPeer.current?.close();
      screenPeer.current?.close();
      socket.disconnect();

    };

  }, [roomId,createPeers]);

  return (

    <div className="h-screen bg-gray-50 text-gray-900 flex flex-col overflow-hidden">

      {/* ==========================================
          NAVBAR
      ========================================== */}

      <div
        className="
          h-16
          bg-white
          border-b
          border-blue-100
          flex
          items-center
          justify-between
          px-6
          z-50
          shadow-sm
        "
      >

        {/* LEFT */}

        <div>

          <h1 className="text-2xl font-bold text-blue-900">

            Admin Interview Room

          </h1>

        </div>

        {/* RIGHT */}

        <div className="flex items-center gap-6">

          {/* TIMER */}

          <div
            className="
              bg-blue-600
              px-5
              py-2
              rounded-xl
              font-semibold
              text-white
              shadow-md
            "
          >

            ⏱ {formatTime(timer)}

          </div>
          <button
            onClick={handleEndInterview}
            className="
                bg-red-600
                hover:bg-red-700
                text-white
                px-5
                py-2
                rounded-xl
                font-semibold
                shadow-md
                transition-all
                flex
                items-center
                justify-center
                gap-2
              "
          >
            <PhoneOff size={18} />
            End Interview
          </button>

          {/* NOTIFICATIONS */}

          <div
            className="relative"
            ref={notificationRef}
          >

            {/* BUTTON */}

            <button
              onClick={() =>
                setShowNotifications(
                  prev => !prev
                )
              }
              className="
                relative
                bg-gray-100
                hover:bg-gray-200
                transition-all
                duration-300
                w-12
                h-12
                rounded-xl
                flex
                items-center
                justify-center
                text-xl
                text-gray-700
              "
            >

              <Bell size={20} />

              {
                notifications.length > 0 && (

                  <span
                    className="
                      absolute
                      -top-1
                      -right-1
                      bg-red-500
                      min-w-[22px]
                      h-[22px]
                      rounded-full
                      flex
                      items-center
                      justify-center
                      text-xs
                      font-bold
                    "
                  >

                    {notifications.length}

                  </span>
                )
              }

            </button>

            {/* DROPDOWN */}

            {
              showNotifications && (

                <div
                  className="
                    absolute
                    top-16
                    right-0
                    w-[340px]
                    bg-white
                    border
                    border-gray-200
                    rounded-2xl
                    shadow-xl
                    overflow-hidden
                  "
                >

                  {/* HEADER */}

                  <div
                    className="
                      px-5
                      py-4
                      border-b
                      border-gray-200
                      flex
                      items-center
                      justify-between
                      bg-gray-50
                    "
                  >

                    <h2 className="font-semibold text-lg">

                      Notifications

                    </h2>

                    <button
                      onClick={() =>
                        setNotifications([])
                      }
                      className="
                        text-sm
                        text-blue-600
                        hover:text-blue-700
                        font-medium
                      "
                    >

                      Clear All

                    </button>

                  </div>

                  {/* LIST */}

                  <div
                    className="
                      max-h-[350px]
                      overflow-y-auto
                    "
                  >

                    {
                      notifications.length === 0
                        ? (

                          <div
                            className="
                              p-6
                              text-center
                              text-gray-500
                            "
                          >

                            No Notifications

                          </div>

                        )
                        : notifications.map(
                          (item) => (

                            <div
                              key={item.id}
                              className="
                                px-5
                                py-4
                                border-b
                                border-gray-100
                                hover:bg-gray-50
                                transition-all
                                flex
                                items-start
                                gap-3
                              "
                            >

                              <span
                                className={`
                                  w-2
                                  h-2
                                  rounded-full
                                  mt-2
                                  flex-shrink-0
                                  ${item.type === 'warning'
                                    ? 'bg-orange-500'
                                    : item.type === 'success'
                                      ? 'bg-green-500'
                                      : item.type === 'error'
                                        ? 'bg-red-500'
                                        : 'bg-blue-500'
                                  }
                                `}
                              ></span>

                              <div className="flex-1">

                                <p className="text-sm">

                                  {item.text}

                                </p>

                                <p
                                  className="
                                    text-xs
                                    text-gray-400
                                    mt-2
                                  "
                                >

                                  {item.time}

                                </p>

                              </div>

                            </div>
                          )
                        )
                    }

                  </div>

                </div>
              )
            }

          </div>

        </div>

      </div>

      {/* ==========================================
          MAIN CONTENT
      ========================================== */}

      <div className="flex flex-1 overflow-hidden">

        {/* ==========================================
            SIDEBAR
        ========================================== */}

        <div
          className="
            w-20
            bg-white
            border-r
            border-blue-100
            flex
            flex-col
            items-center
            py-6
            gap-6
            shadow-sm
          "
        >

          {/* CAMERA */}

          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => setActiveTab("camera")}
              className={`
      w-14
      h-14
      flex
      items-center
      justify-center
      rounded-2xl
      text-2xl
      transition-all
      shadow-sm
      ${activeTab === "camera"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                }
    `}
            >
              <Video size={24} />
            </button>
            <span className="text-xs text-gray-600 font-medium">Camera</span>
          </div>

          {/* SCREEN SHARE */}

          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => setActiveTab("screen")}
              className={`
      w-14
      h-14
      flex
      items-center
      justify-center
      rounded-2xl
      text-2xl
      transition-all
      shadow-sm
      ${activeTab === "screen"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                }
    `}
            >
              <Monitor size={24} />
            </button>
            <span className="text-xs text-gray-600 font-medium">Screen</span>
          </div>

          {/* AI COPILOT */}

          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => setActiveTab("ai-copilot")}
              className={`
      w-14
      h-14
      flex
      items-center
      justify-center
      rounded-2xl
      text-2xl
      transition-all
      shadow-sm
      ${activeTab === "ai-copilot"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                }
    `}
            >
              <MessageSquare size={24} />
            </button>
            <span className="text-xs text-gray-600 font-medium">AI Copilot</span>
          </div>

        </div>

        {/* ==========================================
            MAIN CONTENT AREA
        ========================================== */}

        <div className="flex-1 flex flex-col overflow-hidden">

          {/* CAMERA TAB */}

          {activeTab === "camera" && (

            <div className="flex-1 flex flex-col overflow-hidden">

              {/* STATUS INDICATORS */}

              <div className="px-6 py-3 flex items-center gap-4 bg-white border-b border-blue-100">


                <div className="flex items-center gap-8">

                  <div>

                    <p className="text-sm text-gray-500">Name</p>

                    <p className="font-semibold text-gray-900">{candidate?.name || 'Loading...'}</p>

                  </div>

                  <div>

                    <p className="text-sm text-gray-500">Email</p>

                    <p className="text-gray-700">{candidate?.email || 'Loading...'}</p>

                  </div>

                  <div className="flex items-center gap-2">

                    <span className={`w-3 h-3 rounded-full ${cameraConnected ? 'bg-green-500' : 'bg-gray-400'}`}></span>

                    <span className="text-sm font-medium text-gray-700">{cameraConnected ? 'Live' : 'Offline'}</span>

                  </div>

                </div>

              </div>

              {/* MAIN VIDEO AREA - CAMERA */}

              <div
                className="camera-area flex-1 bg-gray-900 flex items-center justify-center">

                <div className="relative w-full h-full">
                  {cameraConnected && candidateStreamRef.current ? (
                    <video
                      ref={candidateVideoRef}
                      autoPlay
                      playsInline
                      className="max-h-[520px] w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-center">
                      <CameraOff
                        size={64}
                        className="text-gray-400 mb-4"
                      />

                      <h3 className="text-lg font-semibold text-gray-700">
                        Camera is Unavailable
                      </h3>

                      <p className="mt-2 text-sm text-gray-500 max-w-md">
                        Ask the candidate to on the camera or refresh the page.
                      </p>
                    </div>
                  )}


                  <div className="absolute top-3 left-3 flex flex-col gap-3 bg-black/40 p-2 rounded-lg">
                    {cameraConnected ? (
                      <Camera className="text-green-400" size={22} />
                    ) : (
                      <CameraOff className="text-red-400" size={22} />
                    )}

                    {screenSharing ? (
                      <Monitor className="text-green-400" size={22} />
                    ) : (
                      <MonitorOff className="text-red-400" size={22} />
                    )}

                    {micActive ? (
                      <Mic className="text-green-400" size={22} />
                    ) : (
                      <MicOff className="text-red-400" size={22} />
                    )}
                  </div>
                </div>
              </div>

              {/* BOTTOM CANDIDATE DETAILS BAR */}



              {/* INTERVIEW CONTROLS */}

              <div className="px-6 py-4 bg-gray-50 border-t border-blue-100 flex items-center justify-center gap-4">

                <button
                  onClick={toggleAdminMic}
                  className={`
                w-12
                h-12
                rounded-full
                flex
                items-center
                justify-center
                transition-all
                ${isMuted
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                    }
              `}
                >

                  {isMuted ? <MicOff size={20} /> : <Mic size={20} />}

                </button>

                <button
                  onClick={toggleCandidateMic}
                  className={`
                    w-12
                    h-12
                    rounded-full
                    text-white
                    flex
                    items-center
                    justify-center
                    transition-all
                    ${micActive ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}
                  `}
                >
                  <Speech size={20} /> 
                </button>

              </div>

            </div>

          )}

          {/* SCREEN SHARE TAB */}

          {activeTab === "screen" && (

            <div className="flex-1 flex flex-col overflow-hidden">

              {/* STATUS INDICATORS */}

              <div className="px-6 py-3 flex items-center gap-4 bg-white border-b border-blue-100">


                <div className="flex items-center gap-8">

                  <div>

                    <p className="text-sm text-gray-500">Name</p>

                    <p className="font-semibold text-gray-900">{candidate?.name || 'Loading...'}</p>

                  </div>

                  <div>

                    <p className="text-sm text-gray-500">Email</p>

                    <p className="text-gray-700">{candidate?.email || 'Loading...'}</p>

                  </div>

                  <div className="flex items-center gap-2">

                    <span className={`w-3 h-3 rounded-full ${cameraConnected ? 'bg-green-500' : 'bg-gray-400'}`}></span>

                    <span className="text-sm font-medium text-gray-700">{cameraConnected ? 'Live' : 'Offline'}</span>

                  </div>

                </div>

              </div>

              {/* MAIN VIDEO AREA - CAMERA */}

              <div className="camera-area flex-1 bg-gray-900 flex items-center justify-center">

                <div className="relative w-full h-full">
                  {screenSharing ? (
                    <video
                      ref={screenShareRef}
                      autoPlay
                      playsInline
                      className="max-h-[520px] w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-center">
                      <MonitorOff
                        size={64}
                        className="text-gray-400 mb-4"
                      />

                      <h3 className="text-lg font-semibold text-gray-700">
                        Screen Sharing Unavailable
                      </h3>

                      <p className="mt-2 text-sm text-gray-500 max-w-md">
                        Ask the candidate to start screen sharing again to continue monitoring their activity.
                      </p>
                    </div>
                  )}

                  <div className="absolute top-3 left-3 flex flex-col gap-3 bg-black/40 p-2 rounded-lg">
                    {cameraConnected ? (
                      <Camera className="text-green-400" size={22} />
                    ) : (
                      <CameraOff className="text-red-400" size={22} />
                    )}

                    {screenSharing ? (
                      <Monitor className="text-green-400" size={22} />
                    ) : (
                      <MonitorOff className="text-red-400" size={22} />
                    )}

                    {micActive ? (
                      <Mic className="text-green-400" size={22} />
                    ) : (
                      <MicOff className="text-red-400" size={22} />
                    )}
                  </div>
                </div>
              </div>

              {/* BOTTOM CANDIDATE DETAILS BAR */}



              {/* INTERVIEW CONTROLS */}

              <div className="px-6 py-4 bg-gray-50 border-t border-blue-100 flex items-center justify-center gap-4">

                <button
                  onClick={toggleAdminMic}
                  className={`
                w-12
                h-12
                rounded-full
                flex
                items-center
                justify-center
                transition-all
                ${isMuted
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                    }
              `}
                >

                  {isMuted ? <MicOff size={20} /> : <Mic size={20} />}

                </button>

                <button
                  onClick={toggleCandidateMic}
                  className={`
                    w-12
                    h-12
                    rounded-full
                    text-white
                    flex
                    items-center
                    justify-center
                    transition-all
                    ${micActive ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}
                  `}
                >
                  <Speech size={20} /> 
                </button>

              </div>

            </div>

          )}

          {/* AI COPILOT TAB */}

          {activeTab === "ai-copilot" && (

            <div className="flex-1 flex gap-6 p-6 overflow-hidden">

              {/* LEFT SIDE - RESUME VIEWER (60%) */}

              <div className="w-[60%] flex flex-col">

                <div
                  className="
                    bg-white
                    rounded-3xl
                    border
                    border-blue-200
                    shadow-sm
                    flex
                    flex-col
                    overflow-hidden
                  "
                >

                  <div
                    className="
                      p-4
                      border-b
                      border-blue-200
                      bg-gradient-to-r from-blue-50 to-white
                    "
                  >

                    <h2 className="text-xl font-semibold text-blue-900 flex items-center gap-2">

                      <FileText size={20} />

                      Candidate Resume

                    </h2>

                  </div>

                  <div className="flex-1 bg-white rounded-2xl overflow-hidden shadow-md">
                    {(resumeUrl) && (
                      <div className="h-full">
                        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                          <Viewer fileUrl={resumeUrl} />
                        </Worker>
                      </div>
                    )}

                    {(!resumeUrl) && (

                      <div className="w-full h-full flex items-center justify-center text-gray-500">

                        <p>No resume URL provided,<br /> Please Ask the {candidate?.name || "candidate"} to login again and upload the resume</p>

                      </div>

                    )}

                  </div>

                </div>

              </div>

              {/* RIGHT SIDE - AI ASSISTANT PANEL (40%) */}

              <div className="w-[40%] flex flex-col gap-4 overflow-hidden">

                {/* AI ACTION BUTTONS */}

                <div className="flex gap-2 flex-wrap">

                  <button
                    className="
                      px-4
                      py-2
                      bg-blue-600
                      text-white
                      rounded-xl
                      hover:bg-blue-700
                      transition-all
                      text-sm
                      font-medium
                      flex
                      items-center
                      gap-2
                    "
                  >

                    <MessageSquare size={16} />

                    Generate Questions

                  </button>

                  <button
                    className="
                      px-4
                      py-2
                      bg-green-600
                      text-white
                      rounded-xl
                      hover:bg-green-700
                      transition-all
                      text-sm
                      font-medium
                      flex
                      items-center
                      gap-2
                    "
                  >

                    <MessageSquare size={16} />

                    Generate Follow-up

                  </button>

                  <button
                    className="
                      px-4
                      py-2
                      bg-purple-600
                      text-white
                      rounded-xl
                      hover:bg-purple-700
                      transition-all
                      text-sm
                      font-medium
                      flex
                      items-center
                      gap-2
                    "
                  >

                    <MessageSquare size={16} />

                    Generate HR Questions

                  </button>

                  <button
                    className="
                      px-4
                      py-2
                      bg-gray-600
                      text-white
                      rounded-xl
                      hover:bg-gray-700
                      transition-all
                      text-sm
                      font-medium
                      flex
                      items-center
                      gap-2
                    "
                  >

                    <RefreshCw size={16} />

                    Refresh Questions

                  </button>

                </div>

                {/* AI PANEL HEADER */}

                <div
                  className="
                    bg-white
                    rounded-3xl
                    border
                    border-blue-200
                    shadow-sm
                    p-4
                  "
                >

                  <h2 className="text-xl font-semibold text-blue-900 flex items-center gap-2">

                    <MessageSquare size={20} />

                    AI Interview Copilot

                  </h2>

                </div>

                {/* QUESTIONS PANEL */}

                <div
                  className="
                    flex-1
                    bg-white
                    rounded-3xl
                    border
                    border-blue-200
                    shadow-sm
                    p-4
                    overflow-y-auto
                  "
                >

                  {/* TECHNICAL QUESTIONS */}

                  <div className="mb-6">

                    <h3 className="text-lg font-semibold text-blue-900 mb-3">Technical Questions</h3>

                    <div className="space-y-2">

                      <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">

                        <p className="text-sm text-gray-700">Explain React Virtual DOM.</p>

                      </div>

                      <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">

                        <p className="text-sm text-gray-700">What is useEffect?</p>

                      </div>

                      <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">

                        <p className="text-sm text-gray-700">Explain Context API.</p>

                      </div>

                    </div>

                  </div>

                  {/* PROJECT QUESTIONS */}

                  <div className="mb-6">

                    <h3 className="text-lg font-semibold text-blue-900 mb-3">Project Questions</h3>

                    <div className="space-y-2">

                      <div className="p-3 bg-green-50 rounded-xl border border-green-100">

                        <p className="text-sm text-gray-700">Explain your architecture.</p>

                      </div>

                      <div className="p-3 bg-green-50 rounded-xl border border-green-100">

                        <p className="text-sm text-gray-700">Biggest challenge?</p>

                      </div>

                      <div className="p-3 bg-green-50 rounded-xl border border-green-100">

                        <p className="text-sm text-gray-700">How would you scale it?</p>

                      </div>

                    </div>

                  </div>

                  {/* HR QUESTIONS */}

                  <div className="mb-6">

                    <h3 className="text-lg font-semibold text-blue-900 mb-3">HR Questions</h3>

                    <div className="space-y-2">

                      <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">

                        <p className="text-sm text-gray-700">Tell me about yourself.</p>

                      </div>

                      <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">

                        <p className="text-sm text-gray-700">Why should we hire you?</p>

                      </div>

                    </div>

                  </div>

                  {/* FOLLOW-UP QUESTIONS */}

                  <div className="mb-6">

                    <h3 className="text-lg font-semibold text-blue-900 mb-3">Follow-up Questions</h3>

                    <div className="space-y-2">

                      <div className="p-3 bg-orange-50 rounded-xl border border-orange-100">

                        <p className="text-sm text-gray-700">Explain JWT in detail.</p>

                      </div>

                      <div className="p-3 bg-orange-50 rounded-xl border border-orange-100">

                        <p className="text-sm text-gray-700">Difference between session and JWT?</p>

                      </div>

                    </div>

                  </div>

                </div>

                {/* INTERVIEW NOTES */}

                <div
                  className="
                    bg-white
                    rounded-3xl
                    border
                    border-blue-200
                    shadow-sm
                    p-4
                  "
                >

                  <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">

                    <FileText size={18} />

                    Interview Notes

                  </h3>

                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Write your interview notes here..."
                    className="
                      w-full
                      h-24
                      p-3
                      border
                      border-gray-200
                      rounded-xl
                      resize-none
                      focus:outline-none
                      focus:border-blue-400
                      text-sm
                    "
                  />

                  <button
                    className="
                      mt-3
                      w-full
                      px-4
                      py-2
                      bg-blue-600
                      text-white
                      rounded-xl
                      hover:bg-blue-700
                      transition-all
                      text-sm
                      font-medium
                      flex
                      items-center
                      justify-center
                      gap-2
                    "
                  >

                    <Save size={16} />

                    Save Notes

                  </button>

                </div>

              </div>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}


export default AdminRoom;
