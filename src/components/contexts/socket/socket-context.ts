import React from "react";
import socketIOClient from "socket.io-client";
import { configs } from "../../../../Configs";

const socket = socketIOClient(configs.sedieServiceUrl);

export const SocketContext = React.createContext(socket);
