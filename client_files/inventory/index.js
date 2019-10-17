mp.inventory = {
    groundMaxDist: 2,
    lastArmour: 0,

    enable(enable) {
        mp.callCEFV(`inventory.enable = ${enable}`);
    },
    debug(enable) {
        mp.callCEFV(`inventory.debug = ${enable}`);
    },
    spin(enable) {
        mp.callCEFV(`inventory.spin = ${enable}`);
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
    setMergeList(list) {
        if (typeof list == 'object') list = JSON.stringify(list);
        mp.callCEFV(`inventory.setMergeList('${list}')`);
    },
    setBlackList(list) {
        if (typeof list == 'object') list = JSON.stringify(list);
        mp.callCEFV(`inventory.setBlackList('${list}')`);
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
    deleteEnvironmentItem(id) {
        mp.callCEFV(`inventory.deleteEnvironmentItem(${id})`);
    },
    setMaxPlayerWeight(val) {
        mp.callCEFV(`inventory.maxPlayerWeight = ${val}`)
    },
    setSatiety(val) {
        mp.callCEFV(`inventory.satiety = ${val}`)
    },
    setThirst(val) {
        mp.callCEFV(`inventory.thirst = ${val}`)
    },
    setArmour(val) {
        if (this.lastArmour == val) return;
        this.lastArmour = val;
        mp.callCEFV(`inventory.setArmour(${val})`);
    },
    takeItemHandler() {
        // поднятие предмета с земли
        if (mp.busy.includes()) return;
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
    loadHotkeys() {
        if (!mp.storage.data.hotkeys) mp.storage.data.hotkeys = {};
        var hotkeys = mp.storage.data.hotkeys;
        // mp.terminal.debug(`[inventory] loadHotkeys:`)
        // mp.terminal.debug(hotkeys);
        for (var key in hotkeys) {
            var sqlId = hotkeys[key];
            key = parseInt(key);
            mp.callCEFV(`inventory.bindHotkey(${sqlId}, ${key})`);
        }
    },
    saveHotkey(sqlId, key) {
        // mp.terminal.debug(`[inventory] saveHotkey: ${sqlId} ${key}`)
        mp.inventory.clearHotkeys(sqlId);
        var hotkeys = mp.storage.data.hotkeys;
        hotkeys[key] = sqlId;
    },
    removeHotkey(key) {
        // mp.terminal.debug(`[inventory] removeHotkey: ${key}`)
        var hotkeys = mp.storage.data.hotkeys;
        delete hotkeys[key];
    },
    clearHotkeys(sqlId) {
        var hotkeys = mp.storage.data.hotkeys;
        for (var key in hotkeys) {
            var itemSqlId = hotkeys[key];
            if (sqlId == itemSqlId) this.removeHotkey(key);
        }
    },
    registerWeaponAttachments(list, models) {
        for (var i = 0; i < list.length; i++) {
            var itemId = list[i];
            var model = models[i];

            mp.attachmentMngr.register(`weapon_${itemId}`, model, 24818, new mp.Vector3(0.2, -0.155, -0.1),
                new mp.Vector3(13, 180, 10)
            );
        }
        mp.callCEFV(`inventory.setBodyList(9, '${JSON.stringify(list)}')`)
    },
};

mp.events.add("characterInit.done", () => {
    mp.inventory.enable(true);
    mp.keys.bind(69, true, mp.inventory.takeItemHandler); // E
});

mp.events.add("inventory.enable", mp.inventory.enable);

mp.events.add("inventory.debug", mp.inventory.debug);

mp.events.add("inventory.spin", mp.inventory.spin);

mp.events.add("inventory.initItems", (items) => {
    mp.inventory.initItems(items);
    mp.inventory.loadHotkeys();
});

mp.events.add("inventory.setItemsInfo", mp.inventory.setItemsInfo);

mp.events.add("inventory.setItemInfo", mp.inventory.setItemInfo);

mp.events.add("inventory.setMergeList", mp.inventory.setMergeList);

mp.events.add("inventory.setBlackList", mp.inventory.setBlackList);

mp.events.add("inventory.deleteItem", mp.inventory.deleteItem);

mp.events.add("inventory.setItemSqlId", mp.inventory.setItemSqlId);

mp.events.add("inventory.addItem", mp.inventory.addItem);

mp.events.add("inventory.setItemParam", mp.inventory.setItemParam);

mp.events.add("inventory.addEnvironmentPlace", mp.inventory.addEnvironmentPlace);

mp.events.add("inventory.deleteEnvironmentPlace", mp.inventory.deleteEnvironmentPlace);

mp.events.add("inventory.setEnvironmentItemSqlId", mp.inventory.setEnvironmentItemSqlId);

mp.events.add("inventory.deleteEnvironmentItem", mp.inventory.deleteEnvironmentItem);

mp.events.add("inventory.setMaxPlayerWeight", mp.inventory.setMaxPlayerWeight);

mp.events.add("inventory.registerWeaponAttachments", mp.inventory.registerWeaponAttachments);

mp.events.add("inventory.setSatiety", mp.inventory.setSatiety);

mp.events.add("inventory.setThirst", mp.inventory.setThirst);

mp.events.add("inventory.saveHotkey", mp.inventory.saveHotkey);

mp.events.add("inventory.removeHotkey", mp.inventory.removeHotkey);

mp.events.add("playerEnterVehicleBoot", (player, vehicle) => {
    // mp.notify.info(`enterBoot: #${vehicle.remoteId}`);
    if (!vehicle.getVariable("trunk")) return;
    if (vehicle.getVariable("static")) return;
    if (player.vehicle) return;
    mp.prompt.showByName("vehicle_items_boot");
    mp.events.callRemote(`vehicle.boot.items.request`, vehicle.remoteId);
});

mp.events.add("playerExitVehicleBoot", (player, vehicle) => {
    // mp.notify.info(`exitBoot: #${vehicle.remoteId}`);
    if (vehicle.getVariable("static")) return;
    mp.events.callRemote(`vehicle.boot.items.clear`, vehicle.remoteId);
});

mp.events.add("time.main.tick", () => {
    var value = mp.players.local.getArmour();
    mp.inventory.setArmour(value);

    mp.objects.forEach(obj => {
        if (obj.getVariable("groundItem")) mp.utils.setNoCollision(obj, true);
    });
});

mp.events.addDataHandler("trunk", (vehicle, value) => {
    if (mp.moduleVehicles.nearBootVehicleId == null) return;
    if (mp.moduleVehicles.nearBootVehicleId != vehicle.remoteId) return;
    if (value) {
        mp.events.callRemote(`vehicle.boot.items.request`, vehicle.remoteId);
        mp.prompt.showByName("vehicle_items_boot");
    } else {
        mp.events.callRemote(`vehicle.boot.items.clear`, vehicle.remoteId);
        mp.prompt.showByName("vehicle_open_boot");
    }
});