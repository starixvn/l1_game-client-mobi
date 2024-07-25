import { useTranslation } from "next-i18next";

import { GameResourceKeys } from "../../../common/resources";
import { useGameContext } from "../../../contexts/game-context/game-context";
import Styles from "./game-header.module.scss";

export const GameName = () => {
    const { gameSetting } = useGameContext();

    const { gameName } = gameSetting;

    const { t } = useTranslation([gameName.toLowerCase()]);

    return <div className={Styles["game-name"]}>{t(GameResourceKeys.GAME_NAME)}</div>;
};
