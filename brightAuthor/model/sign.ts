/**
 * Created by tedshaffer on 4/10/16.
 */
class Sign {

    name: string;
    model: string;
    videoMode: string;

    // zoneList: Object[];
    
    // constructor(name: string) {
    //     this.name = name;
    // }

    constructor() {
        this.name = "";
    }

    parse(signAsJSON) {

        let sign = signAsJSON.BrightAuthor;
        let signMetadata = sign.meta[0];
        // this.zoneList = sign.zones;

        this.name = signMetadata.name[0];
        this.model = signMetadata.model[0];
        this.videoMode = signMetadata.videoMode[0];
    }

}

