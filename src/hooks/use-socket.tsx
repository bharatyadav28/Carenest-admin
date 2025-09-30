import { useEffect, useRef } from "react";

import { io, Socket } from "socket.io-client";

const SOCKET_URL = "https://carenest-backend-8y2y.onrender.com";

export const useSocket = (token: string | undefined) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token) return;

    socketRef.current = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket"],
    });

    socketRef.current.emit("join");

    return () => {
      socketRef.current?.disconnect();
    };
  }, [token]);

  const sendMessage = (toUserId: string, message: string) => {
    socketRef.current?.emit("send_message", { toUserId, message });
  };

  const onNewMessage = (callback: (msg: any) => void) => {
    socketRef.current?.on("new_message", callback);
  };

  return { socket: socketRef.current, sendMessage, onNewMessage };
};
