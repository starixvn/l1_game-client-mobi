import React, { useEffect, useRef, useState } from "react";
import { Spinner } from "reactstrap";
import { v4 as uuidv4 } from "uuid";

import appSettings from "../../../common/app-settings";
import { UserStakeLevel } from "../game-base/type";
import Styles from "./game-guide.module.scss";

type Props = {
    language: string;
    gameId: number;
    theme: string;
    userStakeLevel: UserStakeLevel;
};
const GameGuides: React.FC<Props> = (props) => {
    const { gameId, language, theme, userStakeLevel } = props;
    const { gameGuides } = appSettings;
    const wrapperRef = useRef<HTMLIFrameElement>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [heightGuide, setHeightGuide] = useState<number>(0);
    const [widthGuide, setWidthGuide] = useState<number>(0);
    const srcPath = `${gameGuides.dsn}/?gId=${gameId}&lang=${language}&t=${theme}&minBet=${userStakeLevel?.minBet}&maxBet=${
        userStakeLevel?.maxBet
    }&v=${Date.now()}`;
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

    return (
        <div className={Styles["container-guide"]} ref={wrapperRef}>
            {isLoading && (
                <div className={Styles["guide-loading"]}>
                    <Spinner color="secondary" />
                </div>
            )}
            <iframe
                key={uuidv4()}
                className={Styles["guide-iframe"]}
                src={srcPath}
                height={heightGuide}
                width={widthGuide}
                scrolling="auto"
                onLoad={hideSpinner}
            />
        </div>
    );
};

export default React.memo(GameGuides);
