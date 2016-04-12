/**
 * Created by tedshaffer on 4/10/16.
 */
import { Zone } from "./zones/zone";

class Sign {

    name: string;
    model: string;
    videoMode: string;
    zoneList: Object[];

    // constructor(name: string) {
    //     this.name = name;
    // }

    constructor() {
        this.name = "";
    }

    parse(signAsJSON) {

        let sign = signAsJSON.BrightAuthor;
        let signMetadata = sign.meta[0];

        this.name = signMetadata.name[0];
        this.model = signMetadata.model[0];
        this.videoMode = signMetadata.videoMode[0];
        this.zoneList = [];

        let self = this;
        // TODO correct parsing for multiple zones
        sign.zones.forEach( function(zoneAsJSONArray){
            let zoneAsJSON = zoneAsJSONArray.zone[0];
            var zone = new Zone();
            zone.parse(zoneAsJSON);
            self.zoneList.push(zone);
        });
    }
}

