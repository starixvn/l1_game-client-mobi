import React, { useState, useEffect, useRef } from "react";
import appSettings from "../../../common/app-settings";
import { v4 as uuidv4 } from "uuid";
import { Spinner } from "reactstrap";
import Styles from "./game-guide.module.scss";

type Props = {
    language: string;
    gameId: number;
    theme: string;
};
const GameGuides: React.FC<Props> = (props) => {
    const { gameId, language } = props;
    const { gameGuides } = appSettings;
    const wrapperRef = useRef<HTMLIFrameElement>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [heightGuide, setHeightGuide] = useState<number>(0);
    const [widthGuide, setWidthGuide] = useState<number>(0);
    const userStakeLevel = { minBet: 0, maxBet: 1000 };
    const srcPath = `${gameGuides.dsn}/?gId=${gameId}&lang=${language}&t=${props.theme}&minBet=${userStakeLevel.minBet}&maxBet=${userStakeLevel.maxBet}`;

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
            wrapperRef.current = null;
            window.removeEventListener("resize", handleResize);
        };
    }, [wrapperRef]);

    return (
        <div key={uuidv4} className={Styles["container-guide"]} ref={wrapperRef}>
            {isLoading && (
                <div className={Styles["guide-loading"]}>
                    <Spinner color="secondary" />
                </div>
            )}
            <iframe
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

export default GameGuides;
