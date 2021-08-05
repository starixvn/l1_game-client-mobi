import React from "react";
import styles from "./game-category.module.scss";
import { GameCategoryConfig, GameCategoryKeys, GameCategoryType, GamesInOnePageOnDesktop } from "./constants";
import { isMobileOnly } from "react-device-detect";
import { useTranslation } from "next-i18next";

export const GameCategory: React.FC<{ selectedCategory: GameCategoryType; selectCategoryPage: Function; favoriteGames: number[] }> = ({
    selectedCategory,
    selectCategoryPage,
    favoriteGames,
}) => {
    const { t } = useTranslation();

    const categoryPage = GameCategoryKeys.reduce((result, category) => {
        const categoryLength = category !== "favorite" ? GameCategoryConfig[category].length : favoriteGames.length;

        result[category] = Math.ceil(categoryLength / GamesInOnePageOnDesktop);

        return result;
    }, {});

    const renderPagingCategory = (category: string, numOfPages: number) => {
        const result = [];

        for (let i = 0; i < numOfPages; i++) {
            result.push(
                <span onClick={() => selectCategoryPage(category, i + 1)} className={styles["category-page"]}>
                    [{i + 1}]
                </span>
            );
        }

        return result;
    };

    return (
        <div className={styles["game-container"]}>
            <ul className={styles["game-category"]}>
                {GameCategoryKeys.map((categoryKey) => (
                    <li
                        className={`${styles["category"]} ${selectedCategory === GameCategoryType[categoryKey] ? styles["selected"] : ""}`}
                        key={categoryKey}
                    >
                        <div className={styles["category-text"]} onClick={() => selectCategoryPage(categoryKey, 1)}>
                            {t(`category-${categoryKey}`)}
                        </div>
                        {!isMobileOnly && categoryPage[categoryKey] > 1 && renderPagingCategory(categoryKey, categoryPage[categoryKey])}
                    </li>
                ))}
            </ul>
        </div>
    );
};
