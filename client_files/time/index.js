"use strict";

/*
    Модуль таймера.

    created 20.08.19 by Carter Slade
*/

mp.time = {
    startMainTimer() {
        mp.timer.addInterval(() => {
            mp.events.call("time.main.tick");
        }, 1000);
    },
    startMinuteTimer() {
        mp.timer.addInterval(() => {
            mp.events.call("time.minute.tick");
        }, 60000);
    },
};

mp.events.add("characterInit.done", () => {
    mp.time.startMainTimer();
    mp.time.startMinuteTimer();
});
