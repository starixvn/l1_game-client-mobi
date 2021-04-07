import React, { useContext } from "react";

import { PopupContextModel } from "./type";

export const PopupContext = React.createContext<PopupContextModel>(null);
PopupContext.displayName = "PopupContext";

export const PopupContextProvider = PopupContext.Provider;
export const PopupContextConsumer = PopupContext.Consumer;
export const usePopupContext = () => useContext(PopupContext);
