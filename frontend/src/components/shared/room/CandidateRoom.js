import { useEffect, useRef, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import socket from "../../../socket";

import CodeEditor from "../../editor/CodeEditor";

import API from "../../../api/axios";

import toast from "react-hot-toast";
import { ErrorHandler } from "../../errors/ErrorHandler";

import {
  Video,
  Code2,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  ScreenShare,
} from "lucide-react";


function CandidateRoom() {

  const { roomId } = useParams();
  const navigate = useNavigate();

  //console.log(roomId)
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {

    if (!user) {

      navigate(`/login/${roomId}`);

      return;
    }

  }, [user, navigate]);

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
  const rtcConfig = {
  iceServers: [
      {
        urls: "stun:stun.relay.metered.ca:80",
      },
      {
        urls: "turn:global.relay.metered.ca:80",
        username: "916e04d2a094c44f0f8940a3",
        credential: "uK2mcLPf2HUNRsvi",
      },
      {
        urls: "turn:global.relay.metered.ca:80?transport=tcp",
        username: "916e04d2a094c44f0f8940a3",
        credential: "uK2mcLPf2HUNRsvi",
      },
      {
        urls: "turn:global.relay.metered.ca:443",
        username: "916e04d2a094c44f0f8940a3",
        credential: "uK2mcLPf2HUNRsvi",
      },
      {
        urls: "turns:global.relay.metered.ca:443?transport=tcp",
        username: "916e04d2a094c44f0f8940a3",
        credential: "uK2mcLPf2HUNRsvi",
      },
  ]
  };

  // ==========================================
  // REFS
  // ==========================================
  const selfVideoRef = useRef(null);

  const screenShareRef = useRef(null);

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
          video: {
            width: { min: 1280, ideal: 1280 },
            height: { min: 720, ideal: 720 },
            frameRate: { ideal: 30 }
          },
          audio: true
        })
      const track = stream.getVideoTracks()[0];

     /* console.log(
        "LOCAL CAMERA SETTINGS",
        track.getSettings()
      );*/

      // const track = stream.getVideoTracks()[0];

      //console.log(track.getSettings());

      localStreamRef.current =
        stream;

      if (selfVideoRef.current) {

        selfVideoRef.current.srcObject =
          stream;
      }

      createPeerConnection(stream);
      await createOffer();
      //console.log("Offer Sent");

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

    /*  console.log(
        "createPeerConnection: stream is null"
      );*/

      return;
    }

    const peer =
    /* new RTCPeerConnection({
        iceServers: [
          {
            urls:
              "stun:stun.l.google.com:19302",
          },
        ],
      });*/
      new RTCPeerConnection(rtcConfig);
    //console.log("Setting ontrack handler");
    cameraPeer.current =
      peer;
    
    // Add transceiver to receive admin audio
    peer.addTransceiver("audio", { direction: "recvonly" });
    
    peer.onconnectionstatechange =
      () => {

        /*console.log(
          "Candidate Peer State:",
          peer.connectionState
        );*/

      };

    // ADD CANDIDATE TRACKS ONLY - let WebRTC handle transceivers automatically
    stream.getTracks().forEach(
      (track) => {
       /* console.log(
          "Sending stream:",
          stream.getVideoTracks()[0].getSettings()
        );*/

        peer.addTrack(
          track,
          stream
        );
      }
    );

    // RECEIVE REMOTE STREAM
    peer.ontrack = (event) => {
     console.log("=== CANDIDATE ONTRACK FIRED ===");
      console.log("TRACK KIND:", event.track.kind);
      console.log("TRACK ID:", event.track.id);
      console.log("TRACK STATE:", event.track.readyState);
      console.log("STREAMS:", event.streams);
      console.log("STREAM ID:", event.streams[0]?.id);
      console.log("Receivers:", peer.getReceivers().map(r => ({ kind: r.track?.kind, id: r.track?.id })));
      console.log("Senders:", peer.getSenders().map(s => ({ kind: s.track?.kind, id: s.track?.id })));

      if (event.track.kind === "audio") {
        console.log("AUDIO TRACK RECEIVED - checking if it's admin audio");
        console.log("Is remote track?", !stream.getAudioTracks().includes(event.track));

        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = event.streams[0];
          remoteAudioRef.current.play()
            .then(() =>console.log(""))
            .catch(err => console.log("AUDIO ERROR", err));
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
      {
        roomId
      }
    );
    socket.on(
      "request_offer",
      async () => {

     /*   console.log(
          "Admin requested NEW offer"
        );*/

        if (!localStreamRef.current) {

          /*console.log(
            "Local media not ready yet"
          );*/

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
           /* new RTCPeerConnection({
              iceServers: [
                {
                  urls:
                    "stun:stun.l.google.com:19302",
                },
              ],
            });*/
           new RTCPeerConnection(rtcConfig);

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

       /*   console.log(
            "Answer Received:",
            type
          );*/

          if (type === "camera") {

          /*  console.log(
              "Camera State:",
              cameraPeer.current?.signalingState
            );*/

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
                /*  console.log(
                    r.track?.kind,
                    r.track?.readyState
                  );*/
                });
             /* console.log(
                "Receivers:",
                cameraPeer.current
                  .getReceivers()
                  .map(r => r.track?.kind)
              );*/

            }
          }

          if (type === "screen") {

           /* console.log(
              "Screen State:",
              screenPeer.current?.signalingState
            );*/

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

    socket.on("interview_ended", () => {

      toast.error("Interview has ended");

      // Stop camera & mic
      localStreamRef.current
        ?.getTracks()
        .forEach(track => track.stop());

      // Stop screen share
      screenStreamRef.current
        ?.getTracks()
        .forEach(track => track.stop());

      // Close WebRTC connections
      cameraPeer.current?.close();
      screenPeer.current?.close();

      navigate("/candidate/thankyou");
    });

    socket.on("candidateMicToggled", ({ enabled }) => {
      const audioTrack =
        localStreamRef.current
          ?.getAudioTracks()[0];

      if (
        audioTrack
      ) {

        audioTrack.enabled = enabled;

        setMicEnabled(
          audioTrack.enabled
        );

      }

      if (enabled) {
        toast.success("admin enable your mic");
      } else {
        toast.error("admin disabled your mic");
      }
    });

    return () => {

      socket.off(
        "answer"
      );
      socket.off("request_offer");

      socket.off(
        "ice_candidate"
      );
      socket.off("candidateMicToggled");
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
         /* new RTCPeerConnection({
            iceServers: [
              {
                urls:
                  "stun:stun.l.google.com:19302",
              },
            ],
          });*/
          new RTCPeerConnection(rtcConfig);

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

      /*  console.log(
          "Screen Share Offer Sent"
        );*/

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



        socket.emit(
          "camera_status",
          {
            roomId,
            enabled: videoTrack.enabled
          }
        );


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

      socket.emit(
        "mic_status",
        {
          roomId,
          enabled: audioTrack.enabled
        }
      );

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
    flex
    items-center
    justify-center
    transition-all
    ${activeTab === "video"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-zinc-100 text-zinc-600"
            }
  `}
        >
          <Video size={24} />
        </button>

        <button
          onClick={() => setActiveTab("code")}
          className={`
            w-14
            h-14
            rounded-2xl
            flex
            items-center
            justify-center
            transition-all
            ${activeTab === "code"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-zinc-100 text-zinc-600"
            }
          `}
        >
          <Code2 size={24} />
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

                  <div className="flex items-center gap-2">
                    <ScreenShare size={18} />
                    <span>
                      {screenSharing ? "Sharing" : "Share Screen"}
                    </span>
                  </div>

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
                    w-full h-full object-contain
                  "
              />

              <div className="p-4 border-t border-zinc-200 flex justify-center gap-4">

                {/* Camera Button */}
                <button
                  onClick={toggleCamera}
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center
                    transition-all
                    ${cameraEnabled
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-red-500 hover:bg-red-600 text-white"
                    }
                  `}
                  title={cameraEnabled ? "Turn Camera Off" : "Turn Camera On"}
                >
                  {cameraEnabled ? (
                    <Camera size={20} />
                  ) : (
                    <CameraOff size={20} />
                  )}
                </button>

                {/* Mic Button */}
                <button
                  onClick={toggleMic}
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center
                    transition-all
                    ${micEnabled
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "bg-red-500 hover:bg-red-600 text-white"
                    }
                  `}
                  title={micEnabled ? "Mute Microphone" : "Unmute Microphone"}
                >
                  {micEnabled ? (
                    <Mic size={20} />
                  ) : (
                    <MicOff size={20} />
                  )}
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
        />

      </div>

    </div>

  );
}

export default CandidateRoom; 
