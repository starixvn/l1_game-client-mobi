import React, { useContext } from "react";

type DeviceContextType = {
    isMobile: boolean;
};

const DeviceContext = React.createContext<DeviceContextType>({ isMobile: false });
DeviceContext.displayName = "DeviceContext";

export const DeviceContextProvider = DeviceContext.Provider;
export const DeviceContextConsumer = DeviceContext.Consumer;
export const useDeviceContext = () => useContext(DeviceContext);
