import { useEffect, useState } from "react";
import io from "socket.io-client";

import { useAuthContext } from "../components/contexts/auth";

export default function useSocket(socketUri: string, proxyRoute: string) {
    const session = useAuthContext();
    const [socket, setSocket] = useState<SocketIOClient.Socket>(null);

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
