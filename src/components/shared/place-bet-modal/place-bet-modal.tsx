import React from "react";
import { useTranslation } from "next-i18next";
import { GameResourceKeys } from "../../../common/resources";
import { useGameContext } from "../../../contexts/game-context/game-context";
import { useSystemContext } from "../../../contexts/system";
import { numberWithCommas } from "../../../helpers/NumberHelper";
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
    const gameContext = useGameContext();
    const systemContext = useSystemContext();
    const { t } = useTranslation([gameContext.gameSetting.gameName.toLocaleLowerCase(), "common"]);
    const { roundId } = gameContext;
    const { betValue } = systemContext;
    const { betChoice, odd } = props.betChoiceInfo;

    const closeModal = () => {
        props.onCloseModal();
    };

    const placeBet = () => {
        props.onPlaceBet(props.betChoiceInfo.betChoice, betValue);
        closeModal();
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
                <div className={`w-100 btn-green ${Styles["general-info"]}`}>
                    <span className="font-weight-bold">{t(betChoice)}</span> @1:{odd}
                </div>

                <div className={Styles["stake"]}>
                    <label>{t("common:stake")}:</label> <span className={Styles["highlight"]}>{betValue}</span>
                </div>
                <div className={Styles["payout"]}>
                    <label>{t("common:payout")}:</label> <span className={Styles["highlight"]}>{numberWithCommas(betValue * odd)}</span>
                </div>
                <p className={Styles["confirm-text"]}>{t("common:confirmBetAutomatic")}</p>
                <div className={Styles["actions"]}>
                    <button onClick={closeModal} className="btn-grey" disabled={betValue <= 0}>
                        {t("common:cancel")}
                    </button>
                    <button onClick={placeBet} className="btn-orange" disabled={betValue <= 0}>
                        {t("common:confirm")}
                    </button>
                </div>
            </div>
        </AdvanceModal>
    );
};

export default PlaceBetModal;
