import React, { useEffect, useRef } from "react";
import styles from "./game-category.module.scss";
import { GameCategoryConfig, GameCategoryKeys, GameCategoryType, GamesInOnePage } from "./constants";
import { useTranslation } from "next-i18next";

const renderPagingCategory = (
    category: string,
    numOfPages: number,
    selectedCategory: GameCategoryType,
    selectedPage: number,
    onSelectPage: Function
) => {
    const result = [];

    for (let i = 0; i < numOfPages; i++) {
        result.push(
            <span
                onClick={() => onSelectPage(category, i + 1)}
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

export const GameCategory: React.FC<{
    selectedCategory: GameCategoryType;
    selectedPage: number;
    selectCategoryPage: Function;
    favoriteGames: number[];
}> = ({ selectedCategory, selectCategoryPage, favoriteGames, selectedPage }) => {
    const { t } = useTranslation();
    const wrapperRef = useRef<HTMLDivElement>(null);
    const selectedTabRef = useRef<HTMLLIElement>(null);

    const categoryPage = GameCategoryKeys.reduce((result, category) => {
        const categoryLength = category !== "favorite" ? GameCategoryConfig[category].length : favoriteGames.length;

        result[category] = Math.ceil(categoryLength / GamesInOnePage);

        return result;
    }, {});

    useEffect(() => {
        if (selectedTabRef?.current) {
            const boundingRect = selectedTabRef.current.getBoundingClientRect();
            wrapperRef.current.scrollLeft = boundingRect.left - 15;
        }
    }, [wrapperRef?.current]);

    return (
        <div ref={wrapperRef} className={styles["category-container"]}>
            <ul className={styles["category-list"]}>
                {GameCategoryKeys.map((categoryKey) => (
                    <li
                        className={`${styles["category-item"]} 
                            ${selectedCategory === GameCategoryType[categoryKey] ? styles["selected"] : ""}
                        `}
                        key={categoryKey}
                        ref={selectedCategory === GameCategoryType[categoryKey] ? selectedTabRef : null}
                    >
                        <div className="d-flex">
                            <div className={styles["category-text"]} onClick={() => selectCategoryPage(categoryKey, 1)}>
                                {t(`category-${categoryKey}`)}
                            </div>
                            {categoryPage[categoryKey] > 1 && (
                                <div className={styles["paging-container"]}>
                                    {renderPagingCategory(
                                        categoryKey,
                                        categoryPage[categoryKey],
                                        selectedCategory,
                                        selectedPage,
                                        selectCategoryPage
                                    )}
                                </div>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};
