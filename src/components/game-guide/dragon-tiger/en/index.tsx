import React from "react";
import { GameGuide } from "../../../shared/game-base/type";
import { numberWithCommas } from "../../../../helpers/number-helper";

const DragonTigerGuideEN: React.FC<GameGuide> = (props) => {
    const { gameConfigs, userStakeLevel, gameName } = props;
    const { odds, minbet, maxbet, choices_maxbet } = gameConfigs;
    const maxBetRound = numberWithCommas(userStakeLevel ? Math.min(userStakeLevel.maxBet, maxbet) : maxbet);
    return (
        <div>
            <ul className="game-guide">
                <li className="guide-item">
                    <h2>Introduction</h2>
                    <p className="content">
                        {gameName} is a simple card game similar to Baccarat. The game is played with one standard 52-cards deck (excluding
                        Joker). There are 3 betting options Dragon, Tiger, and Tie.
                    </p>
                </li>
                <li className="guide-item">
                    <h2>Game Rules</h2>
                    <ul className="desc">
                        <li>Two cards are drawn, one for the Dragon and one for the Tiger. </li>
                        <li>
                            The players bet on Dragon or Tiger which one will win with the higher value card. The players can also bet on
                            “Tie” option if they predict Dragon and Tiger will have the same value card, irrespective of suit.
                        </li>
                        <li>
                            The game determines the win or loss by comparing the point of the card instead of its suit. K is the maximum,
                            while Ace is the minimum.
                        </li>
                        <li>
                            Card’s point values:
                            <ul className="detail">
                                <li>
                                    The ranking of cards from the lowest to the highest is as follows: Ace, 2, 3, 4, 5, 6, 7, 8, 9, 10,
                                    Jack, Queen, and King.
                                </li>
                                <li>
                                    Ace stands for 1 point; Jack is 11 points; Queen stands for 12 points and King is 13 points. The rest of
                                    the cards (2 to 10) are counted at face value.
                                </li>
                            </ul>
                        </li>
                        <li>
                            Players can bet on one or more betting options shown on the game table. All bets must be placed before the
                            betting time expires. Note, placed bets cannot be canceled.
                        </li>
                        <li>The standard deck with 52 cards (excluding Joker) is shuffled after every round.</li>
                    </ul>
                </li>
                <li className="guide-item">
                    <h2>Payouts </h2>
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
                                            <th>Max Total Stake Per Round</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Dragon</td>
                                            <td rowSpan={2}>1:{odds.dragon}</td>
                                            <td rowSpan={2}>
                                                {minbet} - {numberWithCommas(choices_maxbet.dragon)}
                                            </td>
                                            <td rowSpan={3}>{maxBetRound}</td>
                                        </tr>
                                        <tr>
                                            <td>Tiger</td>
                                        </tr>
                                        <tr>
                                            <td>Tie</td>
                                            <td>1:{odds.tie}</td>
                                            <td>
                                                {minbet} - {numberWithCommas(choices_maxbet.tie)}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <strong>Note</strong>:The players bet on Dragon or Tiger will lose 50% of their stake if the result is a draw.
                        </li>
                    </ul>
                </li>
                <li className="guide-item">
                    <h2> Terms and Conditions</h2>
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
export default DragonTigerGuideEN;
