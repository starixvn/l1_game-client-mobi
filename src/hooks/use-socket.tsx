import { useEffect, useState } from "react";
import io from "socket.io-client";

import { Session } from "../services/user/user";

export default function useSocket(
  socketUri: string,
  proxyRoute: string,
  session: Session
) {
  const [socket, setSocket] = useState<io>(null);

  useEffect(() => {
    const socketIO = io(socketUri, {
      forceNew: true,
      transports: ["websocket"],
      upgrade: false,
      path: proxyRoute,
    });

    socketIO.on("connect", () => {
      socketIO.emit("signin", session);
    });

    setSocket(socketIO);

    return () => {
      socketIO.disconnect();
    };
  }, []);

  return socket;
}
