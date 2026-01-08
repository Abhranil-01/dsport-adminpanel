import { io } from "socket.io-client";

export const socket = io("https://www.dsportdb.online", {
  withCredentials: true,
  transports: ["polling", "websocket"], // 👈 DO NOT FORCE websocket
  autoConnect: true,
});
