import { useTranslation } from "next-i18next";
import { useGameContext } from "../../../contexts/game-context/game-context";
import { GameResourceKeys } from "../../../common/resources";

export const GameName = () => {
    const { gameSetting } = useGameContext();

    const { gameName } = gameSetting;

    const { t } = useTranslation([gameName.toLowerCase()]);

    return <div>{t(GameResourceKeys.GAME_NAME)}</div>;
};
