import React from "react";
import { GameGuide } from "../../../shared/game-base/type";
import { numberWithCommas } from "../../../../helpers/number-helper";
import { SedDieNameMapping, SedDieName } from "../index";
import Styles from "../../../shared/round-history/dot/dot.module.scss";

const SeDieGuideEN: React.FC<GameGuide> = (props) => {
    const { gameConfigs, userStakeLevel, gameName, gameId } = props;
    const { odds, choices_maxbet, minbet, maxbet } = gameConfigs;
    const maxBetStake = userStakeLevel.maxBet;
    const maxBetMain = numberWithCommas(Math.min(maxBetStake, maxbet, choices_maxbet.even));
    const maxBetRed4 = numberWithCommas(Math.min(maxBetStake, maxbet, choices_maxbet.red4));
    const maxBetRed3 = numberWithCommas(Math.min(maxBetStake, maxbet, choices_maxbet.red3));
    const maxBetRed2 = numberWithCommas(Math.min(maxBetStake, maxbet, choices_maxbet.red2));
    const maxBetRound = numberWithCommas(Math.min(maxBetStake, maxbet, maxbet));
    return (
        <div>
            <ul className="game-guide">
                <li className="guide-item">
                    <h2>Introduction</h2>
                    <p className="content">
                        {gameName}{" "}
                        {SedDieNameMapping[gameId] === SedDieName.VipSeDie
                            ? " is another version of the Se Die game with higher betting limits. "
                            : "is a popular game in Asian countries. "}
                        The game is played with 4 colored buttons, each button has two sides colored in red and white. The objective of this
                        game is to predict the outcome of 4 buttons. If the outcome matches the player’s bet, the player wins.
                    </p>
                </li>
                <li className="guide-item">
                    <h2>Game Rules</h2>
                    <ul className="desc">
                        <li>
                            Buttons are placed on the plate and covered with a bowl. The dealer will pick up the plate and shake it when the
                            plate is still covered with the bowl. The players place their bets and the betting options are:
                        </li>

                        <li className="contentBeforeEmpty">
                            <div className="table-container">
                                <table className="table text-center">
                                    <thead>
                                        <tr>
                                            <th>Options</th>
                                            <th>Winning Conditions</th>
                                            <th>Descriptions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td rowSpan={2}>ODD</td>
                                            <td>3 red, 1 white </td>
                                            <td>
                                                <div className="dots-container">
                                                    <span className={Styles["dot-odd"]}></span>
                                                    <span className={Styles["dot-odd"]}></span>
                                                    <span className={Styles["dot-odd"]}></span>
                                                    <span className={Styles["dot-even"]}></span>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>1 red, 3 white</td>
                                            <td>
                                                <div className="dots-container">
                                                    <span className={Styles["dot-odd"]}></span>
                                                    <span className={Styles["dot-even"]}></span>
                                                    <span className={Styles["dot-even"]}></span>
                                                    <span className={Styles["dot-even"]}></span>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td rowSpan={3}>EVEN</td>
                                            <td>4 red</td>
                                            <td>
                                                <div className="dots-container">
                                                    <span className={Styles["dot-odd"]}></span>
                                                    <span className={Styles["dot-odd"]}></span>
                                                    <span className={Styles["dot-odd"]}></span>
                                                    <span className={Styles["dot-odd"]}></span>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>4 white</td>
                                            <td>
                                                <div className="dots-container">
                                                    <span className={Styles["dot-even"]}></span>
                                                    <span className={Styles["dot-even"]}></span>
                                                    <span className={Styles["dot-even"]}></span>
                                                    <span className={Styles["dot-even"]}></span>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>2 red, 2 white</td>
                                            <td>
                                                <div className="dots-container">
                                                    <span className={Styles["dot-odd"]}></span>
                                                    <span className={Styles["dot-odd"]}></span>
                                                    <span className={Styles["dot-even"]}></span>
                                                    <span className={Styles["dot-even"]}></span>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>4 red</td>
                                            <td>4 red</td>
                                            <td>
                                                <div className="dots-container">
                                                    <span className={Styles["dot-odd"]}></span>
                                                    <span className={Styles["dot-odd"]}></span>
                                                    <span className={Styles["dot-odd"]}></span>
                                                    <span className={Styles["dot-odd"]}></span>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>4 white</td>
                                            <td>4 white</td>
                                            <td>
                                                <div className="dots-container">
                                                    <span className={Styles["dot-even"]}></span>
                                                    <span className={Styles["dot-even"]}></span>
                                                    <span className={Styles["dot-even"]}></span>
                                                    <span className={Styles["dot-even"]}></span>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>3 red, 1 white</td>
                                            <td>3 red, 1 white</td>
                                            <td>
                                                <div className="dots-container">
                                                    <span className={Styles["dot-odd"]}></span>
                                                    <span className={Styles["dot-odd"]}></span>
                                                    <span className={Styles["dot-odd"]}></span>
                                                    <span className={Styles["dot-even"]}></span>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>1 red, 3 white</td>
                                            <td>1 red, 3 white</td>
                                            <td>
                                                <div className="dots-container">
                                                    <span className={Styles["dot-odd"]}></span>
                                                    <span className={Styles["dot-even"]}></span>
                                                    <span className={Styles["dot-even"]}></span>
                                                    <span className={Styles["dot-even"]}></span>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>2 red, 2 white</td>
                                            <td>2 red, 2 white</td>
                                            <td>
                                                <div className="dots-container">
                                                    <span className={Styles["dot-odd"]}></span>
                                                    <span className={Styles["dot-odd"]}></span>
                                                    <span className={Styles["dot-even"]}></span>
                                                    <span className={Styles["dot-even"]}></span>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </li>
                        <li>Once the betting time has expired, the dealer removes the bowl from the plate and the result will be shown.</li>
                        <li>
                            Players can bet on one or more betting options shown on the game table. All bets must be placed before the
                            betting time expires. Note, placed bets cannot be canceled.
                        </li>
                        <li>The maximum total stake per round is {maxBetRound}</li>
                    </ul>
                </li>
                <li className="guide-item">
                    <h2>Payout</h2>
                    <ul className="desc">
                        <li>
                            The winning amount is calculated according to the payout ratio. Note, the Payout includes the initial stake.
                        </li>
                        <li>
                            All winning amounts are instantly added to your account balance when bets are settled.
                            <div className="table-container">
                                <table className="table text-center">
                                    <thead>
                                        <tr>
                                            <th>Options</th>
                                            <th>Payouts</th>
                                            <th>
                                                Bet Limit <br /> (Min - Max)
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>ODD</td>
                                            <td rowSpan={2}>1:{odds.even}</td>
                                            <td rowSpan={2}>
                                                {minbet} - {maxBetMain}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>EVEN</td>
                                        </tr>
                                        <tr>
                                            <td>4 red</td>
                                            <td rowSpan={2}>1:{odds.red4}</td>

                                            <td rowSpan={2}>
                                                {minbet} - {maxBetRed4}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>4 white</td>
                                        </tr>
                                        <tr>
                                            <td>3 red, 1 white</td>
                                            <td rowSpan={2}>1:{odds.red3}</td>
                                            <td rowSpan={2}>
                                                {minbet} - {maxBetRed3}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>1 red, 3 white</td>
                                        </tr>
                                        <tr>
                                            <td>2 red, 2 white</td>
                                            <td>1:{odds.red2}</td>
                                            <td>
                                                {minbet} - {maxBetRed2}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </li>
                    </ul>
                </li>
                <li className="guide-item">
                    <h2>Statistical Table</h2>
                    <div className="table-container">
                        <table className="table text-center">
                            <thead>
                                <tr>
                                    <th>Results</th>
                                    <th>Descriptions</th>
                                    <th>Symbols</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>4 red</td>
                                    <td>
                                        <div className="dots-container">
                                            <span className={Styles["dot-odd"]}></span>
                                            <span className={Styles["dot-odd"]}></span>
                                            <span className={Styles["dot-odd"]}></span>
                                            <span className={Styles["dot-odd"]}></span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="d-flex justify-content-center">
                                            <span className={Styles["dot-even"]}>4</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>4 white</td>
                                    <td>
                                        <div className="dots-container">
                                            <span className={Styles["dot-even"]}></span>
                                            <span className={Styles["dot-even"]}></span>
                                            <span className={Styles["dot-even"]}></span>
                                            <span className={Styles["dot-even"]}></span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="d-flex justify-content-center">
                                            <span className={Styles["dot-even"]}>0</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>2 red, 2 white</td>
                                    <td>
                                        <div className="dots-container">
                                            <span className={Styles["dot-odd"]}></span>
                                            <span className={Styles["dot-odd"]}></span>
                                            <span className={Styles["dot-even"]}></span>
                                            <span className={Styles["dot-even"]}></span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="d-flex justify-content-center">
                                            <span className={Styles["dot-even"]}>2</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>3 red, 1 white</td>
                                    <td>
                                        <div className="dots-container">
                                            <span className={Styles["dot-odd"]}></span>
                                            <span className={Styles["dot-odd"]}></span>
                                            <span className={Styles["dot-odd"]}></span>
                                            <span className={Styles["dot-even"]}></span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="d-flex justify-content-center">
                                            <span className={Styles["dot-odd"]}>3</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>1 red, 3 white</td>
                                    <td>
                                        <div className="dots-container">
                                            <span className={Styles["dot-odd"]}></span>
                                            <span className={Styles["dot-even"]}></span>
                                            <span className={Styles["dot-even"]}></span>
                                            <span className={Styles["dot-even"]}></span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="d-flex justify-content-center">
                                            <span className={Styles["dot-odd"]}>1</span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </li>
                <li className="guide-item">
                    <h2>Terms and Conditions</h2>
                    <ul className="game-rules">
                        <li className="rule">
                            The Company reserves the right to cancel or void any bets because of a force majeure event including but not
                            limited to any technical errors, network service failures, power failures.
                        </li>
                        <li className="rule">
                            The Company reserves the right to cancel or void any bets of players we believe to be involved in fraud, money
                            laundering, or any other form of illegal or suspicious activities.
                        </li>
                        <li className="rule">
                            The Company reserves the right to cancel or void any bets when there is an error (caused by human or any other
                            factors), or a system failure resulting in an incorrect payout ratio.
                        </li>
                        <li className="rule">
                            All accepted bets will still be effective even if the member subsequently logs out or is disconnected from the
                            site for any reason.
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    );
};
export default SeDieGuideEN;
