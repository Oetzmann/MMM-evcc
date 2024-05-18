Module.register("MMM-evcc", {
    // Default module config.
    defaults: {
        ip: "localhost",
        port: "7070",
        decimalDigits: 2,
        updateInterval: 30,
        displayMode: "all",
    },

    // Define required scripts.
    getScripts: function () {
        return [
            "https://cdn.jsdelivr.net/npm/@h2d2/shopicons@1.2.0/umd/regular.js",            
            "MMM-evcc.css",
        ];
    },

    // Define required styles.
    /*getStyles: function () {
        return ["MMM-evcc.css"];
    },*/

    // Define start sequence.
    start: function () {
        Log.info("Starting module: " + this.name);
        this.loaded = false;
        this.evccData = {};
        this.sendSocketNotification("SET_EVCC_CONFIG", this.config);
        this.sendSocketNotification("GET_EVCC_DATA");
        this.scheduleUpdate();
    },

    // Override dom generator.
    getDom: function () {
        var wrapper = document.createElement("div");
        if (!this.loaded) {
            wrapper.innerHTML = "Loading...";
            return wrapper;
        }
        // Display pvPower
        if (this.config.displayMode == "pv") {
            if (this.evccData && this.evccData.pvPower !== undefined) {
                var pvPowerElement = document.createElement("div");
                pvPowerElement.className = "flex large";
                pvPowerElement.innerHTML = "<span style=\"margin-right: 15px\"><shopicon-regular-sun size=\"xl\"></shopicon-regular-sun></span> " + this.formatWatts(this.evccData.gridPower)  + "</div>";
                wrapper.appendChild(pvPowerElement);
            }
        }
        return wrapper;
    },

    // socketNotificationReceived from helper
    socketNotificationReceived: function (notification, payload) {
        if (notification === "EVCC_DATA") {
            this.evccData = payload;
            this.loaded = true;
            this.updateDom();
        }
    },
    
    // Format a number with the configured number of decimal digits.
    formatWatts(value) {
        return (value/1000).toLocaleString("de-DE", { minimumFractionDigits: this.config.decimalDigits, maximumFractionDigits: this.config.decimalDigits }) + " kW";
    },

    // Schedule update.
    scheduleUpdate: function () {
        var self = this;
        setInterval(function () {
            self.sendSocketNotification("GET_EVCC_DATA");
            self.updateDom();
        }, this.config.updateInterval * 1000);
    },


});