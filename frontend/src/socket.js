import { io } from "socket.io-client";

const token = localStorage.getItem("token");

console.log("Token from localStorage:", token);

const socket = io("http://localhost:8000", {
  transports: ["polling", "websocket"],
  auth: {
    token: token,
  },
});

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

socket.on("connect_error", (error) => {
  console.log("Socket connection error:", error.message);
});

export default socket;
