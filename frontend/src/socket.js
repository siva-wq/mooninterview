import { io } from "socket.io-client";

const socket = io("https://mooninterview.onrender.com", {
    transports: ["websocket"],
});

export default socket;
