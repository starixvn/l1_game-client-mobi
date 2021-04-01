import React, { useContext } from "react";

import { BetContextModel } from "./type";

export const BetContext = React.createContext<BetContextModel>(null);
BetContext.displayName = "BetContext";

export const BetContextProvider = BetContext.Provider;
export const BetContextConsumer = BetContext.Consumer;
export const useBetContext = () => useContext(BetContext);
