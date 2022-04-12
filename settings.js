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

    exists() {
        return fs.existsSync(this.settingsPath);
    }

    ensureCreated() {
        console.log(`checking file exists at ${this.settingsPath}`);
        if (!this.exists()) {            
            this.save(new settingsModel());
            return false;
        } else {
            return true;
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