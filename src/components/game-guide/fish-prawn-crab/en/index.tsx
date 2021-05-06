import React from "react";
import { GameGuide } from "../../../shared/game-base/type";
import { numberWithCommas } from "../../../../helpers/number-helper";

const FishPrawnCrabGuideEN: React.FC<GameGuide> = (props) => {
    const { gameConfigs, userStakeLevel, gameName } = props;
    const { odds, minbet, maxbet, choices_maxbet } = gameConfigs;
    const maxBetRound = numberWithCommas(userStakeLevel ? Math.min(userStakeLevel.maxBet, maxbet) : maxbet);
    const maxChoiceRound = numberWithCommas(choices_maxbet.crab);
    return (
        <div>
            <ul className="game-guide">
                <li className="guide-item">
                    <h2>Introduction</h2>
                    <p className="content">
                        {gameName}, also known as Hoo Hey How, is a popular game in Asia using three dice. Each dice contains six unique
                        symbols (fish, prawn, crab, rooster, gourd, and stag). There are 6 betting options available, one for each symbol.
                        Players place bets on which symbols will appear.
                    </p>
                    <div className="icon-wrapper">
                        <div className="symbol-size icon-bau"></div>
                        <div className="symbol-size icon-cua"></div>
                        <div className="symbol-size icon-tom"></div>
                        <div className="symbol-size icon-ga"></div>
                        <div className="symbol-size icon-ca"></div>
                        <div className="symbol-size icon-nai"></div>
                    </div>
                </li>
                <li className="guide-item">
                    <h2>Game Rules</h2>
                    <ul className="desc">
                        <li>The dice will be shaken and the result will be shown. If the symbol you have bet on shows up, you win.</li>
                        <li>
                            Min bet and Max bet must be between {numberWithCommas(minbet)} - {maxChoiceRound} and the maximum total stake
                            per round is {maxBetRound}
                        </li>
                        <li>
                            Payouts::
                            <ul className="detail">
                                <li>{odds.single} if the chosen symbol appears once.</li>
                                <li>{odds.double} if the chosen symbol appears twice.</li>
                                <li> {odds.triple} if the chosen symbol appears three times.</li>
                            </ul>
                        </li>
                        <li>
                            Players can bet on one or more betting options shown on the game table. Note, placed bets cannot be canceled.
                        </li>
                        <li>
                            The winning amount is calculated according to the payout ratio. Note, the Payout includes the initial stake.
                        </li>
                        <li>
                            All winning amounts are instantly added to your account balance when bets are settled.
                            <div>
                                <strong>Example:</strong>
                                <ul className="detail">
                                    <li>
                                        Betting 10 on “Fish” and having one Fish symbol turns up, then you will be paid <strong>20</strong>
                                    </li>
                                    <li>
                                        Betting 10 on “Crab” and having two Crab symbols turn up, then you will be paid <strong>35</strong>
                                    </li>
                                </ul>
                            </div>
                        </li>
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
export default FishPrawnCrabGuideEN;
