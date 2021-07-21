import { useTranslation } from "next-i18next";
import React, { useState } from "react";

import { GameResourceKeys } from "../../../common/resources";
import { useGameContext } from "../../../contexts/game-context/game-context";
import { numberWithCommas } from "../../../helpers/number-helper";
import AdvanceModal from "../advance-modal";
import { isMobile } from "react-device-detect";
import { ModalType } from "../base-dialog/type";
import { numPad } from "./place-bet-constant";
import NumberFormat from "react-number-format";
import Styles from "./place-bet-modal.module.scss";

type BetChoiceInfo = {
    gameName: string;
    roundId: number;
    betChoice: string;
    odd: number;
};

type Props = {
    isOpen: boolean;
    onPlaceBet: (betChoice: string, amount: number) => void;
    betChoiceInfo: BetChoiceInfo;
    onCloseModal: Function;
};

const PlaceBetModal: React.FC<Props> = (props) => {
    const { roundId, gameSetting, gameConfigs, userStakeLevel } = useGameContext();
    const { t } = useTranslation([gameSetting.gameName.toLocaleLowerCase(), "common"]);
    const { betChoice, odd } = props.betChoiceInfo;
    const [betStake, setBetStake] = useState(gameConfigs.minbet);

    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipMessage, setTooltipMessage] = useState(t("messages:minBetNotice", { minBet: gameConfigs.minbet }));

    const maxBetPerRound = Math.min(gameConfigs.maxbet, userStakeLevel.maxBet);
    const maxBetChoice = gameConfigs.choices_maxbet == null ? gameConfigs.maxbet : gameConfigs.choices_maxbet[betChoice];

    const chips = [
        {
            style: "chip-1",
            value: 1,
        },
        {
            style: "chip-3",
            value: 10,
        },
        {
            style: "chip-6",
            value: 100,
        },
        {
            style: "chip-8",
            value: 500,
        },
        {
            style: "chip-13",
            value: maxBetChoice,
        },
    ];

    const payouts = [
        {
            text: t("common:payout"),
            value: numberWithCommas(betStake * odd),
        },
        {
            text: t("common:minBet"),
            value: numberWithCommas(gameConfigs.minbet),
        },
        {
            text: t("common:maxBet"),
            value: numberWithCommas(maxBetChoice),
        },
    ];

    const closeModal = () => {
        props.onCloseModal();
    };

    const addStakeHandler = (event: any, stake: number) => {
        event.preventDefault();
        validateBetStake(betStake + stake);
    };

    const validateBetStake = (totalStake: number) => {
        if (totalStake > maxBetPerRound) {
            setShowTooltip(true);
            setTooltipMessage(t("messages:maxBetForChoiceNotice", { maxBet: maxBetPerRound }));
            setBetStake(maxBetPerRound);
            return;
        }

        if (totalStake > maxBetChoice) {
            setShowTooltip(true);
            setTooltipMessage(t("messages:maxBetForChoiceNotice", { maxBet: maxBetChoice }));
            setBetStake(maxBetChoice);
            return;
        }
        
        setShowTooltip(false);
        setBetStake(totalStake);
    };

    const convertToIntFromNumpad = (numpadValue: string, inputValue: number, powersOfTen: number) =>
        inputValue * powersOfTen + parseInt(numpadValue);

    const deleteNumberHandler = (event: any) => {
        event.preventDefault();
        setBetStake((prevBetStake) => prevBetStake / 10);
    };

    const clearBetStake = (event: any) => {
        event.preventDefault();
        setBetStake(0);
    };

    const submitBet = () => {
        closeModal();
        props.onPlaceBet(props.betChoiceInfo.betChoice, betStake);
    };

    return (
        <AdvanceModal
            title={t(GameResourceKeys.GAME_NAME)}
            subTitle={`#${roundId}`}
            isOpen={props.isOpen}
            onCloseModal={closeModal}
            type={ModalType.PlaceBetForm}
            gameId={gameSetting.id}
        >
            <div className={Styles["place-bet-container"]}>
                <div className={`w-100 ${Styles["general-info"]}`}>
                    <div className={Styles["bet-option"]}>{t(betChoice)}</div>
                    <div className={Styles["odds"]}>1:{odd}</div>
                </div>

                <div className="form-group">
                    <NumberFormat
                        readOnly={isMobile}
                        value={betStake}
                        className="form-control number"
                        thousandSeparator={true}
                        onValueChange={(values) => validateBetStake(parseInt(values.value))}
                    />

                    <span className="icon-close small" onClick={clearBetStake}></span>
                    {showTooltip && (
                        <div className={`tooltip info show ${Styles["tooltip-info"]}`}>
                            <div className={`arrow down ${Styles["arrow"]}`}></div>
                            <div className={`tooltip-inner ${Styles["tooltip-inner"]}`}>{tooltipMessage}</div>
                        </div>
                    )}
                </div>

                {payouts.map((payout, index) => (
                    <div className={Styles["payout"]} key={index}>
                        <label>{payout.text}:</label>
                        <span className={Styles["highlight"]}>{payout.value}</span>
                    </div>
                ))}

                <div className={Styles["bet-chips"]}>
                    {chips.map((chip, index) => (
                        <div
                            className={`${Styles["chip-container"]} ${Styles[chip.style]}`}
                            key={index}
                            onClick={(event) => addStakeHandler(event, chip.value)}
                        >
                            <img
                                src={`/static/images/chips/${chip.style}.svg`}
                                className={`img-fluid ${Styles["chip"]}`}
                                width="48"
                                height="50"
                                alt="Chip"
                            />
                            <span className={Styles["value"]}>{chip.value == maxBetChoice ? "MAX" : `+${chip.value}`}</span>
                        </div>
                    ))}
                </div>

                {isMobile && (
                    <div className={Styles["numpad-container"]}>
                        {numPad.map((pad, index) => (
                            <div
                                className={Styles["numpad"]}
                                onClick={(event) =>
                                    pad.showValue
                                        ? validateBetStake(convertToIntFromNumpad(pad.value, betStake, pad.powersOfTen))
                                        : deleteNumberHandler(event)
                                }
                                key={index}
                            >
                                {pad.showValue ? pad.value : <span className="icon-delete"></span>}
                            </div>
                        ))}
                    </div>
                )}

                <button onClick={submitBet} className={`btn-orange w-100`} disabled={betStake <= 0}>
                    {t("common:confirm")}
                </button>
            </div>
        </AdvanceModal>
    );
};

export default PlaceBetModal;
