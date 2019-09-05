"use strict";


/*
    Модуль инвентаря.

    created 30.07.19 by Carter Slade
*/

mp.inventory = {
    groundMaxDist: 2,

    enable(enable) {
        mp.callCEFV(`inventory.enable = ${enable}`);
    },
    debug(enable) {
        mp.callCEFV(`inventory.debug = ${enable}`);
    },
    initItems(items) {
        if (typeof items == 'object') items = JSON.stringify(items);
        mp.callCEFV(`inventory.initItems('${items}')`);
    },
    setItemsInfo(itemsInfo) {
        if (typeof itemsInfo == 'object') itemsInfo = JSON.stringify(itemsInfo);
        mp.callCEFV(`inventory.setItemsInfo('${itemsInfo}')`);
    },
    setItemInfo(id, itemInfo) {
        if (typeof itemInfo == 'object') itemInfo = JSON.stringify(itemInfo);
        mp.callCEFV(`inventory.setItemInfo(${id}, '${itemInfo}')`);
    },
    addItem(item, pocket, index, parent) {
        if (typeof item == 'object') item = JSON.stringify(item);
        mp.callCEFV(`inventory.addItem('${item}', ${pocket}, ${index}, ${parent})`);
    },
    deleteItem(sqlId) {
        mp.callCEFV(`inventory.deleteItem(${sqlId})`);
    },
    setItemSqlId(id, sqlId) {
        mp.callCEFV(`inventory.setItemSqlId(${id}, ${sqlId})`);
    },
    setItemParam(sqlId, key, value) {
        mp.callCEFV(`inventory.setItemParam(${sqlId}, '${key}', '${value}')`);
    },
    addEnvironmentPlace(place) {
        if (typeof place == 'object') place = JSON.stringify(place);
        mp.callCEFV(`inventory.addEnvironmentPlace('${place}')`);
    },
    deleteEnvironmentPlace(sqlId) {
        mp.callCEFV(`inventory.deleteEnvironmentPlace(${sqlId})`);
    },
    setEnvironmentItemSqlId(id, sqlId) {
        mp.callCEFV(`inventory.setEnvironmentItemSqlId(${id}, ${sqlId})`);
    },
    setSatiety(val) {
        mp.callCEFV(`inventory.satiety = ${val}`)
    },
    setThirst(val) {
        mp.callCEFV(`inventory.thirst = ${val}`)
    },
    takeItemHandler() {
        // поднятие предмета с земли
        var pos = mp.players.local.position;
        var itemObj, minDist = 9999;
        mp.objects.forEach((obj) => {
            var objPos = obj.position;
            let dist = mp.game.system.vdist(pos.x, pos.y, pos.z, objPos.x, objPos.y, objPos.z);
            if (dist > mp.inventory.groundMaxDist) return;
            if (!obj.getVariable("groundItem")) return;
            if (dist > minDist) return;

            minDist = dist;
            itemObj = obj;
        });
        if (!itemObj) return;
        // TODO: проверка на аттачи
        mp.events.callRemote("item.ground.take", itemObj.remoteId);
    },
};

mp.events.add("characterInit.done", () => {
    mp.inventory.enable(true);
    mp.keys.bind(69, true, mp.inventory.takeItemHandler); // E
});

mp.events.add("inventory.enable", mp.inventory.enable);

mp.events.add("inventory.debug", mp.inventory.debug);

mp.events.add("inventory.initItems", mp.inventory.initItems);

mp.events.add("inventory.setItemsInfo", mp.inventory.setItemsInfo);

mp.events.add("inventory.setItemInfo", mp.inventory.setItemInfo);

mp.events.add("inventory.deleteItem", mp.inventory.deleteItem);

mp.events.add("inventory.setItemSqlId", mp.inventory.setItemSqlId);

mp.events.add("inventory.addItem", mp.inventory.addItem);

mp.events.add("inventory.setItemParam", mp.inventory.setItemParam);

mp.events.add("inventory.addEnvironmentPlace", mp.inventory.addEnvironmentPlace);

mp.events.add("inventory.deleteEnvironmentPlace", mp.inventory.deleteEnvironmentPlace);

mp.events.add("inventory.setEnvironmentItemSqlId", mp.inventory.setEnvironmentItemSqlId);

mp.events.add("inventory.setSatiety", mp.inventory.setSatiety);

mp.events.add("inventory.setThirst", mp.inventory.setThirst);

mp.events.add("playerEnterVehicleBoot", (player, vehicle) => {
    // mp.notify.info(`enterBoot: #${vehicle.remoteId}`);
    mp.events.callRemote(`vehicle.boot.items.request`, vehicle.remoteId);
});

mp.events.add("playerExitVehicleBoot", (player, vehicle) => {
    // mp.notify.info(`exitBoot: #${vehicle.remoteId}`);
    mp.events.callRemote(`vehicle.boot.items.clear`, vehicle.remoteId);
});
