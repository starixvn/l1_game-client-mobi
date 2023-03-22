import appSettings from "../common/app-settings";

export const buildUrl = (subDomain = appSettings.proxy?.subDomain, path = "/") => {
    const { proxy } = appSettings;
    const domain = getRootDomain();
    const subDomainText = `${subDomain}.`;
    return `${proxy.ssl ? "https" : "http"}://${subDomain === "" ? "" : subDomainText}${domain}${path}`;
};

export const getRootDomain = () => {
    if (typeof window !== "undefined" && window.location && window.location.hostname) {
        const hostName = window.location.hostname;
        return (!!appSettings.serverDomainMapper && appSettings.serverDomainMapper[hostName]) || extractDomainFromHostName(hostName);
    }

    return "";
};

export const extractDomainFromHostName = (hostName: string) => {
    const domainParts = hostName.split(".").reverse();
    return `${domainParts[1]}.${domainParts[0]}`;
};

export const buildGameGuideUrl = () => {
    return buildUrl(appSettings.subGuideDomain, "");
};

export const buildSocketGatewayUrl = () => {
    return buildUrl(appSettings.subSocketGatewayDomain, "");
};

export const buildServerUrl = (path: string) => {
    const pathStr = `/user/${path}`;
    return buildUrlWithPath(pathStr);
};

export const buildUrlWithPath = (path: string) => {
    return buildUrl(appSettings.proxy?.subDomain, path);
};
