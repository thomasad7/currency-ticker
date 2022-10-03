const RatesFile = require('./ratesfile');

class RatesService {

    constructor() {}

    // load, refactor and enrich the rates file on startup
    async initialise() {
        let file = new RatesFile();
        await file.load("../currencies.json");
        file.refactor();
        file.enrich();
        this.data = file;
    }

    getDates() {
        let dates = this.data.getKeys();
        return JSON.stringify(dates);
    }

    getRates(date) {
        let rates = this.data.getValues(date).rates;
        return JSON.stringify(Object.values(rates));
    }

}

module.exports = RatesService;
