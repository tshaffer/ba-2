/**
 * Created by tedshaffer on 4/11/16.
 */
import { Zone } from "./zone";
export { VideoOrImagesZone };

class VideoOrImagesZone extends Zone {

    imageMode: string;

    constructor() {
        super();
        this.imageMode = "unknown";
    }

    parse(zoneAsJSON) {

        console.log("VideoOrImagesZone::parse");

        super.parse(zoneAsJSON);

        let zoneAsMetadata = zoneAsJSON;

    }

}