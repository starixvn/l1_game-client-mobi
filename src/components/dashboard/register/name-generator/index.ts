import { new_202010 } from "./name-dictionaries/202010_new";
import { animals } from "./name-dictionaries/animals";
import { colors } from "./name-dictionaries/colors";
import { cools } from "./name-dictionaries/cools";
import { fruits } from "./name-dictionaries/fruits";
import { marvels } from "./name-dictionaries/marvels";
import { uniqueNamesGenerator } from "unique-names-generator";
import { randomInteger } from "../../../../helpers/number-helper";

export default class NameGenerator {
    public static generateName(): string {
        const dictionaries = [colors, animals, marvels, fruits, cools, new_202010];

        const randomDictionaryIndex = randomInteger(0, dictionaries.length - 1);
        const pickedDictionary = dictionaries[randomDictionaryIndex];

        const shortName = uniqueNamesGenerator({
            dictionaries: [pickedDictionary],
            separator: "",
            length: 1,
        });

        const numberLength = shortName.length < 10 ? 5 : 14 - shortName.length;
        let maxNumber = "";
        for (let i = 0; i < numberLength; i++) {
            maxNumber = `9${maxNumber}`;
        }
        const randomNumber = randomInteger(0, +maxNumber);

        return `${shortName}${randomNumber}`;
    }
}
