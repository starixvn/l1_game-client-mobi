import { useTranslation } from "next-i18next";
import React from "react";

import { GameResourceKeys } from "../../../common/resources";
import { useGameContext } from "../../../contexts/game-context/game-context";
import { useSystemContext } from "../../../contexts/system";
import { numberWithCommas } from "../../../helpers/number-helper";
import AdvanceModal from "../advance-modal";
import { ModalType } from "../base-dialog/type";
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
    const { roundId, gameSetting } = useGameContext();
    const { betValue } = useSystemContext();
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
        >
            <div className={Styles["place-bet-container"]}>
                <div className={`w-100 ${Styles["general-info"]}`}>
                    <div className={Styles["left"]}>
                        <span className="font-weight-bold">{t(betChoice)}</span>@1:{odd}
                    </div>
                    <span className={Styles["highlight"]}>{numberWithCommas(betValue)}</span>
                </div>

                <div className={Styles["payout"]}>
                    <label>{t("common:payout")}:</label> <span className={Styles["highlight"]}>{numberWithCommas(betValue * odd)}</span>
                </div>
                <p className={Styles["confirm-text"]}>{t("common:confirmBetAutomatic")}</p>
                <div className={Styles["actions"]}>
                    <button name="cancel" onClick={closeModal} className="btn-grey" disabled={betValue <= 0}>
                        {t("common:cancel")}
                    </button>
                    <button name="confirm" onClick={placeBet} className="btn-orange" disabled={betValue <= 0}>
                        {t("common:confirm")}
                    </button>
                </div>
            </div>
        </AdvanceModal>
    );
};

export default PlaceBetModal;
