import React from "react";
import { GameGuide } from "../../../shared/game-base/type";
import { numberWithCommas } from "../../../../helpers/number-helper";

const BigSmallGuideEN: React.FC<GameGuide> = (props) => {
    const { gameConfigs, userStakeLevel, gameName } = props;
    const { odds, minbet, maxbet } = gameConfigs;
    const maxBetRound = numberWithCommas(Math.min(userStakeLevel.maxBet, maxbet));
    return (
        <div>
            <ul className="game-guide">
                <li className="guide-item">
                    <h2>Introduction</h2>
                    <p className="content">
                        {gameName} or commonly known as Sicbo or Tai Sai, is a game played with three dice. The players place bets and
                        predict the total points of the three dice is BIG or SMALL.
                    </p>
                </li>
                <li className="guide-item">
                    <h2>Game Rules</h2>
                    <ul className="desc">
                        <li>The players can bet on either BIG or SMALL, but not on both.</li>
                        <ul className="detail">
                            <li>BIG: the player will win if the total points of three dice &gt;= 11</li>
                            <li>SMALL: the player will win if the total points of the three dice &lt;= 10</li>
                        </ul>
                        <li>
                            Make sure you bet an amount you’re comfortable with. Click Confirm to complete or Cancel button if you want to
                            reset all your bets.
                        </li>
                        <li>
                            Players can increase their stake amount by placing another bet with the same selection before the betting time
                            expires.
                        </li>
                        <li>
                            Min bet and Max bet must be between {numberWithCommas(minbet)} - {numberWithCommas(maxbet)} and the maximum
                            total stake per round is {maxBetRound}
                        </li>
                        <li>
                            The dice will be shaken and the result will be shown. If the outcome of three dice matches your bet, you win.
                        </li>
                        <li>
                            If the total amounts bet on BIG and SMALL are different then the gap amount will be refunded to the players who
                            have the latest bet ticket.
                            <p>
                                <strong>Example:</strong> Player A bets 100 on BIG, player B bets 40 on SMALL, and C bets 80 on SMALL. To
                                balance the total amounts bet on BIG and SMALL, the system will refund 20 to player C.
                            </p>
                        </li>
                    </ul>
                </li>
                <li className="guide-item">
                    <h2>Payouts</h2>
                    <ul className="desc">
                        <li>The payout on Big, Small is 1: {odds.big}</li>
                        <li>
                            The winning amount is calculated according to the payout ratio. <strong>Note</strong>, the Payout includes the
                            initial stake.
                        </li>
                        <li>All winning amounts are instantly added to your account balance when bets are settled.</li>
                    </ul>
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
export default BigSmallGuideEN;
