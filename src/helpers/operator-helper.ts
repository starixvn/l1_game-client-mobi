import { getLocalStorageItem, localStorageKeys, storeLocalStorageItem } from "../common/local-storage";

/**
 * Gets operator from query parameter or localStorage
 * Query parameter takes precedence and is converted to uppercase
 * @param queryOperator - operator from URL query parameter
 * @returns uppercase operator string or localStorage value
 */
export const getOperator = (queryOperator?: string): string | null => {
    if (queryOperator) {
        const operator = queryOperator.toUpperCase();
        storeLocalStorageItem(localStorageKeys.operator, operator);
        
        return operator;
    }

    return getLocalStorageItem(localStorageKeys.operator);
}; 