import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import Loader from "../../../shared/loader";
import appSettings from "../../../../common/app-settings";
import { UserStakeLevel } from "../../../shared/game-base/type";
import { gameVipIds } from "../../../../common/constants";
import { useTheme } from "next-themes";
import { useTranslation } from "next-i18next";
import { isMobileOnly, isIOS, browserVersion } from "react-device-detect";

import Styles from "./game-guide.module.scss";

type Props = {
    gameId: number;
    userStakeLevel: UserStakeLevel;
    gameConfigs: any;
};
const GameGuides: React.FC<Props> = (props) => {
    const { gameId, userStakeLevel, gameConfigs } = props;
    const { i18n } = useTranslation();
    const { theme } = useTheme();
    const { guideUrl } = appSettings;
    const wrapperRef = useRef<HTMLIFrameElement>();
    const wrapperIframeRef = useRef<HTMLIFrameElement>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [heightGuide, setHeightGuide] = useState<number>(0);
    const [widthGuide, setWidthGuide] = useState<number>(0);
    const minMaxBetParams = gameVipIds.includes(gameId) ? `&minBet=${userStakeLevel?.minBet}&maxBet=${userStakeLevel?.maxBet}` : "";
    const srcPath = `${guideUrl}/${i18n.language}/?gId=${gameId}&t=${theme}${minMaxBetParams}&v=${Date.now()}`;
    const gameConfigsFake = {
        maxBetPerChoices: { even: 5000, odd: 5000, red2: 5000, red3: 5000, white3: 5000, red4: 500, white4: 500 },
        enableFreeBet: false,
        maxBet: 5000,
        minBet: 10,
        odds: { even: 1.99, odd: 1.96, red2: 2.9, red3: 3.75, white3: 3.75, red4: 14.4, white4: 14.4 },
    };

    const handleResize = () => {
        if (wrapperRef?.current) {
            setHeightGuide(wrapperRef.current.clientHeight);
            setWidthGuide(wrapperRef.current.clientWidth);
        }
    };

    const hideSpinner = () => {
        setIsLoading(false);
        handleResize();
        wrapperIframeRef.current.contentWindow.postMessage(JSON.stringify(gameConfigs ? gameConfigs : gameConfigsFake), guideUrl);
    };

    useEffect(() => {
        const isIOSBrowserVersion15 = isMobileOnly && isIOS && browserVersion === "15";
        !isIOSBrowserVersion15 && window.addEventListener("resize", handleResize);

        handleResize();

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [wrapperRef]);

    return (
        <div className={Styles["container-guide"]} ref={wrapperRef}>
            {isLoading && (
                <div className={Styles["guide-loading"]}>
                    <Loader></Loader>
                </div>
            )}
            <iframe
                ref={wrapperIframeRef}
                key={uuidv4()}
                className={Styles["guide-iframe"]}
                src={srcPath}
                referrerPolicy="strict-origin-when-cross-origin"
                height={heightGuide}
                width={widthGuide}
                scrolling="auto"
                onLoad={hideSpinner}
            />
        </div>
    );
};

export default React.memo(GameGuides);
