import configs from "../../Configs";

export const buildUrl = (
  subDomain: string,
  hostName: string,
  ssl: boolean,
  protocol = "http",
  path = "/",
  port = 80
) => {
  const subDomainText = `${subDomain}.`;
  const portText = `:${port}`;
  return `${protocol}${ssl ? "s" : ""}://${
    subDomain === "" ? "" : subDomainText
  }${hostName}${port === "" ? "" : portText}${path}`;
};

export const buildServerUrl = (
  ssl: boolean,
  protocol = "http",
  path = "/",
  gameId = 0,
  hostname = "localhost"
) => {
  const serverHostName = configs.serverDomainMapper[hostname];
  const serverGameEndPoint = configs.serverGameEndPoints[gameId];
  return buildUrl(
    serverGameEndPoint.subDomain,
    serverHostName,
    ssl,
    protocol,
    serverGameEndPoint.path + path,
    serverGameEndPoint.port
  );
};
