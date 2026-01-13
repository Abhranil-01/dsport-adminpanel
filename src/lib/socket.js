import { io } from "socket.io-client";
const SOCKET_URL = import.meta.env.VITE_PUBLIC_SOCKET_URL;

export const socket = io(SOCKET_URL, {
  path: "/socket.io",
  withCredentials: true,
  transports: ["polling", "websocket"], // 👈 DO NOT FORCE websocket
  autoConnect: true,
});
