import { useTranslation } from "next-i18next";
import React, { useState } from "react";

import _ from "lodash";
import { GameResourceKeys } from "../../../common/resources";
import { getSessionStorageItem, SessionStorageKeys } from "../../../common/session-storage";
import { useGameContext } from "../../../contexts/game-context/game-context";
import { numberWithCommas } from "../../../helpers/number-helper";
import AdvanceModal from "../advance-modal";
import { ModalType } from "../base-dialog/type";
import { BetSettingStorage } from "../bet-settings/type";
import { numPad } from "./place-bet-constant";
import BaseDialog from "../../shared/base-dialog";
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

const betSettingStorageKey = SessionStorageKeys.betSetting;

const PlaceBetModal: React.FC<Props> = (props) => {
    const { roundId, gameSetting, gameConfigs } = useGameContext();
    const betSettingStorage = getSessionStorageItem<BetSettingStorage>(betSettingStorageKey) ?? {};
    const betValue = betSettingStorage[gameSetting.id]?.betStake ?? 1;
    const { t } = useTranslation([gameSetting.gameName.toLocaleLowerCase(), "common"]);
    const { betChoice, odd } = props.betChoiceInfo;
    const [rawStake, setrawStake] = useState(`${betValue}`);
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipMessage, setTooltipMessage] = useState('');

    const maxbetChoice = _.find(gameConfigs.choices_maxbet, (val, key) => key === betChoice);

    const chips = [
        {
            style: "chip-1",
            value: "1",
        },
        {
            style: "chip-3",
            value: "10",
        },
        {
            style: "chip-6",
            value: "100",
        },
        {
            style: "chip-8",
            value: "500",
        },
        {
            style: "chip-13",
            value: `${maxbetChoice}`,
        },
    ];

    const payouts = [
        {
            text: t("common:payout"),
            value: numberWithCommas(parseInt(rawStake) * odd),
        },
        {
            text: "Tối thiểu",
            value: numberWithCommas(gameConfigs.minbet),
        },
        {
            text: "Tối đa",
            value: numberWithCommas(maxbetChoice),
        },
    ];

    const closeModal = () => {
        props.onCloseModal();
    };

    const addStakeByPressNumberHandler = (event: any) => {
        addStakeByChipHandler(event, event.currentTarget.innerHTML);
    };

    const addStakeByChipHandler = (event: any, stake: string) => {
        event.preventDefault();
        const totalRawStake = rawStake + stake;
        const totalStake =  parseInt(totalRawStake);
        
        if(totalStake > maxbetChoice)
        {
            setShowTooltip(true);
            setTooltipMessage("Max bet for this option is {max_bet}");
            setrawStake(`${maxbetChoice}`);
        }
        else{
            setrawStake(totalRawStake);
        }
    };

    const deleteNumberHandler = (event: any) => {
        event.preventDefault();
        setrawStake((preRawStake) => (preRawStake.length === 1 ? "0" : preRawStake.slice(0, -1)));
    };

    const placeBet = () => {
        closeModal();
        props.onPlaceBet(props.betChoiceInfo.betChoice, parseInt(rawStake));
    };

    return (
        <AdvanceModal
            title={t(GameResourceKeys.GAME_NAME)}
            subTitle={`#${roundId}`}
            isOpen={props.isOpen}
            onCloseModal={closeModal}
            type={ModalType.Bottom}
            gameId={gameSetting.id}
        >
            <div className={Styles["place-bet-container"]}>
                <div className={`w-100 ${Styles["general-info"]}`}>
                    <div className={Styles["bet-option"]}>{t(betChoice)}</div>
                    <div className={Styles["odds"]}>1:{odd}</div>
                </div>

                <div className={Styles["bet-control"]}>{numberWithCommas(parseInt(rawStake))}</div>

                {payouts.map((payout, index) => (
                    <div className={Styles["payout"]} key={index}>
                        <label>{payout.text}:</label>
                        <span className={Styles["highlight"]}>{payout.value}</span>
                    </div>
                ))}
                {showTooltip && (
                    <div className={Styles["hint-wrapper"]}>
                        <BaseDialog type={ModalType.Top}>
                            <div
                                className={`icon-close ${Styles["icon-close-hint"]}`}
                                onClick={() => {
                                    setShowTooltip(false);
                                }}
                            ></div>
                            <div className={Styles["hint-content"]}>
                                <ul className={Styles["note"]}>
                                    <li>{tooltipMessage}</li>
                                </ul>
                            </div>
                        </BaseDialog>
                    </div>
                )}

                <div className={Styles["bet-chips"]}>
                    {chips.map((chip, index) => (
                        <div
                            className={`${Styles["chip-container"]} ${Styles[chip.style]}`}
                            key={index}
                            onClick={(event) => addStakeByChipHandler(event, chip.value)}
                        >
                            <img
                                src={`/static/images/chips/${chip.style}.svg`}
                                className={`img-fluid ${Styles["chip"]}`}
                                width="63"
                                height="66"
                                alt="Chip"
                            />
                            <span className={Styles["value"]}>{chip.value == maxbetChoice ? "MAX" : `+${chip.value}`}</span>
                        </div>
                    ))}
                </div>
                <div className={Styles["bet-numbers"]}>
                    {numPad.map((pad, index) => (
                        <div
                            className={Styles["number"]}
                            onClick={pad.showValue ? addStakeByPressNumberHandler : deleteNumberHandler}
                            key={index}
                        >
                            {pad.showValue ? pad.value : <span className="icon-delete"></span>}
                        </div>
                    ))}
                </div>
                <button onClick={placeBet} className={`btn-orange w-100`} disabled={betValue <= 0}>
                    {t("common:confirm")}
                </button>
            </div>
        </AdvanceModal>
    );
};

export default PlaceBetModal;
