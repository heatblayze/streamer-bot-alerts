const path = require('path');
const fs = require('fs');

class settingsModel {
    constructor() {
        this.streamerBotPath = null;
    }
}

module.exports = class settings {
    get settingsPath() {
        return path.join(__dirname, '/settings.json');
    }

    ensureCreated() {
        console.log(`checking file exists at ${this.settingsPath}`);
        if (!fs.existsSync(this.settingsPath)) {
            console.log(`file does not exist at ${this.settingsPath}`);
            this.save(new settingsModel());
            console.log(`created file at ${this.settingsPath}`);
        } else {
            console.log(`file exists at ${this.settingsPath}`);
        }
    }

    get() {
        let data = this.getRaw();
        return JSON.parse(data);
    }

    getRaw() {
        this.ensureCreated();
        return fs.readFileSync(this.settingsPath, "utf8");
    }

    save(data) {
        fs.writeFileSync(this.settingsPath, JSON.stringify(data, null, 4));
    }
}