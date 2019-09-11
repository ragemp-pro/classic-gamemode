"use strict";
/// Массив всех домов на сервере
let houses = new Array();
let interiors = new Array();
let garages = new Array();

let money;
let vehicles;
let carmarket;
let timer;

/// Функции модуля системы домов
let changeBlip = function(house) {
    if (house.blip == null) return;
    if (house.info.characterId != null) {
        house.blip.color = 1;
    }
    else {
        house.blip.color = 2;
    }
};
let dropHouse = function(house, sellToGov) {
    try {
        if (house.info.characterId == null) return changeBlip(house);
        let characterId = house.info.characterId;
        house.info.characterId = null;
        house.info.characterNick = null;
        house.info.date = null;
        house.info.isOpened = true;
        changeBlip(house);
        house.info.save().then(() => {
            if (money == null) return console.log("[HOUSES] House dropped " + house.info.id + ". But player didn't getmoney");
            /// Продажа всех авто в гараже
            carmarket != null && carmarket.sellAllCharacterVehicles(characterId);

            /// Зачисление средств игроку
            money.addMoneyById(characterId, house.info.price * 0.6, function(result) {
                if (result) {
                    console.log("[HOUSES] House dropped " + house.info.id);
                    for (let j = 0; j < mp.players.length; j++) {
                        if (mp.players.at(j).character == null) continue;
                        if (characterId == mp.players.at(j).character.id) {
                            if (sellToGov) {
                                mp.players.at(j).call('house.sell.toGov.ans', [1]);
                            }
                            else {
                                mp.players.at(j).call('phone.app.remove', ["house", house.info.id]);
                            }
                            return;
                        }
                    }
                }
                else {
                    console.log("[HOUSES] House dropped " + house.info.id + ". But player didn't getmoney");
                }
            });        
        }); 
    } catch (error) {
        console.log("[ERROR] " + error);
    }
};

module.exports = {
    async init() {
        money = call('money');
        vehicles = call('vehicles');
        carmarket = call('carmarket');
        timer = call("timer");

        console.log("[HOUSES] load houses from DB");
        let infoHouses = await db.Models.House.findAll({
            include: [{ model: db.Models.Interior,
                    include: [{ model: db.Models.Garage,
                        include: [db.Models.GaragePlace]
                    }]
                }
            ]
        });
        for (let i = 0; i < infoHouses.length; i++) {
            let house = this.addHouse(infoHouses[i]);
            this.setTimer(house);
        }
        console.log("[HOUSES] " + infoHouses.length + " houses loaded");
        console.log("[HOUSES] load interiors from DB");
        interiors = await db.Models.Interior.findAll();
        console.log("[HOUSES] " + interiors.length + " interiors loaded");
        garages = await db.Models.Garage.findAll();
        console.log("[HOUSES] " + garages.length + " garages loaded");
    },
    getInteriors() {
        return interiors;
    },
    getGarages() {
        return garages;
    },
    initHouseAdding(player) {
        let interiorsClasses = new Array();
        for (let i = 0; i < interiors.length; i++) {
            interiorsClasses.push({id: interiors[i].id, class: interiors[i].class});
        }

        let garagesIdCarPlaces = new Array();
        for (let i = 0; i < garages.length; i++) {
            garagesIdCarPlaces.push({id: garages[i].id, carPlaces: garages[i].carPlaces});
        }

        player.call('house.add.init', [interiorsClasses, garagesIdCarPlaces]);
    },
    async createHouse(houseInfo) {
        let house = await db.Models.House.create({
            interiorId: houseInfo.interiorId,
            price: houseInfo.price,
            isOpened: true,
            pickupX: houseInfo.pickupX,
            pickupY: houseInfo.pickupY,
            pickupZ: houseInfo.pickupZ,
            spawnX: houseInfo.spawnX,
            spawnY: houseInfo.spawnY,
            spawnZ: houseInfo.spawnZ,
            angle: houseInfo.angle,
            carX: houseInfo.carX,
            carY: houseInfo.carY,
            carZ: houseInfo.carZ,
            carAngle: houseInfo.carAngle,
        }, {
            include: [{ model: db.Models.Interior,
                    include: [{ model: db.Models.Garage,
                        include: [db.Models.GaragePlace]
                    }]
                }
            ]
        });
        house = await db.Models.House.findOne({
            where: {
                id: house.id
            },
            include: [{ model: db.Models.Interior,
                    include: [{ model: db.Models.Garage,
                        include: [db.Models.GaragePlace]
                    }]
                }
            ]
        });
        this.addHouse(house);
        this.setTimer(houses.length - 1);
        console.log("[HOUSES] added new house");
    },
    removeHouse(id, player) {
        let house = this.getHouseById(id);
        if (house.info.characterId != null) {
            if (player != null) player.call('notifications.push.error', ["Нельзя удалить дом у которого есть владелец", "Ошибка"]);
            return;
        }
        if (house.timer != null) {
            timer.remove(house.timer);
            house.timer = null;
        }
        house.enter.destroy();
        house.enter.marker.destroy();
        house.exit.destroy();
        house.exit.marker.destroy();
        if (house.exitGarage != null) {
            house.exitGarage.destroy();
            house.exitGarage.marker.destroy();
        }
        house.blip.destroy();
        house.info.destroy();

        let houseIndex = houses.findIndex(x => x.info.id == id);
        houseIndex != -1 && houses.splice(houseIndex, 1);

        if (player != null) player.call('notifications.push.success', ["Вы удалили дом с id " + id, "Успешно"]);
    },
    async changePrice(id, price) {
        if (price <= 0) return;
        let house = this.getHouseById(id);
        if (house == null) return;
        if (house.info.characterId != null) return;
        house.info.price = price;
        await house.info.save();
        if (player != null) player.call('notifications.push.success', ["Вы изменили цену у дома с id " + id + " на " + price, "Успешно"]);
    },
    async createInterior(player, interiorInfo) {
        let interior = await db.Models.Interior.create({
            garageId: interiorInfo.garageId,
            class: interiorInfo.class,
            numRooms: interiorInfo.numRooms,
            rent: interiorInfo.rent,
            exitX: interiorInfo.exitX,
            exitY: interiorInfo.exitY,
            exitZ: interiorInfo.exitZ,
            x: interiorInfo.x,
            y: interiorInfo.y,
            z: interiorInfo.z,
            rotation: interiorInfo.rotation,
        });
        interiors.push(interior);
        this.initHouseAdding(player);
        console.log("[HOUSES] added new interior");
    },
    async createGarage(player, garageInfo) {
        let garage = await db.Models.Garage.create({
            carPlaces: garageInfo.carPlaces,
            x: garageInfo.x,
            y: garageInfo.y,
            z: garageInfo.z,
            rotation: garageInfo.rotation,
            exitX: garageInfo.exitX,
            exitY: garageInfo.exitY,
            exitZ: garageInfo.exitZ,
            GaragePlaces: garageInfo.GaragePlaces,
        }, {
            include: [db.Models.GaragePlace]
        });
        garages.push(garage);
        this.initHouseAdding(player);
        console.log("[HOUSES] added new garage");
    },
    addHouse(houseInfo) {
        let dimension = houseInfo.id;
        let houseBlipColor;
        if (houseInfo.characterId == null) {
            houseBlipColor = 2;
        }
        else {
            houseBlipColor = 1;
        }

        let enterMarker = mp.markers.new(2, new mp.Vector3(houseInfo.pickupX, houseInfo.pickupY, houseInfo.pickupZ), 0.75, {
            rotation: new mp.Vector3(0, 180, 0),
            dimension: 0
        });
        let exitMarker = mp.markers.new(2, new mp.Vector3(houseInfo.Interior.exitX, houseInfo.Interior.exitY, houseInfo.Interior.exitZ), 0.75, {
            rotation: new mp.Vector3(0, 180, 0),
            dimension: dimension
        });
        let exitGarageMarker = null;
        if (houseInfo.Interior.Garage != null) {
            exitGarageMarker = mp.markers.new(2, new mp.Vector3(houseInfo.Interior.Garage.exitX, houseInfo.Interior.Garage.exitY, houseInfo.Interior.Garage.exitZ), 0.75, {
                rotation: new mp.Vector3(0, 180, 0),
                dimension: dimension
            });
        }
        
        let enterColshape = mp.colshapes.newTube(houseInfo.pickupX, houseInfo.pickupY, houseInfo.pickupZ, 2.0, 1.0, 0);
        let exitColshape = mp.colshapes.newSphere(houseInfo.Interior.exitX, houseInfo.Interior.exitY, houseInfo.Interior.exitZ, 1.0, dimension);
        let exitGarageColshape = null;
        if (houseInfo.Interior.Garage != null) {
            exitGarageColshape = mp.colshapes.newSphere(houseInfo.Interior.Garage.exitX, houseInfo.Interior.Garage.exitY, houseInfo.Interior.Garage.exitZ, 1.0, dimension);
        }
        let blip = mp.blips.new(40, new mp.Vector3(houseInfo.pickupX, houseInfo.pickupY, houseInfo.pickupZ),
        {
            shortRange: true,
            dimension: 0,
            color: houseBlipColor
        });

        enterColshape.marker = enterMarker;
        exitColshape.marker = exitMarker;
        if (exitGarageColshape != null) exitGarageColshape.marker = exitGarageMarker;
        enterColshape.hId = houseInfo.id;
        exitColshape.hId = houseInfo.id;
        if (exitGarageColshape != null) exitGarageColshape.hId = houseInfo.id;
        enterColshape.isHouse = true;
        exitColshape.isHouse = true;
        if (exitGarageColshape != null) exitGarageColshape.isHouse = true;
        enterColshape.place = 0;
        exitColshape.place = 1;
        if (exitGarageColshape != null) exitGarageColshape.place = 2;

        houses.push({
                enter: enterColshape,
                exit: exitColshape,
                exitGarage: exitGarageColshape,
                blip: blip,
                info: houseInfo
            }
        );
        return houses[houses.length - 1];
    },
    updateHouse(house) {
        changeBlip(house);
        this.setTimer(house);
    },
    getRandomDate(daysNumber) {
        let date = new Date();
        date.setTime(Date.now() - (date.getHours() * 1000 * 3600) + (daysNumber * 1000 * 3600 * 24) + (utils.randomInteger(0, 23) * 1000 * 3600));
        return date;
    },
    setTimer(house) {
        if (house.info.characterId == null) return;
        if (house.info.date == null) return dropHouse(house);
        if (house.info.date.getTime() - new Date().getTime() <= 10000) return dropHouse(house);
        house.timer != null && timer.remove(house.timer);
        house.timer = timer.add(async function() {
            dropHouse(house);
        }, house.info.date.getTime() - new Date().getTime());
    },  
    dropHouse: dropHouse,
    changeBlip: changeBlip,
    getHouseById(id) {
        return houses.find( x => {
            if (x == null) return false;
            return x.info.id == id;
        });
    },
    getHouseByCharId(id) {
        return houses.find( x => x.info.characterId == id);
    },
    isHaveHouse(id) {
        return houses.findIndex( x => x.info.characterId == id) != -1;
    },
    getHouseInfoForApp(house) {
        let info = house.info;
        return {
            name: info.id,
            class: info.Interior.class,
            numRooms: info.Interior.numRooms,
            garage: info.Interior.Garage != null,
            carPlaces: info.Interior.Garage != null ? info.Interior.Garage.carPlaces : 1,
            rent: info.price * info.Interior.rent,
            isOpened: info.isOpened,
            improvements: new Array(),
            price: info.price,
            days: parseInt((info.date.getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000)),
            pos: [info.pickupX, info.pickupY, info.pickupZ]
        };
    },
    sellHouse(house, cost, seller, buyer, callback) {
        house.info.characterId = buyer.character.id;
        house.info.characterNick = buyer.character.name;
        house.info.save().then(() => {
            if (money == null) return;
            money.moveCash(buyer, seller, cost, function(result) {
                if (result) {
                    callback(true);
                    buyer.call('phone.app.add', ["house", {
                        name: house.info.id,
                        class: house.info.Interior.class,
                        numRooms: house.info.Interior.numRooms,
                        garage: house.info.Interior.Garage != null,
                        carPlaces: house.info.Interior.Garage != null ? house.info.Interior.Garage.carPlaces : 1,
                        rent:  house.info.price * house.info.Interior.rent,
                        isOpened: house.info.isOpened,
                        improvements: new Array(),
                        price: house.info.price,
                        days: parseInt((house.info.date.getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000)),
                        pos: [house.info.pickupX, house.info.pickupY, house.info.pickupZ]
                    }]);
                    vehicles != null && vehicles.setPlayerCarPlaces(buyer);
                }
                else {
                    callback(false);
                }
            });        
        }); 
    },
    getHouseCarPlaces(id) {
        let house = this.getHouseByCharId(id).info;
        if (house == null) return null;

        let garagePlaces = [{
            x: house.carX,
            y: house.carY,
            z: house.carZ,
            h: house.carAngle,
            d: 0
        }];

        let garage = house.Interior.Garage;
        if (garage == null) return garagePlaces;
        
        house.Interior.Garage.GaragePlaces.forEach(place => {
            garagePlaces.push({
                x: place.x,
                y: place.y,
                z: place.z,
                h: place.angle,
                d: house.id
            });
        });
        return garagePlaces;
    }
};