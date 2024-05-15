const NodeHelper = require("node_helper");
const fetch = require("node-fetch");

module.exports = NodeHelper.create({
    // Subclass start method.
    start: function () {
        console.log("Starting node helper for: " + this.name);
    },

    fetchData: async function () {
        try {
            const url = "http://" + this.config.ip + ":" + this.config.port + "/api/state";
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                this.sendSocketNotification("EVCC_DATA", data.result);
            } else {
                throw new Error("Failed to fetch data from EVCC API");
            }
        } catch (error) {
            console.error(error);
        }
    },

    // Subclass socketNotificationReceived received.
    socketNotificationReceived: function (notification, payload) {
        if (notification === "GET_EVCC_DATA") {
            this.fetchData();
        }
        if (notification === "SET_EVCC_CONFIG") {
            this.config = payload;
        }
    },
});