import * as socketIO from "socket.io-client";
import { sentryLogger } from "../../utils/sentry";
import * as SessionManager from "../../common/auth/session-manager";

export const socket = socketIO();
export const initSockets = (
  socketUri: string,
  gameName: string,
  proxyRoute: string,
  onConnectFailed: (gameName) => void
) => {
  const socket = socketIO(socketUri, {
    forceNew: true,
    transports: ["websocket"],
    upgrade: false,
    path: proxyRoute,
  });

  socket.on("connect", () => {
    console.log("------------------getSession----------------");
    console.log(SessionManager.getSession());
    socket.emit("signin", SessionManager.getSession());
  });

  socket.on("reconnect", () => {
    sentryLogger.logError(`${gameName} socket reconnect`);
  });

  socket.on("connect_failed", () => {
    sentryLogger.logError(`${gameName} socket connect failed`);
    socket.disconnect();
    onConnectFailed(gameName);
  });

  socket.on("connect_error", (error) => {
    console.log(error);

    sentryLogger.logError(error);
    socket.disconnect();
    onConnectFailed(gameName);
  });

  socket.on("disconnect", (reason) => {
    sentryLogger.log(`${gameName} socket disconnect\n${reason}`);
  });

  return socket;
};
