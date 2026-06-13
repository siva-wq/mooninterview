import { useEffect, useRef, useState } from "react";

import { useParams } from "react-router-dom";

import socket from "../../../socket";

function AdminRoom() {

  const { roomId } =
    useParams();

  // ==========================================
  // STATES
  // ==========================================
  const [activeTab, setActiveTab] =
    useState("monitor");

  const [notifications,
    setNotifications] =
    useState([]);

  const [showNotifications,
    setShowNotifications] =
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
  useEffect(() => {

    const interval =
      setInterval(() => {

        setTimer(prev => prev + 1);

      }, 1000);

    return () =>
      clearInterval(interval);

  }, []);

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

  // ==========================================
  // ADD NOTIFICATION
  // ==========================================
  const addNotification = (
    message
  ) => {

    setNotifications(prev => [
      {
        id: Date.now(),
        text: message,
        time:
          new Date().toLocaleTimeString(),
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

  // ==========================================
  // CREATE PEERS
  // ==========================================
  const createPeers = () => {

    // CAMERA PEER
    cameraPeer.current =
      new RTCPeerConnection({
        iceServers: [
          {
            urls: "stun:stun.l.google.com:19302",
          },
        ],
      });
    cameraPeer.current.onconnectionstatechange =
      () => {

        console.log(
          "Admin Peer State:",
          cameraPeer.current.connectionState
        );

      };

    cameraPeer.current.addTransceiver(
      "video",
      {
        direction: "recvonly",
      }
    );

    cameraPeer.current.addTransceiver(
      "audio",
      {
        direction: "recvonly",
      }
    );
    if (
      adminStreamRef.current
    ) {

      adminStreamRef.current
        .getAudioTracks()
        .forEach(track => {
          console.log("Before addTrack", cameraPeer.current);
          const sender = cameraPeer.current.addTrack(
            track,
            adminStreamRef.current
          );

          console.log("Sender added:", sender);
          console.log(
            "Senders after addTrack:",
            cameraPeer.current.getSenders()
          );



          console.log(
            "Senders:",
            cameraPeer.current.getSenders()
              .map(s => s.track?.kind)
          );

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

    // ==========================================
    // RECEIVE CAMERA STREAM
    // ==========================================
    cameraPeer.current.ontrack = (
      event
    ) => {

      console.log(
        "Received track:",
        event.track.kind
      );

      const stream =
        event.streams[0];

      if (
        candidateVideoRef.current &&
        stream
      ) {

        candidateVideoRef.current.srcObject =
          stream;

        candidateVideoRef.current
          .play()
          .catch(console.error);
      }
    };

    // ==========================================
    // RECEIVE SCREEN STREAM
    // ==========================================
    screenPeer.current.ontrack =
      (event) => {

        if (
          screenShareRef.current
        ) {

          screenShareRef.current.srcObject =
            event.streams[0];
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

      console.log("Admin mic ready");

    } catch (error) {

      console.log(
        "Admin Mic Error",
        error
      );

    }

  };

  // ==========================================
  // SOCKET EVENTS
  // ==========================================
  useEffect(() => {
    const mic = async () => {
      await startAdminMic();

      console.log("mic stream", adminStreamRef.current);

      socket.connect();

      socket.emit(
        "join_room",
        roomId
      );
      socket.emit(
        "admin_ready",
        {
          roomId
        }
      );
      socket.emit(
        "request_offer",
        roomId
      );

      createPeers();
    }
    mic();

    // ==========================================
    // OFFER
    // ==========================================
    socket.on(
      "offer",
      async ({
        offer,
        type,
      }) => {
        console.log("Offer Received", offer, "type:", type);
        try {

          const peer =
            type === "camera"
              ? cameraPeer.current
              : screenPeer.current;

          console.log("Setting remote description", offer);
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
          console.log(
            "Answer Sent",
            type
          );
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
              "Candidate camera connected"
            );
          }

          if (
            type === "screen"
          ) {

            addNotification(
              "Candidate started screen sharing"
            );
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

        if (
          message.includes("switched tabs") ||
          message.includes("fullscreen")
        ) {
          alert(message);
        }

        addNotification(message);
      }
    );

    return () => {

      socket.off("offer");
      socket.off("ice_candidate");
      socket.off("notification");

      cameraPeer.current?.close();
      screenPeer.current?.close();
      socket.disconnect();

    };

  }, [roomId]);

  return (

    <div className="h-screen bg-[#0f172a] text-white flex flex-col overflow-hidden">

      {/* ==========================================
          NAVBAR
      ========================================== */}

      <div
        className="
          h-16
          bg-[#020617]
          border-b
          border-gray-800
          flex
          items-center
          justify-between
          px-6
          z-50
        "
      >

        {/* LEFT */}

        <div>

          <h1 className="text-2xl font-bold">

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
            "
          >

            ⏱ {formatTime(timer)}

          </div>

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
                bg-gray-800
                hover:bg-gray-700
                transition-all
                duration-300
                w-12
                h-12
                rounded-xl
                flex
                items-center
                justify-center
                text-xl
              "
            >

              🔔

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
                    bg-[#111827]
                    border
                    border-gray-700
                    rounded-2xl
                    shadow-2xl
                    overflow-hidden
                  "
                >

                  {/* HEADER */}

                  <div
                    className="
                      px-5
                      py-4
                      border-b
                      border-gray-700
                      flex
                      items-center
                      justify-between
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
                        text-blue-400
                        hover:text-blue-300
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
                              text-gray-400
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
                                border-gray-800
                                hover:bg-gray-800
                                transition-all
                              "
                            >

                              <p className="text-sm">

                                {item.text}

                              </p>

                              <p
                                className="
                                  text-xs
                                  text-gray-500
                                  mt-2
                                "
                              >

                                {item.time}

                              </p>

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
            bg-[#020617]
            border-r
            border-gray-800
            flex
            flex-col
            items-center
            py-6
            gap-6
          "
        >

          {/* MONITOR */}

          <button
            onClick={() =>
              setActiveTab(
                "monitor"
              )
            }
            className={`
              w-14
              h-14
              rounded-2xl
              text-2xl
              transition-all
              ${activeTab ===
                "monitor"
                ? "bg-blue-600"
                : "bg-gray-800"
              }
            `}
          >

            🎥

          </button>

          {/* SCREEN */}

          <button
            onClick={() =>
              setActiveTab(
                "screen"
              )
            }
            className={`
              w-14
              h-14
              rounded-2xl
              text-2xl
              transition-all
              ${activeTab ===
                "screen"
                ? "bg-green-600"
                : "bg-gray-800"
              }
            `}
          >

            💻

          </button>

        </div>

        {/* ==========================================
            MONITOR TAB
        ========================================== */}

        <div
          className={
            activeTab ===
              "monitor"
              ? "flex-1 grid grid-cols-2 gap-6 p-6"
              : "hidden"
          }
        >

          {/* CAMERA */}

          <div
            className="
              bg-blue
              rounded-3xl
              overflow-hidden
              border
              border-gray-700
              flex
              flex-col
            "
          >

            <div
              className="
                p-4
                border-b
                border-gray-700
              "
            >

              <h2 className="text-xl font-semibold">

                Candidate Camera

              </h2>

            </div>

            <video
              ref={candidateVideoRef}
              autoPlay
              playsInline
              className="
    w-full
    h-[200px]
    bg-white
    object-contain
  "
            />

          </div>

          {/* RESUME */}

          <div
            className="
              bg-[#111827]
              rounded-3xl
              border
              border-gray-700
              p-6
              overflow-y-auto
            "
          >

            <h2 className="text-xl font-semibold mb-5">

              Candidate Resume

            </h2>

            <div className="space-y-4 text-gray-300">

              <p>
                Resume preview will appear here.
              </p>

              <p>
                Later integrate:
              </p>

              <ul className="list-disc ml-6 space-y-2">

                <li>react-pdf</li>

                <li>Resume analysis</li>

                <li>Skill extraction</li>

              </ul>

            </div>

          </div>

          {/* AI QUESTIONS */}

          <div
            className="
              bg-[#111827]
              rounded-3xl
              border
              border-gray-700
              p-6
              overflow-y-auto
            "
          >

            <h2 className="text-xl font-semibold mb-5">

              AI Questions

            </h2>

            <div className="space-y-4">

              <QuestionCard
                question="
                Explain your final year project.
                "
              />

              <QuestionCard
                question="
                Why did you use WebRTC?
                "
              />

              <QuestionCard
                question="
                Explain your deployment flow.
                "
              />

              <QuestionCard
                question="
                Explain your MongoDB schema.
                "
              />

            </div>

          </div>

        </div>

        {/* ==========================================
            SCREEN SHARE TAB
        ========================================== */}

        <div
          className={
            activeTab ===
              "screen"
              ? "flex-1 p-6"
              : "hidden"
          }
        >

          <div
            className="
              h-full
              bg-[#111827]
              rounded-3xl
              overflow-hidden
              border
              border-gray-700
              flex
              flex-col
            "
          >

            <div
              className="
                p-4
                border-b
                border-gray-700
              "
            >

              <h2 className="text-2xl font-semibold">

                Candidate Screen Share

              </h2>

            </div>

            <video
              ref={screenShareRef}
              autoPlay
              playsInline
              className="
                flex-1
                bg-black
                object-contain
              "
            />

          </div>

        </div>

      </div>

    </div>
  );
}

// ==========================================
// QUESTION CARD
// ==========================================
function QuestionCard({
  question
}) {

  return (

    <div
      className="
        bg-gray-800
        p-4
        rounded-2xl
        border
        border-gray-700
      "
    >

      <p className="text-gray-200">

        {question}

      </p>

    </div>
  );
}

export default AdminRoom;