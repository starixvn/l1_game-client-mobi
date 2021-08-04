import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Loader from "../../../shared/loader";
import appSettings from "../../../../common/app-settings";
import { UserStakeLevel } from "../../../shared/game-base/type";
import Styles from "./game-guide.module.scss";
import { gameVipIds, LanguageLocaleMapper } from "../../../../common/constants";
import { useTheme } from "next-themes";
import { useTranslation } from "next-i18next";

type Props = {
    gameId: number;
    userStakeLevel: UserStakeLevel;
};
const GameGuides: React.FC<Props> = (props) => {
    const { gameId, userStakeLevel } = props;
    const { i18n } = useTranslation();
    const language = LanguageLocaleMapper[i18n.language];
    const { theme } = useTheme();
    const { guideUrl } = appSettings;
    const wrapperRef = useRef<HTMLIFrameElement>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [heightGuide, setHeightGuide] = useState<number>(0);
    const [widthGuide, setWidthGuide] = useState<number>(0);
    const [contentGuide, setContentGuide] = useState<any>(<></>);
    const minMaxBetParams = gameVipIds.includes(gameId) ? `&minBet=${userStakeLevel?.minBet}&maxBet=${userStakeLevel?.maxBet}` : "";
    const srcPath = `${guideUrl}/?gId=${gameId}&lang=${language}&t=${theme}${minMaxBetParams}&v=${Date.now()}`;

    const hideSpinner = () => {
        setIsLoading(false);
    };

    useEffect(() => {
        function handleResize() {
            if (wrapperRef.current) {
                setHeightGuide(wrapperRef.current.clientHeight);
                setWidthGuide(wrapperRef.current.clientWidth);
            }
        }

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [wrapperRef]);

    useEffect(() => {
        if (heightGuide > 0 && widthGuide > 0) {
            setContentGuide(
                <iframe
                    key={uuidv4()}
                    className={Styles["guide-iframe"]}
                    src={srcPath}
                    referrerPolicy="strict-origin-when-cross-origin"
                    height={heightGuide}
                    width={widthGuide}
                    scrolling="auto"
                    onLoad={hideSpinner}
                />
            );
        }
    }, [heightGuide, widthGuide, gameId]);

    return (
        <div className={Styles["container-guide"]} ref={wrapperRef}>
            {isLoading && (
                <div className={Styles["guide-loading"]}>
                    <Loader></Loader>
                </div>
            )}
            {contentGuide}
        </div>
    );
};

export default React.memo(GameGuides);
