import { useEffect, useRef, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import socket from "../../../socket";

import CodeEditor from "../../editor/CodeEditor";

function CandidateRoom() {

  const { roomId } = useParams();
  const navigate = useNavigate();

  //console.log(roomId)
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {

    if (!user) {

      navigate("/login");

      return;
    }

  }, [user, navigate]);

  // ==========================================
  // STATES
  // ==========================================
  const [activeTab, setActiveTab] =
    useState("video");

  const [cameraEnabled,
    setCameraEnabled] =
    useState(true);

  const [micEnabled,
    setMicEnabled] =
    useState(true);

  const [screenSharing,
    setScreenSharing] =
    useState(false);

  // ==========================================
  // REFS
  // ==========================================
  const selfVideoRef = useRef(null);

  const screenShareRef = useRef(null);

  const remoteVideoRef = useRef(null);
  const cameraPeer =
    useRef(null);

  const screenPeer =
    useRef(null);

  const localStreamRef =
    useRef(null);

  const screenStreamRef =
    useRef(null);

  //admin voice
  const remoteAudioRef = useRef(null);

  // ==========================================
  // START CAMERA + MIC
  // ==========================================
  const startMedia = async () => {

    try {

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

      localStreamRef.current =
        stream;

      if (selfVideoRef.current) {

        selfVideoRef.current.srcObject =
          stream;
      }

      createPeerConnection(stream);
      await createOffer();
      console.log("Offer Sent");

    } catch (error) {

      console.log(
        "Media Error",
        error
      );
    }
  };

  // ==========================================
  // CREATE WEBRTC CONNECTION
  // ==========================================
  const createPeerConnection = (
    stream
  ) => {

    if (!stream) {

      console.log(
        "createPeerConnection: stream is null"
      );

      return;
    }

    const peer =
      new RTCPeerConnection({
        iceServers: [
          {
            urls:
              "stun:stun.l.google.com:19302",
          },
        ],
      });
      console.log("Setting ontrack handler");
    cameraPeer.current =
      peer;
    peer.onconnectionstatechange =
      () => {

        console.log(
          "Candidate Peer State:",
          peer.connectionState
        );

      };
    peer.addTransceiver("audio", {
      direction: "recvonly",
    });

    // ADD TRACKS
    // RECEIVE ADMIN AUDIO
    

    // ADD CANDIDATE TRACKS
    stream.getTracks().forEach(
      (track) => {

        peer.addTrack(
          track,
          stream
        );
      }
    );

    // RECEIVE REMOTE STREAM
    peer.ontrack = (event) => {
      console.log("TRACK EVENT:", event.track.kind);

      console.log(
        "TRACK EVENT:",
        event.track.kind
      );

      console.log(
        "TRACK STATE:",
        event.track.readyState
      );

      console.log(
        "STREAMS:",
        event.streams
      );

      if (event.track.kind === "audio") {

        console.log(
          "ADMIN AUDIO RECEIVED"
        );

        if (remoteAudioRef.current) {

          remoteAudioRef.current.srcObject =
            event.streams[0];

          remoteAudioRef.current.play()
            .then(() =>
              console.log("AUDIO PLAYING")
            )
            .catch(err =>
              console.log(
                "AUDIO ERROR",
                err
              )
            );
        }
      }
    };
    // SEND ICE CANDIDATES
    peer.onicecandidate = (
      event
    ) => {

      if (
        event.candidate
      ) {

        socket.emit(
          "ice_candidate",
          {
            roomId,
            type: "camera",
            candidate:
              event.candidate,
          }
        );
      }
    };
  };

  // ==========================================
  // CREATE OFFER
  // ==========================================
  const createOffer = async () => {

    try {

      const offer =
        await cameraPeer.current.createOffer();

      await cameraPeer.current.setLocalDescription(
        offer
      );

      socket.emit(
        "offer",
        {
          roomId: roomId,
          type: 'camera',
          offer,
        }
      );

    } catch (error) {

      console.log(
        "Offer Error",
        error
      );
    }
  };
  //tab switch
  useEffect(() => {

    const handleVisibilityChange = () => {

      if (document.hidden) {

        socket.emit(
          "tab_switch",
          {
            roomId,
            candidateName: "Candidate"
          }
        );

      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );

    };

  }, [roomId]);

  // ==========================================
  // SOCKET EVENTS
  // ==========================================
  useEffect(() => {

    socket.connect();

    socket.emit(
      "join_room",
      roomId
    );
    socket.on(
      "request_offer",
      async () => {

        console.log(
          "Admin requested NEW offer"
        );

        if (!localStreamRef.current) {

          console.log(
            "Local media not ready yet"
          );

          return;
        }

        cameraPeer.current?.close();

        createPeerConnection(
          localStreamRef.current
        );

        await createOffer();

        if (
          screenSharing &&
          screenStreamRef.current
        ) {

          screenPeer.current?.close();

          screenPeer.current =
            new RTCPeerConnection({
              iceServers: [
                {
                  urls:
                    "stun:stun.l.google.com:19302",
                },
              ],
            });

          screenStreamRef.current
            .getTracks()
            .forEach(track => {

              screenPeer.current.addTrack(
                track,
                screenStreamRef.current
              );

            });

          const offer =
            await screenPeer.current.createOffer();

          await screenPeer.current.setLocalDescription(
            offer
          );

          socket.emit(
            "offer",
            {
              roomId,
              type: "screen",
              offer,
            }
          );
        }
      }
    );

    // RECEIVE ANSWER
    socket.on(
      "answer",
      async ({
        answer,
        type,
      }) => {

        try {

          console.log(
            "Answer Received:",
            type
          );

          if (type === "camera") {

            console.log(
              "Camera State:",
              cameraPeer.current?.signalingState
            );

            if (
              cameraPeer.current?.signalingState ===
              "have-local-offer"
            ) {

              await cameraPeer.current.setRemoteDescription(
                new RTCSessionDescription(answer)
              );

              console.log("=== RECEIVERS ===");

              cameraPeer.current
                .getReceivers()
                .forEach(r => {
                  console.log(
                    r.track?.kind,
                    r.track?.readyState
                  );
                });
              console.log(
                "Receivers:",
                cameraPeer.current
                  .getReceivers()
                  .map(r => r.track?.kind)
              );

            }
          }

          if (type === "screen") {

            console.log(
              "Screen State:",
              screenPeer.current?.signalingState
            );

            if (
              screenPeer.current?.signalingState ===
              "have-local-offer"
            ) {

              await screenPeer.current.setRemoteDescription(
                new RTCSessionDescription(answer)
              );

            }
          }

        } catch (error) {

          console.log(error);

        }
      }
    );

    // RECEIVE ICE
    socket.on(
      "ice_candidate",
      async ({
        candidate,
        type,
      }) => {

        try {

          if (!candidate) return;

          if (type === "camera") {

            await cameraPeer.current.addIceCandidate(
              new RTCIceCandidate(candidate)
            );

          }

          if (type === "screen") {

            await screenPeer.current.addIceCandidate(
              new RTCIceCandidate(candidate)
            );

          }

        } catch (error) {

          console.log(error);

        }
      }
    );

    return () => {

      socket.off(
        "answer"
      );
      socket.off("request_offer");

      socket.off(
        "ice_candidate"
      );
      cameraPeer.current?.close();
      screenPeer.current?.close();

      cameraPeer.current = null;
      screenPeer.current = null;

      socket.disconnect();

    };

  }, [roomId]);

  // ==========================================
  // INITIAL START
  // ==========================================
  useEffect(() => {

    startMedia();

  }, []);

  // ==========================================
  // CREATE OFFER AFTER STREAM READY
  // ==========================================

  // ==========================================
  // SCREEN SHARE
  // ==========================================
  const startScreenShare =
    async () => {

      try {

        const screenStream =
          await navigator.mediaDevices.getDisplayMedia({
            video: true,
          });

        screenStreamRef.current =
          screenStream;

        if (screenShareRef.current) {
          screenShareRef.current.srcObject =
            screenStream;
        }

        setScreenSharing(true);

        // CREATE SCREEN PEER
        screenPeer.current =
          new RTCPeerConnection({
            iceServers: [
              {
                urls:
                  "stun:stun.l.google.com:19302",
              },
            ],
          });

        // ICE
        screenPeer.current.onicecandidate =
          (event) => {

            if (event.candidate) {

              socket.emit(
                "ice_candidate",
                {
                  roomId,
                  type: "screen",
                  candidate:
                    event.candidate,
                }
              );
            }
          };

        // ADD TRACKS
        screenStream
          .getTracks()
          .forEach(
            (track) => {

              screenPeer.current.addTrack(
                track,
                screenStream
              );
            }
          );

        const offer =
          await screenPeer.current.createOffer();

        await screenPeer.current.setLocalDescription(
          offer
        );

        socket.emit(
          "offer",
          {
            roomId,
            type: "screen",
            offer,
          }
        );

        console.log(
          "Screen Share Offer Sent"
        );

      } catch (error) {

        console.log(
          "Screen Share Error",
          error
        );
      }
    };

  //admin_ready


  // ==========================================
  // TOGGLE CAMERA
  // ==========================================
  const toggleCamera =
    () => {

      const videoTrack =
        localStreamRef.current
          ?.getVideoTracks()[0];

      if (
        videoTrack
      ) {

        videoTrack.enabled =
          !videoTrack.enabled;

        setCameraEnabled(
          videoTrack.enabled
        );

        if (!videoTrack.enabled) {

          socket.emit(
            "camera_off",
            {
              roomId,
              candidateName:
                "Candidate"
            }
          );

        }
      }
    };

  // ==========================================
  // TOGGLE MIC
  // ==========================================
  const toggleMic = () => {

    const audioTrack =
      localStreamRef.current
        ?.getAudioTracks()[0];

    if (
      audioTrack
    ) {

      audioTrack.enabled =
        !audioTrack.enabled;

      setMicEnabled(
        audioTrack.enabled
      );

      if (!audioTrack.enabled) {

        socket.emit(
          "mic_off",
          {
            roomId,
            candidateName:
              "Candidate"
          }
        );

      }

    }
  };

  return (

    <div className="h-screen bg-[#F5F7FB] flex overflow-hidden">

      {/* SIDEBAR */}

      <div
        className="
          w-20
          bg-white
          border-r
          border-zinc-200
          flex
          flex-col
          items-center
          py-6
          gap-5
          shadow-sm
        "
      >

        <button
          onClick={() => setActiveTab("video")}
          className={`
            w-14
            h-14
            rounded-2xl
            text-xl
            font-semibold
            transition-all
            ${activeTab === "video"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-zinc-100 text-zinc-600"
            }
          `}
        >
          🎥
        </button>

        <button
          onClick={() => setActiveTab("code")}
          className={`
            w-14
            h-14
            rounded-2xl
            text-xl
            font-semibold
            transition-all
            ${activeTab === "code"
              ? "bg-emerald-600 text-white shadow-lg"
              : "bg-zinc-100 text-zinc-600"
            }
          `}
        >
          💻
        </button>

      </div>

      {/* MAIN CONTENT */}

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* TOP BAR */}

        <div
          className="
            h-16
            bg-white
            border-b
            border-zinc-200
            px-6
            flex
            items-center
            justify-between
            shadow-sm
          "
        >

          <div>

            <h1 className="text-lg font-bold text-zinc-900">
              MoonInterview
            </h1>

            <p className="text-sm text-zinc-500">
              AI Interview Session
            </p>

          </div>

          <div className="flex items-center gap-4">

            <div
              className="
                bg-zinc-100
                px-4
                py-2
                rounded-xl
                text-zinc-700
                font-medium
              "
            >
              01:24:56
            </div>

            <button
              className="
                bg-red-600
                hover:bg-red-700
                text-white
                px-5
                py-2
                rounded-xl
                font-medium
              "
            >
              End Interview
            </button>

          </div>

        </div>

        {/* VIDEO TAB */}

        <div
          className={
            activeTab === "video"
              ? "flex-1 p-6 overflow-hidden"
              : "hidden"
          }
        >

          <div className="grid grid-cols-3 gap-6 h-full">

            {/* SCREEN SHARE */}

            <div
              className="
                  col-span-2
                  bg-white
                  rounded-3xl
                  border
                  border-zinc-200
                  shadow-sm
                  overflow-hidden
                  flex
                  flex-col
                "
            >

              <div
                className="
                    px-6
                    py-4
                    border-b
                    border-zinc-200
                    flex
                    items-center
                    justify-between
                  "
              >

                <h2 className="font-bold text-zinc-900">
                  Screen Share
                </h2>

                <button
                  onClick={startScreenShare}
                  className="
                      bg-violet-600
                      hover:bg-violet-700
                      text-white
                      px-4
                      py-2
                      rounded-xl
                    "
                >

                  {
                    screenSharing
                      ? "Sharing"
                      : "Share Screen"
                  }

                </button>

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


            {/* CAMERA */}

            <div
              className="
                  bg-white
                  rounded-3xl
                  border
                  border-zinc-200
                  shadow-sm
                  overflow-hidden
                  flex
                  flex-col
                "
            >

              <div
                className="
                    px-6
                    py-4
                    border-b
                    border-zinc-200
                  "
              >

                <h2 className="font-bold text-zinc-900">
                  Candidate Camera
                </h2>

              </div>

              <video
                ref={selfVideoRef}
                autoPlay
                muted
                playsInline
                className="
                    flex-1
                    bg-black
                    object-cover
                  "
              />

              <div
                className="
                    p-4
                    border-t
                    border-zinc-200
                    flex
                    gap-3
                  "
              >

                <button
                  onClick={toggleCamera}
                  className="
                      flex-1
                      bg-blue-600
                      hover:bg-blue-700
                      text-white
                      py-2
                      rounded-xl
                      font-medium
                    "
                >

                  {
                    cameraEnabled
                      ? "Camera OFF"
                      : "Camera ON"
                  }

                </button>

                <button
                  onClick={toggleMic}
                  className="
                      flex-1
                      bg-emerald-600
                      hover:bg-emerald-700
                      text-white
                      py-2
                      rounded-xl
                      font-medium
                    "
                >

                  {
                    micEnabled
                      ? "Mic OFF"
                      : "Mic ON"
                  }

                </button>

              </div>

            </div>

          </div>


        </div>




        {/* CODE TAB */}

        <div
          className={
            activeTab === "code"
              ? "flex-1 overflow-hidden"
              : "hidden"
          }
        >

          <CodeEditor />

        </div> 

        <audio
  ref={remoteAudioRef}
  autoPlay
  playsInline
  controls
/>

      </div>

    </div>

  );
}

export default CandidateRoom;