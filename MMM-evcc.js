Module.register("MMM-evcc", {
    // Default module config.
    defaults: {
        ip: "localhost",
        port: "7070",
    },

    // Define start sequence.
    start: function () {
        Log.info("Starting module: " + this.name);
        this.loaded = false;
        this.evccData = {};
        this.sendSocketNotification("SET_EVCC_CONFIG", this.config);
        this.sendSocketNotification("GET_EVCC_DATA");
    },

    // Override dom generator.
    getDom: function () {
        var wrapper = document.createElement("div");
        if (!this.loaded) {
            wrapper.innerHTML = "Loading...";
            return wrapper;
        }
        // Display pvPower
        if (this.evccData && this.evccData.pvPower !== undefined) {
            var pvPowerElement = document.createElement("div");
            pvPowerElement.innerHTML = "PV Power: " + this.evccData.pvPower + " W";
            wrapper.appendChild(pvPowerElement);
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
});