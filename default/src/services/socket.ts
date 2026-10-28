import { io, Socket } from "socket.io-client";

const SOCKET_URL =
  (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "") : "") ||
  "http://localhost:5001";

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 20,
  reconnectionDelay: 1000,
  transports: ["websocket", "polling"],
});
