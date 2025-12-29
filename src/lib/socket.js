import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_PUBLIC_SOCKET_URL, {
  withCredentials: true,
  autoConnect: true,
});
