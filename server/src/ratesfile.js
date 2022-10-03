const { readFile } = require('fs/promises');

class RatesFile {
    
    constructor() {}

    // load the json file (asynchronous)
    async load(path) {
        this.json = JSON.parse(await readFile(path));
    }

    // refactor the rates into easier to use objects
    refactor() {
        let json = this.json;
        let dates = Object.keys(json);
        dates.map((date) => {
            let rates = Object.keys(json[date].rates);
            rates.map((rate) => {
                json[date].rates[rate] = { pair: json[date].base + '/' + rate, current: json[date].rates[rate] };
            });
        });
    }

    // enrich the rates to add percentage and largest positive/negative changes
    // roll forward each dates current to the next previous
    // it is assumed here the dates have already been ordered in the file
    enrich() {
        let json = this.json;
        let dates = Object.keys(json);
        dates.map((date, i) => {
            let rates = Object.keys(json[date].rates);
            let minkey = null, minval = 0, maxkey = null, maxval = 0;
            rates.map((rate) => {
                let obj = json[date].rates[rate];
                // change
                obj.change = obj.previous > 0 ? (obj.current / obj.previous - 1) * 100 : 0;
                // minmax
                obj.minmax = 0;
                if (obj.change < minval) {
                    minkey = rate;
                    minval = obj.change;
                }
                if (obj.change > maxval) {
                    maxkey = rate;
                    maxval = obj.change;
                }
                // next previous
                if (i < dates.length - 1) {
                    json[dates[i + 1]].rates[rate].previous = json[date].rates[rate].current;
                }
            });
            if (minkey != null) json[date].rates[minkey].minmax = -1;
            if (maxkey != null) json[date].rates[maxkey].minmax = 1;
        });
    }

    // queries on the json

    getKeys() {
        return Object.keys(this.json);
    }

    getValues(key) {
        return this.json[key];
    }

}

module.exports = RatesFile;
