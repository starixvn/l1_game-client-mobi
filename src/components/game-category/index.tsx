import React from "react";
import styles from "./game-category.module.scss";
import { GameCategoryConfig, GameCategoryKeys, GameCategoryType, GamesInOnePageOnDesktop } from "./constants";
import { isMobileOnly } from "react-device-detect";
import { useTranslation } from "next-i18next";

export const GameCategory: React.FC<{
    selectedCategory: GameCategoryType;
    selectedPage: number;
    selectCategoryPage: Function;
    favoriteGames: number[];
}> = ({ selectedCategory, selectCategoryPage, favoriteGames, selectedPage }) => {
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
                <span
                    onClick={() => selectCategoryPage(category, i + 1)}
                    className={`${styles["category-page"]} ${
                        GameCategoryType[category] === selectedCategory && selectedPage - 1 === i ? styles["selected"] : ""
                    }`}
                    key={i}
                >
                    {i + 1}
                </span>
            );
        }

        return result;
    };

    return (
        <div className={styles["category-container"]}>
            <ul className={styles["category-list"]}>
                {GameCategoryKeys.map((categoryKey) => (
                    <li
                        className={`${styles["category-item"]} 
                            ${selectedCategory === GameCategoryType[categoryKey] ? styles["selected"] : ""}
                            ${categoryPage[categoryKey] ? styles["disabled"] : ""}
                        `}
                        key={categoryKey}
                    >
                        <div className="d-flex">
                            <div
                                className={styles["category-text"]}
                                onClick={() => categoryPage[categoryKey] && selectCategoryPage(categoryKey, 1)}
                            >
                                {t(`category-${categoryKey}`)}
                            </div>
                            {!isMobileOnly && categoryPage[categoryKey] > 1 && (
                                <div className={styles["paging-container"]}>
                                    {renderPagingCategory(categoryKey, categoryPage[categoryKey])}
                                </div>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};
