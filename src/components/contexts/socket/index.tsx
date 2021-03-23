import React from "react";

export const SocketContext = React.createContext<SocketIOClient.Socket>(null);
SocketContext.displayName = "SocketContext";

export const SocketContextProvider = SocketContext.Provider;
export const SocketContextConsumer = SocketContext.Consumer;
export const useSocketContext = () => React.useContext(SocketContext);
