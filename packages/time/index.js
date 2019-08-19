"use strict";
var factions = require('../factions');
var notifs = require('../notifications');

module.exports = {
    init() {
        this.initPayDayTimer();
    },
    initPayDayTimer() {
        var lastPayDayHour = new Date().getHours();
        setInterval(() => {
            try {
                var date = new Date();
                this.updateWorldTime(date);
                if (date.getMinutes() >= 0 && date.getMinutes() <= 3 && date.getHours() != lastPayDayHour) {
                    lastPayDayHour = date.getHours();
                    this.payDay();
                }
            } catch (e) {
                console.log(e);
            }
        }, 60000);
    },
    payDay() {
        this.allBroadcast();
        this.factionPay();
        // TODO: Налоги на дома
        // TODO: Налоги на бизы
    },
    allBroadcast() {
        mp.players.forEach((rec) => {
            if (!rec.character) return;
            rec.character.minutes += parseInt((Date.now() - rec.authTime) / 1000 / 60 % 60);
            notifs.info(rec, `Минуты: ${rec.character.minutes}`, `PayDay`)
        });
    },
    updateWorldTime(date) {
        mp.world.time.hour = date.getHours();
        mp.world.time.minute = date.getMinutes();
    },
    factionPay() {
        mp.players.forEach((rec) => {
            if (!rec.character) return;
            if (rec.character.factionId) factions.pay(rec);
        });
    }
};
