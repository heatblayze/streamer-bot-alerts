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
        console.error(`checking file exists`);
        console.error(`checking file exists at ${this.settingsPath}`);
        if (!fs.existsSync(this.settingsPath)) {
            console.error(`file exists at ${this.settingsPath}`);
            let content = JSON.stringify(new settingsModel());
            fs.writeFileSync(this.settingsPath, content);
            console.error(`created file at ${this.settingsPath}`);
        } else {
            console.error(`file exists at ${this.settingsPath}`);
        }
    }

    get() {
        this.ensureCreated();
        return fs.readFileSync(this.settingsPath, "utf8");
    }    
}