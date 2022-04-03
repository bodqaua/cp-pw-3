const os = require("os-utils");

class Monitor {
    interval;

    logSystemData() {
        os.cpuUsage(this.logCPU);
    }

    sendSystemDataToView(view) {
        os.cpuUsage((data) => this.sendCPU(data, view));
    }

    clearInterval() {
        clearInterval(this.interval);
    }

    sendSystemDataToViewWithInterval(view, delay = 1000) {
        this.interval = setInterval(() => {
            this.sendSystemDataToView(view);
        }, delay);
    }

    logCPU(data) {
        console.log("CPU Usage (%): " + data * 100);
        console.log("Mem Usage (%): " + os.freememPercentage() * 100);
        console.log("Total Mem (GB): " + os.totalmem() / 1024);
        console.log("System: " + os.platform());
    }

    toFixed(value, points) {
        return value.toFixed(points);
    }

    sendCPU(data, view) {
        view.webContents.send("system-information-event", {
            cpu: this.toFixed(data * 100, 2),
            freeMemory: this.toFixed(os.freememPercentage() * 100, 2),
            totalMemory: Math.round(os.totalmem() / 1024),
            platform: os.platform()
        });
    }
}

module.exports = new Monitor();
