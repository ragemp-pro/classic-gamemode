"use strict";
var vehicles = require('./index.js')
var inventory = call('inventory');
var notifs = call('notifications');

let money = call('money');
module.exports = {
    "init": () => {
        vehicles.init();
    },
    "playerEnterVehicle": (player, vehicle, seat) => {
        player.call('vehicles.garage', [vehicle.isInGarage]);

        if (vehicle.key == 'job' && vehicle.owner != player.character.job && seat == -1) {
            player.removeFromVehicle();
            player.call('notifications.push.error', ["Это рабочий транспорт", "Нет доступа"]);
            return;
        }

        let isPrivate = false;
        if (vehicle.key == 'private' && vehicle.owner == player.character.id) {
            isPrivate = true;
        }
        player.call('vehicles.enter.private', [isPrivate]);

        if (!vehicle.engine && seat == -1 && !vehicle.isInGarage) {
            player.call('prompt.showByName', ['vehicle_engine']);
        }
        if (seat == -1) {
            let enabled = vehicle.properties.vehType == 2 ? false : true;
            player.call('vehicles.speedometer.enabled', [enabled]);
            player.call('vehicles.speedometer.show', [true]);
            player.call('vehicles.speedometer.max.update', [vehicle.properties.maxFuel]);
            player.call('vehicles.speedometer.sync');
            clearInterval(player.indicatorsUpdateTimer);

            let playerId = player.id;
            let characterId = player.character.id;
            player.indicatorsUpdateTimer = setInterval(() => {
                try {
                    let target = mp.players.at(playerId);
                    if (!target || !target.character || target.character.id != characterId) return clearInterval(player.indicatorsUpdateTimer);
                    player.call('vehicles.speedometer.fuel.update', [Math.ceil(vehicle.fuel)]);
                } catch (err) {
                    console.log(err);
                    clearInterval(player.indicatorsUpdateTimer);
                }
            }, 1000);
        }
        player.call('vehicles.mileage.start', [vehicle.mileage]);

        mp.events.call('vehicle.ready', player, vehicle, seat);
    },
    "playerQuit": (player) => {
        if (player.indicatorsUpdateTimer) {
            clearInterval(player.indicatorsUpdateTimer);
        }
    },
    "vehicleDeath": (vehicle) => {
        vehicles.respawnVehicle(vehicle);
    },
    "playerExitVehicle": (player, vehicle) => {
        if (player.indicatorsUpdateTimer) {
            clearInterval(player.indicatorsUpdateTimer);
        }
        player.call('vehicles.indicators.show', [false]);
        player.call('vehicles.speedometer.show', [false]);
        player.call('vehicles.garage', [false]);
        player.call('prompt.hide');
    },
    "playerStartExitVehicle": (player) => {
        if (player.vehicle.engine) player.vehicle.engine = true;
    },
    "vehicles.engine.toggle": (player) => { /// Включение/выключение двигателя
        if (!player.vehicle) return;
        if (player.vehicle.key == "market") return;
        if (player.vehicle.key == "job" && player.vehicle.owner == 2 && !player.vehicle.isActiveTaxi) return;
        if (player.vehicle.key == "job" && player.vehicle.owner == 3 && !player.vehicle.isActiveBus) return;
        if (player.vehicle.key == "job" && player.vehicle.owner == 4 && !player.vehicle.driver) return;
        if (player.vehicle.isBeingRepaired) return player.call('notifications.push.warning', ['Двигатель завести нельзя', 'Ремонт']);
        if (player.vehicle.isBeingTuned) return;
        if (player.vehicle.fuel <= 0) return player.call('notifications.push.error', ['Нет топлива', 'Транспорт']);
        if (player.vehicle.engine == true) {
            player.vehicle.engine = false;
            player.call('vehicles.engine.toggle', [false]);
            player.vehicle.setVariable("engine", false);
        } else {
            if (player.vehicle.key == 'private' && !vehicles.haveKeys(player, player.vehicle)) return notifs.error(player, `Вы не имеете ключи`, player.vehicle.properties.name);
            player.vehicle.engine = true;
            player.call('vehicles.engine.toggle', [true]);
            player.vehicle.setVariable("engine", true);
            player.call('prompt.hide');
            if (player.vehicle.key == 'private') {
            vehicles.generateBreakdowns(player.vehicle);
            }
            mp.events.call('vehicles.breakdowns.init', player);
        }
    },
    'vehicles.breakdowns.init': (player) => {
        if (!player.vehicle) return;
        let vehicle = player.vehicle;
        try {
            let data = {
                engineState: vehicle.engineState,
                steeringState: vehicle.steeringState,
                fuelState: vehicle.fuelState,
                brakeState: vehicle.brakeState
            }
            player.call('vehicles.breakdowns.init', [data]);
        } catch (err) {
            console.log(err);
        }
    },
    "vehicles.mileage.add": (player, value) => {
        if (!player.vehicle) return;

        if (value < 0.1) return;
        player.vehicle.mileage += value;
        vehicles.updateMileage(player);
        //player.call('chat.message.push', [`!{#adff9e} Пробег ${player.vehicle.mileage}`]);
    },
    "entityCreated": (entity) => {
        if (entity.type == "vehicle") {
            entity.setVariable("leftTurnSignal", false);
            entity.setVariable("rightTurnSignal", false);
            entity.setVariable("hood", false);
            entity.setVariable("trunk", false);
        }
    },
    "vehicles.signals.left": (player, state) => {
        if (!player.vehicle) return;
        player.vehicle.setVariable("leftTurnSignal", state);
        player.vehicle.setVariable("rightTurnSignal", false);
    },
    "vehicles.signals.right": (player, state) => {
        if (!player.vehicle) return;
        player.vehicle.setVariable("rightTurnSignal", state);
        player.vehicle.setVariable("leftTurnSignal", false);
    },
    "vehicles.signals.emergency": (player, state) => {
        if (!player.vehicle) return;
        player.vehicle.setVariable("rightTurnSignal", state);
        player.vehicle.setVariable("leftTurnSignal", state);
    },
    "vehicles.hood": (player, vehicleId, state) => {
        let vehicle = mp.vehicles.at(vehicleId);
        if (!vehicle) return;
        if (vehicle.db.key == 'private' && !vehicles.haveKeys(player, vehicle)) return notifs.error(player, `Вы не имеете ключи`, vehicle.properties.name);

        vehicle.setVariable("hood", state);
    },
    "vehicles.trunk": (player, vehicleId, state) => {
        let vehicle = mp.vehicles.at(vehicleId);
        if (!vehicle) return;
        if (vehicle.db.key == 'private' && !vehicles.haveKeys(player, vehicle)) return notifs.error(player, `Вы не имеете ключи`, vehicle.properties.name);

        vehicle.setVariable("trunk", state);

        var unload = vehicle.getVariable("unload");
        if (unload && !state) vehicle.setVariable("unload", null);
    },
    "characterInit.done": (player) => {
        console.log('init done for vehicles');
        mp.events.call('vehicles.private.load', player);
    },
    "vehicles.private.load": (player) => {
        vehicles.loadPrivateVehicles(player);
    },
    "vehicles.lock": (player, vehicleId) => {
        let vehicle = mp.vehicles.at(vehicleId);
        if (!vehicle) return;
        // TEMP
        if (vehicle.key != 'private') return player.call('notifications.push.error', ['Это не ваше т/с', 'Ошибка']);
        // if (vehicle.owner != player.character.id) return player.call('notifications.push.error', ['Это не ваше т/с', 'Транспорт']);
        if (!vehicles.haveKeys(player, vehicle)) return notifs.error(player, `Вы не имеете ключи`, vehicle.properties.name);

        let state = vehicle.locked;
        if (state) {
            vehicle.locked = false;
            player.call('notifications.push.success', ['Вы открыли транспорт', 'Успешно']);
        } else {
            vehicle.locked = true;
            player.call('notifications.push.success', ['Вы закрыли транспорт', 'Успешно']);
        }
    },
    "vehicles.explode": (player, vehicleId) => {
        let vehicle = mp.vehicles.at(vehicleId);
        if (!vehicle) return;
        setTimeout(() => {
            vehicle.explode();
            vehicle.destroy();
        }, 2000);
    },
    "vehicles.ejectlist.get": (player, vehicleId) => {
        let vehicle = mp.vehicles.at(vehicleId);
        if (!vehicle) return;
        let occupants = vehicle.getOccupants();
        if (occupants.length == 0) return;

        let ejectList = [];

        occupants.forEach((current) => {
            console.log(current.name);
            if ((current.id != player.id) && (current.seat != -1)) {
                ejectList.push({
                    id: current.id,
                    name: current.name
                });
            }
        });
        console.log(ejectList);
        if (ejectList.length == 0) return player.call('notifications.push.error', ['В т/с нет пассажиров', 'Транспорт']);;
        player.call('interaction.ejectlist.show', [ejectList]);
    },
    "vehicles.eject": (player, playerToEject) => {
        if (!playerToEject) return;
        playerToEject = JSON.parse(playerToEject);

        let target = mp.players.at(playerToEject.id);
        if (!target) return;
        if (!target.vehicle) return;
        if (target.name != playerToEject.name) return;

        console.log(`выкидываем ${target.name} с id ${target.id}`);
        try {
            target.removeFromVehicle();
            target.call('notifications.push.warning', ['Вас вытолкнули из т/с', 'Транспорт']);
            player.call('notifications.push.success', ['Вы вытолкнули пассажира', 'Транспорт']);
        } catch (err) {
            console.log(err);
        }
    },
    "vehicles.siren.sound": (player, vehicleId) => {
        if (!player.vehicle) return;
        let vehicle = mp.vehicles.at(vehicleId);
        if (!vehicle) return;

        var sirenSound = vehicle.getVariable("sirenSound");
        vehicle.setVariable("sirenSound", !sirenSound);
    },
    "vehicles.siren.lights": (player) => {
        if (!player.vehicle) return;

        var sirenLights = player.vehicle.getVariable("sirenLights");
        if (sirenLights == player.vehicle.siren) return;
        player.vehicle.setVariable("sirenLights", player.vehicle.siren);
    },
    "vehicles.sell.send": (player, data) => {
        data = JSON.parse(data);
        if (!player.vehicle) return player.call('vehicles.sell.send.ans', [0]);

        if (player.vehicle.key != 'private' || player.vehicle.owner != player.character.id) return player.call('vehicles.sell.send.ans', [1]);

        let price = parseInt(data.price);
        if (isNaN(price) || price < 1) return player.call('vehicles.sell.send.ans', [2]);

        let target = mp.players.at(data.id);
        if (!target) return player.call('vehicles.sell.send.ans', [3]);

        if (player.dist(target.position) > 10) return player.call('vehicles.sell.send.ans', [4]);

        let vehicle = player.vehicle;

        let carSellData = {
            targetName: target.name,
            vehicleName: vehicle.properties.name,
            price: price
        }
        player.call('vehicles.sell.send.ans', [5, carSellData]);
    },
    "vehicles.sell.seller.accept": (player, data) => {
        data = JSON.parse(data);

        let price = parseInt(data.price);
        if (isNaN(price) || price < 1) return player.call('notifications.push.error', ['Неверная цена', 'Ошибка']);

        let target = mp.players.at(data.id);
        if (!target) return player.call('notifications.push.error', ['Нет игрока', 'Ошибка']);

        if (player.dist(target.position) > 10) return player.call('notifications.push.error', ['Игрок далеко', 'Ошибка']);

        let vehicle = player.vehicle;
        if (!vehicle) return player.call('notifications.push.error', ['Вы не в транспорте', 'Ошибка']);
        if (player.vehicle.key != 'private' || player.vehicle.owner != player.character.id) return player.call('notifications.push.error', ['Это не ваш транспорт', 'Ошибка']);
        let vehId = vehicle.sqlId;

        target.sellCarTargetOffer = {
            seller: player,
            vehicle: vehicle,
            price: price,
            vehId: vehId
        }
        player.sellCarSenderOffer = {
            vehId: vehId
        }

        target.call('offerDialog.show', ["vehicles_sell", {
            name: player.character.name,
            model: vehicle.properties.name,
            price: price,
            plate: vehicle.plate
        }]);
    },
    "vehicles.sell.offer.accept": (player, accept) => {
        if (!player.sellCarTargetOffer) return;
        let target = player;
        let seller = target.sellCarTargetOffer.seller;

        if (accept) {
            console.log('accept');
            let vehicle = seller.vehicle;
            if (!vehicle || vehicle.sqlId != target.sellCarTargetOffer.vehId) {
                target.call('vehicles.sell.target.final', [2]);
                seller.call('vehicles.sell.seller.final', [2]);
                delete target.sellCarTargetOffer;
                delete seller.sellCarSenderOffer;
                return;
            }
            if (target.character.cash < target.sellCarTargetOffer.price) {
                //target.call('notifications.push.error', ['Недостаточно денег', 'Ошибка']);
                target.call('vehicles.sell.target.final', [0]);
                seller.call('vehicles.sell.seller.final', [0]);
                delete target.sellCarTargetOffer;
                delete seller.sellCarSenderOffer;
                return;
            }
            if (!vehicles.isAbleToBuyVehicle(target)) {
                target.call('vehicles.sell.target.final', [3]);
                seller.call('vehicles.sell.seller.final', [3]);
                delete target.sellCarTargetOffer;
                delete seller.sellCarSenderOffer;
                return;
            }

            var cant = inventory.cantAdd(target, 33, {});
            if (cant) {
                target.call('vehicles.sell.target.final', [4, {
                    text: cant
                }]);
                // seller.call('vehicles.sell.seller.final', [4, {
                //     text: cant
                // }]);
                delete target.sellCarTargetOffer;
                delete seller.sellCarSenderOffer;
                return;
            }

            let price = target.sellCarTargetOffer.price;
            let vehId = target.sellCarTargetOffer.vehId;
            let owners = vehicle.owners;
            money.moveCash(target, seller, price, function(result) {
                console.log(vehId)
                if (result) {
                    //target.call('notifications.push.success', ['Вы купили транспорт', 'Успешно']);
                    target.call('vehicles.sell.target.final', [1]);
                    //seller.call('notifications.push.success', ['Вы продали транспорт', 'Успешно']);
                    seller.call('vehicles.sell.seller.final', [1]);
                    db.Models.Vehicle.update({
                        owner: target.character.id,
                        owners: owners + 1
                    }, {
                        where: {
                            id: vehId
                        }
                    });
                    let veh = vehicles.getVehicleBySqlId(vehId);
                    if (veh) {
                        veh.owner = target.character.id;
                        veh.owners = veh.owners + 1;
                    }
                    if (seller.vehicle) {
                        seller.removeFromVehicle();
                    }

                    vehicles.removeVehicleFromPlayerVehicleList(seller, vehId);
                    // TODO на парковке или нет
                    let props = vehicles.setVehiclePropertiesByModel(veh.modelName)
                    console.log(props)
                    target.vehicleList.push({
                        id: veh.id,
                        name: props.name,
                        plate: veh.plate,
                        regDate: veh.regDate,
                        owners: veh.owners,
                        vehType: props.vehType,
                        price: props.price // todo isOnParking TODO !!!!!!!!!!!!!!!!!!!!!
                    });

                    inventory.fullDeleteItemsByParams(33, 'vehId', vehId);
                    // выдача ключей в инвентарь
                    inventory.addItem(target, 33, {
                        owner: target.character.id,
                        vehId: vehId,
                        vehName: props.name
                    }, (e) => {
                        if (e) return player.call('vehicles.sell.target.final', [4, {
                            text: e
                        }]);
                    });
                    // удаление ключей у продавца
                    // inventory.deleteByParams(seller, 33, 'vehId', vehId);

                    delete target.sellCarTargetOffer;
                    delete seller.sellCarSenderOffer;
                } else {
                    //target.call('notifications.push.error', ['Не удалось купить т/с', 'Ошибка']);
                    target.call('vehicles.sell.target.final', [2]);
                    seller.call('vehicles.sell.seller.final', [2]);
                    //seller.call('notifications.push.error', ['Не удалось продать т/с', 'Ошибка']);
                    delete target.sellCarTargetOffer;
                    delete seller.sellCarSenderOffer;
                }
            });
        } else {
            delete target.sellCarTargetOffer;
            delete seller.sellCarSenderOffer;
        }
    },
    "vehicles.garage.leave": (player) => {
        if (!player.vehicle) return;
        if (!player.vehicle.isInGarage) return;
        if (player.vehicle.key != 'private' || player.vehicle.owner != player.character.id) return;

        let streetPlace = player.carPlaces.find(x => x.d == 0);

        if (!streetPlace) return;
        player.vehicle.isInGarage = false;
        player.call('vehicles.garage', false);
        player.vehicle.position = new mp.Vector3(streetPlace.x, streetPlace.y, streetPlace.z);
        //player.vehicle.rotation = new mp.Vector3(0, 0, 0);
        //player.vehicle.setHeading(streetPlace.h);
        player.call('vehicles.heading.set', [streetPlace.h]);

        player.vehicle.dimension = 0;
    },
    "vehicles.radio.set": (player, radioIndex) => {
        if (!player.vehicle) return;
        player.vehicle.setVariable('radioIndex', radioIndex);
    }
}
