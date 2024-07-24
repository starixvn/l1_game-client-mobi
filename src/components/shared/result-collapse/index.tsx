import { useGameActionContext } from "../../../contexts/game-actions-context";
import Styles from "./result-collapse.module.scss";

export const ResultCollapse = () => {
    const { renderResultCollapse } = useGameActionContext();

    return <div className={Styles["header-result"]}>{renderResultCollapse()}</div>;
};
