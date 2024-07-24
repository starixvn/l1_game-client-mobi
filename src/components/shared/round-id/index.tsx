import { useGameContext } from "../../../contexts/game-context/game-context";

export const RoundId = () => {
    const { roundId } = useGameContext();
    return (
        <div className="roundId" key={roundId}>
            {roundId > 0 ? `#${roundId}` : ""}
        </div>
    );
};
