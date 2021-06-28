import React from "react";
import { useTranslation } from "next-i18next";

import { ResourceTypes } from "../../../common/resources";

const LockingBet: React.FC = () => {
    const { t } = useTranslation(ResourceTypes.COMMON);
    return <div className="overlay-mask-white"></div>;
};

export default LockingBet;
