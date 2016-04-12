/**
 * Created by tedshaffer on 4/10/16.
 */
class Zone {

    name: string;

    // constructor(name: string) {
    //     this.name = name;
    // }

    constructor() {
        this.name = "";
    }

    parse(zoneAsJSON) {

        console.log("pizzza");
        
        let zoneAsMetadata = zoneAsJSON;

        this.name = zoneAsMetadata.name[0];

    }

}

export  { Zone };

