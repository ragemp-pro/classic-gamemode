let breakdowns = {
    engineState: 2,
    steeringState: 2,
    fuelState: 0,
    brakeState: 2
}

let engineState;
let steeringState;
let fuelState;
let brakeState;

mp.keys.bind(0x72, true, function () {
    mp.events.call('vehicles.breakdowns.init', breakdowns);
    //mp.players.local.vehicle.setSteerBias(1.0);
});

mp.events.add('playerLeaveVehicle', () => {
    stopBrakeTimer();
});

mp.events.add('vehicles.breakdowns.init', (data) => {
    if (!mp.players.local.vehicle) return;
    if (!data.engineState && !data.steeringState && !data.fuelState && !data.brakeState) {
        return mp.callCEFV('speedometer.danger = 0');
    }
    mp.chat.debug(`engineState ${data.engineState}`);
    mp.chat.debug(`steeringState ${data.steeringState}`);
    mp.chat.debug(`fuelState ${data.fuelState}`);
    mp.chat.debug(`brakeState ${data.brakeState}`);

    engineState = data.engineState;
    steeringState = data.steeringState;
    fuelState = data.fuelState;
    brakeState = data.brakeState;
    if (engineState) {
        mp.events.call('vehicles.breakdowns.engine');
    }
    if (steeringState) {
        mp.events.call('vehicles.breakdowns.steering');
    }
    if (fuelState) {
        mp.events.call('vehicles.breakdowns.fuel');
    }
    if (brakeState) {
        mp.events.call('vehicles.breakdowns.brake');
    }
    mp.callCEFV('speedometer.danger = 1');
});

mp.events.add('vehicles.breakdowns.engine', () => {
    mp.chat.debug('сломали двигатель');
    if (!mp.players.local.vehicle) return;
    let multiplier;
    switch (engineState) {
        case 1:
            multiplier = -30;
            break;
        case 2:
            multiplier = -60;
            break;
    }
    mp.players.local.vehicle.setEnginePowerMultiplier(multiplier);
});

mp.events.add('vehicles.breakdowns.steering', () => {
    mp.chat.debug('сломали руль');
    startSteeringTimer();
});

mp.events.add('vehicles.breakdowns.fuel', () => {
    mp.chat.debug('сломали топливо');
});

mp.events.add('vehicles.breakdowns.brake', () => {
    mp.chat.debug('сломали тормоза');
    startBrakeTimer();
});

let brakeTimer, toBrake;

function startBrakeTimer() {
    let breakChance;
    switch (brakeState) {
        case 1:
            breakChance = 0.2;
            break;
        case 2:
            breakChance = 0.5;
            break;
    }

    brakeTimer = setInterval(() => {
        if (!mp.players.local.vehicle) return stopBrakeTimer();

        try {
            let random = Math.random();
            mp.chat.debug(`random ${random}`);
            if (random <= breakChance) {
                mp.players.local.vehicle.setHandbrake(true);
                toBrake = setTimeout(() => {
                    if (!mp.players.local.vehicle) return stopBrakeTimer();
                    try {
                        mp.players.local.vehicle.setHandbrake(false);
                    } catch (err) {
                        mp.chat.debug('err');
                        stopBrakeTimer();
                        //clearInterval(toBrake);
                    }
                }, 2000);
            }
        } catch (err) {
            mp.chat.debug('err');
            //clearInterval(brakeTimer);
            stopBrakeTimer();
        }
    }, 10000);
}

function stopBrakeTimer() {
    clearInterval(brakeTimer);
    clearInterval(toBrake);
}

let steeringTimer;

function startSteeringTimer() {
    let breakChance;
    switch (steeringState) {
        case 1:
            breakChance = 0.2;
            break;
        case 2:
            breakChance = 0.7;
            break;
    }

    steeringTimer = setInterval(() => {
        if (!mp.players.local.vehicle) return stopBrakeTimer();
        let breakRandom = Math.random();
        mp.chat.debug(`breakrand ${breakRandom}`);
        if (breakRandom > breakChance) return;
        try {
            let random = Math.random();
            mp.chat.debug(`leftright ${random}`);
            if (random > 0.5) {
                bias = -1.0;
            } else {
                bias = 1.0;
            }
            mp.players.local.vehicle.setSteerBias(bias);

        } catch (err) {
            mp.chat.debug('err');
            stopSteeringTimer()
        }
    }, 2000);
}

function stopSteeringTimer() {
    clearInterval(steeringTimer);
}