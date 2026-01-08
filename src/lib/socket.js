import { io } from "socket.io-client";

export const socket = io("https://www.dsportdb.online", {
  transports: ["websocket"], // 🔥 REQUIRED
  withCredentials: true,
  autoConnect: true,
});
