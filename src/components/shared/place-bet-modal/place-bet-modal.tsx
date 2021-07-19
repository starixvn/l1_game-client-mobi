import { useTranslation } from "next-i18next";
import React from "react";

import { GameResourceKeys } from "../../../common/resources";
import { getSessionStorageItem, SessionStorageKeys } from "../../../common/session-storage";
import { useGameContext } from "../../../contexts/game-context/game-context";
import { numberWithCommas } from "../../../helpers/number-helper";
import AdvanceModal from "../advance-modal";
import { ModalType } from "../base-dialog/type";
import { QuickBetStorage } from "../bet-settings/type";
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

const quickBetStorageKey = SessionStorageKeys.quickBet;

const PlaceBetModal: React.FC<Props> = (props) => {
    const { roundId, gameSetting } = useGameContext();
    const quickBetStorage = getSessionStorageItem<QuickBetStorage>(quickBetStorageKey) ?? {};
    const betValue = quickBetStorage[gameSetting.id]?.betStake;
    const { t } = useTranslation([gameSetting.gameName.toLocaleLowerCase(), "common"]);
    const { betChoice, odd } = props.betChoiceInfo;

    const closeModal = () => {
        props.onCloseModal();
    };

    const placeBet = () => {
        closeModal();
        props.onPlaceBet(props.betChoiceInfo.betChoice, betValue);
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
                <div className={Styles["bet-control"]}>{numberWithCommas(betValue)}</div>

                <div className={Styles["payout"]}>
                    <label>{t("common:payout")}:</label> <span className={Styles["highlight"]}>{numberWithCommas(betValue * odd)}</span>
                </div>
                <div className={Styles["payout"]}>
                    <label>Tối thiểu:</label> <span className={Styles["highlight"]}>{numberWithCommas(1)}</span>
                </div>
                <div className={Styles["payout"]}>
                    <label>Tối đa:</label> <span className={Styles["highlight"]}>{numberWithCommas(2000)}</span>
                </div>
                <div className={Styles["bet-chips"]}>
                    <div className={`${Styles["chip-container"]} ${Styles["chip-1"]}`}>
                        <img
                            src={`/static/images/chips/chip-1.svg`}
                            className={`img-fluid ${Styles["chip"]}`}
                            width="63"
                            height="66"
                            alt="Chip"
                        />
                        <span className={Styles["value"]}>+1</span>
                    </div>
                    <div className={`${Styles["chip-container"]} ${Styles["chip-3"]}`}>
                        <img
                            src={`/static/images/chips/chip-3.svg`}
                            className={`img-fluid ${Styles["chip"]}`}
                            width="63"
                            height="66"
                            alt="Chip"
                        />
                        <span className={Styles["value"]}>+10</span>
                    </div>

                    <div className={`${Styles["chip-container"]} ${Styles["chip-6"]}`}>
                        <img
                            src={`/static/images/chips/chip-6.svg`}
                            className={`img-fluid ${Styles["chip"]}`}
                            width="63"
                            height="66"
                            alt="Chip"
                        />
                        <span className={Styles["value"]}>+100</span>
                    </div>
                    <div className={`${Styles["chip-container"]} ${Styles["chip-8"]}`}>
                        <img
                            src={`/static/images/chips/chip-8.svg`}
                            className={`img-fluid ${Styles["chip"]}`}
                            width="63"
                            height="66"
                            alt="Chip"
                        />
                        <span className={Styles["value"]}>+500</span>
                    </div>
                    <div className={`${Styles["chip-container"]} ${Styles["chip-13"]}`}>
                        <img
                            src={`/static/images/chips/chip-13.svg`}
                            className={`img-fluid ${Styles["chip"]}`}
                            width="63"
                            height="66"
                            alt="Chip"
                        />
                        <span className={Styles["value"]}>MAX</span>
                    </div>
                </div>
                <div className={Styles["bet-numbers"]}>
                    <div className={Styles["number"]}>1</div>
                    <div className={Styles["number"]}>2</div>
                    <div className={Styles["number"]}>3</div>
                    <div className={Styles["number"]}>4</div>
                    <div className={Styles["number"]}>5</div>
                    <div className={Styles["number"]}>
                        <span className="icon-delete"></span>
                    </div>
                    <div className={Styles["number"]}>6</div>
                    <div className={Styles["number"]}>7</div>
                    <div className={Styles["number"]}>8</div>
                    <div className={Styles["number"]}>9</div>
                    <div className={Styles["number"]}>0</div>
                    <div className={Styles["number"]}>00</div>
                </div>
                <button onClick={placeBet} className={`btn-orange w-100`} disabled={betValue <= 0}>
                    {t("common:confirm")}
                </button>
            </div>
        </AdvanceModal>
    );
};

export default PlaceBetModal;
