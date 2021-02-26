import React from "react";
import { initSockets } from "../../../common/socket";
import configs from "../../../../Configs";
import * as UrlHelper from "../../../helpers/UrlHelper";

const gameServerUrl = UrlHelper.buildServerUrl(configs.ssl, "http", "", 0, window.location.hostname);
const proxyRoute = configs.serverGameEndPoints[0].proxyRoute;
const onConnectFailed = () => {};
export const socketMain = initSockets(
  gameServerUrl,
  "",
  proxyRoute,
  onConnectFailed
);

// const SocketMainContext = React.createContext(socketMain);
// export default SocketMainContext;
