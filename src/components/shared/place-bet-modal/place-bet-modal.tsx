import { useTranslation } from "next-i18next";
import React, { useEffect, useRef, useState } from "react";
import { isMobileOnly } from "react-device-detect";

import { GameResourceKeys } from "../../../common/resources";
import { useGameContext } from "../../../contexts/game-context/game-context";
import { useSystemContext } from "../../../contexts/system";
import { numberWithCommas } from "../../../helpers/number-helper";
import { adjustPopupPosition, adjustPopupPositionDidUpdate } from "./place-bet-modal-helper";
import { PlaceBetModalProps } from "./place-bet-modal-type";
import Styles from "./place-bet-modal.module.scss";

const PlaceBetModal: React.FC<PlaceBetModalProps> = (props) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const { roundId, gameSetting } = useGameContext();
    const { betValue } = useSystemContext();
    const { t } = useTranslation([gameSetting.gameName.toLocaleLowerCase(), "common"]);
    const {betChoiceInfo} = props,
     { betChoice, odd, gameName } = betChoiceInfo;

    const [positionStyle, setPositionStyle] = useState(null);
    const [arrowStyle, setArrowStyle] = useState("");
    const [alignArrowStyle, setAlignArrowStyle] = useState("");
    const [arrowStyleLeft, setArrowStyleLeft] = useState("");

    const title = t(GameResourceKeys.GAME_NAME);
    const subTitle = `#${roundId}`;

    useEffect(() => {
        const popupStyle = adjustPopupPosition(isMobileOnly, props.gameBaseContainerRef, props.betOptionElement, props.betChoiceElement);
        setPositionStyle(popupStyle.position);
        setAlignArrowStyle(popupStyle.alignArrowStyle);
        setArrowStyle(popupStyle.arrowStyle);
        setArrowStyleLeft(popupStyle.arrowStyleLeft);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (props.isOpen && wrapperRef && wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                closeModal && closeModal();
            }
        };

        window.addEventListener("mousedown", handleClickOutside);

        const adjustedBetFormCss = adjustPopupPositionDidUpdate(
            isMobileOnly,
            props.gameBaseContainerRef,
            wrapperRef,
            props.betOptionElement,
            props.betChoiceElement
        );

        if (adjustedBetFormCss.isAdjust) {
            setPositionStyle(adjustedBetFormCss.styles.position);
            setArrowStyle(adjustedBetFormCss.styles.arrowStyle);
        }

        return () => {
            window.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    const closeModal = () => {
        props.removeBetChoiceFocus();
        props.onCloseModal();
    };

    const submitBet = (event: any) => {
        event.preventDefault();
        closeModal();

        const betOptionsRect = props.betOptionElement.getBoundingClientRect();
        props.onPlaceBet(props.betChoiceInfo.betChoice, betValue, {
            x: betOptionsRect.left + betOptionsRect.width / 2,
            y: betOptionsRect.top + 30,
        });
    };

    const bettypeName = `bettype-${betChoiceInfo.betChoice}`;
    const isShowBettype = t(bettypeName) !== bettypeName;

    return (
        <div style={positionStyle} ref={wrapperRef} className={`${Styles["modal-placebetform"]} ${Styles[gameName.toLocaleLowerCase()]}`}>
            <div className={Styles["popup-closed-icon"]} id="bet-form-closed" onClick={() => closeModal()}>
                <span className={`icon-close {Styles["icon-close"]}`}></span>
            </div>

            {title && (
                <div className={Styles["popup-header"]}>
                    <h1 className={Styles["popup-title"]}>{t(title)}</h1>
                    {subTitle && <div className={Styles["popup-sub-title"]}>{t(subTitle)}</div>}
                </div>
            )}
            <div
                className={`${Styles["popup-content"]} ${subTitle ? Styles["has-subtitle"] : ""} ${
                    !title ? Styles["has-empty-title"] : ""
                }`}
            >
                <div className={Styles["place-bet-container"]}>
                    <div className={`w-100 ${Styles["general-info"]}`}>
                        <div className={Styles["left"]}>
                            {isShowBettype &&  <div className={Styles["font-weight-bold"]}> {t(`bettype-${betChoiceInfo.betChoice}`) }</div>}
                            <div className={`${Styles["font-weight-bold"]} ${Styles["choice"]}`}>{t(betChoice)}</div><div className={Styles["info"]}>@1:{odd}</div>
                        </div>
                        <span className={Styles["highlight"]}>{numberWithCommas(betValue)}</span>
                    </div>

                    <div className={Styles["payout"]}>
                        <label>{t("common:payout")}:</label> <span className={Styles["highlight"]}>{numberWithCommas(betValue * odd)}</span>
                    </div>
                    <p className={Styles["confirm-text"]}>{t("common:confirmBetAutomatic")}</p>
                    <div className={Styles["actions"]}>
                        <button onClick={closeModal} className={`btn-grey ${Styles["custom-button"]}`} disabled={betValue <= 0}>
                            {t("common:cancel")}
                        </button>
                        <button onClick={submitBet} className={`btn-orange ${Styles["custom-button"]}`} disabled={betValue <= 0}>
                            {t("common:confirm")}
                        </button>
                    </div>
                </div>
            </div>
            <div
                className={`${Styles["modal-arrow"]} ${Styles[arrowStyle]} ${Styles[alignArrowStyle]}`}
                style={{ left: arrowStyleLeft }}
            ></div>
        </div>
    );
};

export default PlaceBetModal;
