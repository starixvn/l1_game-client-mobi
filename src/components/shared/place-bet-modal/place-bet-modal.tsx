import React, { Component } from "react";
import { Translation } from "react-i18next";
import { GameResourceKeys } from "../../../common/resources";
import { DeviceContextConsumer } from "../../../contexts/device";
import { GameContext } from "../../../contexts/game-context/game-context";
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

type State = {
    betAmount: number;
    noticeKey: string;
    noticeAmount: number;
};

export default class PlaceBetModal extends Component<Props, State> {
    static contextType = GameContext;
    wrapperRef: React.RefObject<HTMLDivElement>;
    commonKeyBoard: Array<string> = ["1", "2", "3", "4", "5", "del", "6", "7", "8", "9", "0", "00"];
    specialKeyBoard: Array<string> = ["+1", "+5", "+10", "+50", "+100", "+200", "+500", "MAX"];

    constructor(props: Props) {
        super(props);

        const betAmount = 1;

        this.wrapperRef = React.createRef();

        this.state = {
            betAmount: 1,
            noticeKey: "",
            noticeAmount: 0,
        };

        this.closeModal = this.closeModal.bind(this);
    }

    componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside);
    }

    componentWillUnmountMount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    handleClickOutside = (event) => {
        if (this.props.isOpen && this.wrapperRef && this.wrapperRef.current && !this.wrapperRef.current.contains(event.target)) {
            this.closeModal();
        }
    };

    closeModal() {
        this.props.onCloseModal();
    }

    handleInputBetAmount = (event) => {
        this.updateBetAmount(event.target.value);
    };

    placeBet = () => {
        this.props.onPlaceBet(this.props.betChoiceInfo.betChoice, this.state.betAmount);
        this.closeModal();
    };

    updateBetAmount = (betAmount: number) => {
        const failedCriterion = this.validateBetAmount(betAmount);

        if (failedCriterion) {
            this.setState({
                betAmount: failedCriterion.validAmount,
                noticeKey: failedCriterion.notice.key,
                noticeAmount: failedCriterion.notice.value,
            });
        } else {
            this.setState({
                betAmount,
            });
        }
    };

    validateBetAmount = (betAmount: number) => {
        const { betChoice } = this.props.betChoiceInfo;
        const { gameConfigs, ownBets, userStakeLevel } = this.context;
        console.log(userStakeLevel);
        const { maxbet, choices_maxbet, minbet } = gameConfigs;
        const currentAmountOnChoice = ownBets[betChoice] ?? 0;
        const totalBet = Object.keys(choices_maxbet).reduce((total, choice) => total + (ownBets[choice] ?? 0), 0);
        const maxBetPerChoice = Math.min(choices_maxbet[betChoice], userStakeLevel.maxBet);
        const maxBetPerRound = Math.min(maxbet, userStakeLevel.maxBet);

        const criteria = [
            {
                failure: betAmount < minbet,
                notice: { key: "minBet", value: minbet },
                validAmount: minbet,
            },
            {
                failure: betAmount + currentAmountOnChoice > maxBetPerChoice,
                notice: { key: "maxBetChoice", value: maxBetPerChoice },
                validAmount: maxBetPerChoice - currentAmountOnChoice,
            },
            {
                failure: totalBet + betAmount > maxBetPerRound,
                notice: { key: "maxBet", value: maxBetPerRound },
                validAmount: maxBetPerRound - totalBet,
            },
        ];

        return criteria.find((criterion) => criterion.failure);
    };

    getMaxBet = () => {
        const { betChoice } = this.props.betChoiceInfo;
        const { gameConfigs } = this.context;
        const { maxbet, choices_maxbet } = gameConfigs;

        return maxbet > choices_maxbet[betChoice] ? maxbet : choices_maxbet[betChoice];
    };

    handlePressSpecificKeyBoard = (action: string) => {
        const { betAmount } = this.state;

        switch (action) {
            case "del":
                this.updateBetAmount(Math.floor(betAmount / 10));
                break;
            case "MAX":
                this.updateBetAmount(this.getMaxBet());
                break;
        }
    };

    handlePressKeyBoard = (action: string, itemKey: string) => {
        const { betAmount } = this.state;
        const amount = +itemKey;

        if (action === "add") {
            this.updateBetAmount(betAmount + amount);
        }

        if (action === "push") {
            this.updateBetAmount(betAmount * 10 ** itemKey.length + amount);
        }
    };

    renderKeyBoard = (keyBoard: Array<string>, action: string) =>
        keyBoard.map((key, index) => {
            switch (key) {
                case "del":
                    return (
                        <div key={`key-board-${index}`} className={Styles["item"]} onClick={() => this.handlePressSpecificKeyBoard(key)}>
                            <span className="icon-remove"></span>
                        </div>
                    );
                case "MAX":
                    return (
                        <div key={`key-board-${index}`} className={Styles["item"]} onClick={() => this.handlePressSpecificKeyBoard(key)}>
                            {key}
                        </div>
                    );
                default:
                    return (
                        <div key={`key-board-${index}`} className={Styles["item"]} onClick={() => this.handlePressKeyBoard(action, key)}>
                            {key}
                        </div>
                    );
            }
        });

    render() {
        const { gameName, roundId, betChoice, odd } = this.props.betChoiceInfo;
        const { betAmount, noticeKey, noticeAmount } = this.state;

        return (
            <Translation ns={[gameName.toLocaleLowerCase(), "common"]}>
                {(t) => (
                    <AdvanceModal
                        title={t(GameResourceKeys.GAME_NAME)}
                        subTitle={`#${roundId}`}
                        isOpen={this.props.isOpen}
                        onCloseModal={this.closeModal}
                        type={ModalType.Bottom}
                    >
                        <div className={Styles["place-bet-container"]}>
                            <div className={`w-100 btn-green ${Styles["bet-choice"]}`}>
                                <span className={Styles["choice-name"]}>{t(betChoice)}</span> @ 1:{odd}
                            </div>

                            {noticeKey && (
                                <div className={Styles["error-message"]}>
                                    {t(`common:${noticeKey}`).replace(`{${noticeKey}}`, noticeAmount.toString())}
                                </div>
                            )}

                            <DeviceContextConsumer>
                                {(device) => (
                                    <form className="position-relative">
                                        <input
                                            className={`${Styles["custom-form-control"]}`}
                                            value={betAmount}
                                            type={"number"}
                                            onChange={this.handleInputBetAmount}
                                            min={0}
                                            disabled={device.isMobile}
                                        />
                                        <span
                                            className={`icon-cancel ${Styles["reset-button"]}`}
                                            onClick={() => this.updateBetAmount(0)}
                                        ></span>
                                    </form>
                                )}
                            </DeviceContextConsumer>

                            <div className={Styles["bet-info"]}>
                                <div className={Styles["bet-limit"]}>Hạn mức cược: 1 - 100</div>
                                <div className={Styles["payout"]}>
                                    {t("common:payout")}: <span className={Styles["highlight"]}>{(betAmount * odd).toFixed(2)}</span>
                                </div>
                            </div>

                            <div className={Styles["keyboard"]}>
                                {/* <div className={Styles["board-common"]}>{this.renderKeyBoard(this.commonKeyBoard, "push")}</div> */}
                                <div className={Styles["board-special"]}>{this.renderKeyBoard(this.specialKeyBoard, "add")}</div>
                            </div>
                            <button onClick={this.placeBet} className="btn-orange w-100" disabled={betAmount <= 0}>
                                {t("common:bet")}
                            </button>
                        </div>
                    </AdvanceModal>
                )}
            </Translation>
        );
    }
}
