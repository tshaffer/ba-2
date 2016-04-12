/**
 * Created by tedshaffer on 4/10/16.
 */
export { Zone };

class Zone {

    name: string;

    // constructor(name: string) {
    //     this.name = name;
    // }

    static getType = function() {
    
        return "VideoOrImages";
    };
    
    constructor() {
        this.name = "";
    }

    parse(zoneAsJSON) {

        console.log("Zone::parse");
        
        let zoneAsMetadata = zoneAsJSON;

        this.name = zoneAsMetadata.name[0];
    }

}

