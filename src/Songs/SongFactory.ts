import {SongInterface} from "./SongInterface";
import {ThirdSeptember} from "./ThirdSeptember";
import {TwentyThirdSeptember} from "./TwentyThirdSeptember";

export class SongFactory {
    static getTodaySong(): SongInterface
    {
        let date = new Date();
        if (date.getMonth() != 9) {
            return null;
        }

        if (date.getDay() == 3) {
            return new ThirdSeptember();
        }

        if (date.getDay() == 23) {
            return new TwentyThirdSeptember();
        }

        return null;
    }
}