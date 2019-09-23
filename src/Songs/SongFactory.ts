import {SongInterface} from "./SongInterface";
import {ThirdSeptember} from "./ThirdSeptember";
import {TwentyThirdSeptember} from "./TwentyThirdSeptember";

export class SongFactory {
    static getTodaySong(): SongInterface
    {
        let date = new Date();

        // Fucking amazing world of JavaScript - 8 means September because fuck you that's why
        if (date.getMonth() != 8) {
            return null;
        }

        if (date.getDate() == 3) {
            return new ThirdSeptember();
        }

        if (date.getDate() == 23) {
            return new TwentyThirdSeptember();
        }

        return null;
    }
}