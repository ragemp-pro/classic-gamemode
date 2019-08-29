"use strict";

module.exports = {
    // Общая информация о предметах
    inventoryItems: [],
    // Объект, подготовленный для отправки на клиент игрока
    clientInventoryItems: {},
    // Маски, при надевании которых, нужно скрывать волосы
    masksWithHideHairs: [114],
    // Вайт-лист предметов, которые можно надеть
    bodyList: {
        // columnIndex: [itemId, ...]
        0: [1],
        1: [6],
        2: [14],
        3: [2],
        4: [3],
        5: [7],
        6: [11],
        7: [10],
        8: [12],
        9: [], // автоматы
        10: [13],
        11: [8],
        12: [9],
    },
    // Блек-лист предметов, которые не могут храниться в других предметах
    blackList: {
        // parentItemId: [cildItemId, ...]
        3: [13],
        7: [13],
        8: [13],
    },

    init() {
        this.loadInventoryItemsFromDB();
    },

    // Загрузка общей информации о предметах из БД в данный модуль
    async loadInventoryItemsFromDB() {
        var dbItems = await db.Models.InventoryItem.findAll();
        this.inventoryItems = dbItems;
        this.clientInventoryItems = this.convertServerInventoryItemsToClient(dbItems);
        console.log(`[INVENTORY] Предметы инвентаря загружены (${dbItems.length} шт.)`);
    },
    convertServerInventoryItemsToClient(dbItems) {
        var client = {};
        for (var i = 0; i < dbItems.length; i++) {
            var item = dbItems[i];
            client[item.id] = this.convertServerInventoryItemToClient(item);
        }
        return client;
    },
    convertServerInventoryItemToClient(item) {
        return {
            name: item.name,
            description: item.description,
            height: item.height,
            width: item.width,
            weight: item.weight
        };
    },
    // Отправка общей информации о предметах игроку
    initPlayerItemsInfo(player) {
        player.call(`inventory.setItemsInfo`, [this.clientInventoryItems]);
        console.log(`[INVENTORY] Для игрока ${player.character.name} загружена общая информация о предметах`);
    },
    // Отправка общей информации о предмете
    updateItemInfo(item) {
        this.clientInventoryItems[item.id] = this.convertServerInventoryItemToClient(item);
        mp.players.forEach((rec) => {
            if (rec.character) rec.call(`inventory.setItemInfo`, [item.id, this.clientInventoryItems[item.id]]);
        });
    },
    async initPlayerInventory(player) {
        this.clearAllView(player);
        // TODO: include in include in include... WTF??? (08.08.19 Carter Slade)
        var dbItems = await db.Models.CharacterInventory.findAll({
            where: {
                playerId: player.character.id
            },
            order: [
                ['parentId', 'ASC']
            ],
            include: [{
                    model: db.Models.CharacterInventoryParam,
                    as: "params"
                },
                {
                    model: db.Models.InventoryItem,
                    as: "item"
                },
                {
                    model: db.Models.CharacterInventory,
                    as: "children",
                    include: [{
                            model: db.Models.CharacterInventoryParam,
                            as: "params"
                        },
                        {
                            model: db.Models.InventoryItem,
                            as: "item"
                        },
                        {
                            model: db.Models.CharacterInventory,
                            as: "children",
                            include: [{
                                    model: db.Models.CharacterInventoryParam,
                                    as: "params"
                                },
                                {
                                    model: db.Models.InventoryItem,
                                    as: "item"
                                },
                                {
                                    model: db.Models.CharacterInventory,
                                    as: "children",
                                    include: [{
                                            model: db.Models.CharacterInventoryParam,
                                            as: "params"
                                        },
                                        {
                                            model: db.Models.InventoryItem,
                                            as: "item"
                                        },
                                        {
                                            model: db.Models.CharacterInventory,
                                            as: "children",
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        player.inventory = {
            denyUpdateView: false, // запрещено ли обновлять внешний вид игрока
            items: dbItems, // предметы игрока
        };
        this.updateAllView(player);
        player.call(`inventory.initItems`, [this.convertServerToClientPlayerItems(dbItems)]);
        console.log(`[INVENTORY] Для игрока ${player.character.name} загружены предметы (${dbItems.length} шт.)`);
    },
    convertServerToClientPlayerItems(dbItems) {
        // console.log("convertServerToClientPlayerItems");
        var clientItems = {};
        for (var i = 0; i < dbItems.length; i++) {
            var dbItem = dbItems[i];
            if (!dbItem.parentId) clientItems[dbItem.index] = this.convertServerToClientItem(dbItem);
        }
        return clientItems;
    },
    convertServerToClientItem(dbItem) {
        // console.log(`convertServerToClientItem`);
        var params = {};
        if (dbItem.params) {
            for (var i = 0; i < dbItem.params.length; i++) {
                var param = dbItem.params[i];
                params[param.key] = param.value;
            }
        }
        var clientItem = {
            sqlId: dbItem.id,
            itemId: dbItem.itemId,
            params: params
        };
        if (params.pockets) {
            params.pockets = JSON.parse(params.pockets);
            clientItem.pockets = [];
            for (var j = 0; j < params.pockets.length; j += 2) {
                clientItem.pockets.push({
                    cols: params.pockets[j],
                    rows: params.pockets[j + 1],
                    items: {}
                });
            }
            delete params.pockets;
        }
        if (dbItem.children.length > 0) {
            for (var i = 0; i < dbItem.children.length; i++) {
                var child = dbItem.children[i];
                clientItem.pockets[child.pocketIndex].items[child.index] = this.convertServerToClientItem(child);
            }
        }
        return clientItem;
    },
    async addItem(player, itemId, params, callback = () => {}) {
        var slot = this.findFreeSlot(player, itemId);
        if (!slot) return callback(`Свободный слот для ${this.getInventoryItem(itemId).name} не найден`);
        var struct = [];
        for (var key in params) {
            struct.push({
                key: key,
                value: params[key]
            });
        }
        var item = await db.Models.CharacterInventory.create({
            playerId: player.character.id,
            itemId: itemId,
            pocketIndex: slot.pocketIndex,
            index: slot.index,
            parentId: slot.parentId,
            params: struct,
            children: [],
        }, {
            include: [{
                    model: db.Models.CharacterInventoryParam,
                    as: "params",
                },
                {
                    model: db.Models.CharacterInventory,
                    as: "children"
                }
            ]
        });

        player.inventory.items.push(item);
        if (!item.parentId) this.updateView(player, item);
        player.call("inventory.addItem", [this.convertServerToClientItem(item), item.pocketIndex, item.index, item.parentId]);
        callback();
    },
    deleteItem(player, item) {
        if (typeof item == 'number') item = this.getItem(player, item);
        if (!item) return console.log(`[inventory.deleteItem] Предмет #${item} у ${player.name} не найден`);

        if (!item.parentId) this.clearView(player, item.itemId);
        item.destroy();
        player.call("inventory.deleteItem", [item.id]);

        this.clearArrayItems(player, item);
    },
    clearItems(player) {
        var items = player.inventory.items;
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (!item.parentId) {
                this.deleteItem(player, item);
                i--;
            }
        }
    },
    clearArrayItems(player, item) {
        var items = player.inventory.items;
        var children = this.getChildren(player, item);
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            this.clearArrayItems(player, child);
        }
        var index = items.indexOf(item);
        items.splice(index, 1);
    },
    getInventoryItem(itemId) {
        return this.inventoryItems[itemId - 1];
    },
    getName(itemId) {
        return this.inventoryItems[itemId - 1].name;
    },
    getItem(player, sqlId) {
        for (var i = 0; i < player.inventory.items.length; i++) {
            var item = player.inventory.items[i];
            if (item.id == sqlId) return item;
        }
        return null;
    },
    getChildren(player, item) {
        var items = player.inventory.items;
        var children = [];
        for (var i = 0; i < items.length; i++) {
            var child = items[i];
            if (child.parentId == item.id) children.push(child);
        }
        return children;
    },
    getChildrenInPocket(player, item, pocketIndex) {
        var items = player.inventory.items;
        var children = [];
        for (var i = 0; i < items.length; i++) {
            var child = items[i];
            if (child.parentId == item.id && child.pocketIndex == pocketIndex) children.push(child);
        }
        return children;
    },
    updateView(player, item) {
        if (player.inventory.denyUpdateView) return;
        if (player.character.id != item.playerId) return;

        var params = this.getParamsValues(item);

        var clothesIndexes = {
            "2": 7,
            "8": 4,
            "9": 6,
            "13": 5
        };
        var propsIndexes = {
            "6": 0,
            "1": 1,
            "10": 2,
            "11": 6,
            "12": 7
        };
        var otherItems = {
            "3": () => {
                player.armour = parseInt(params.health);
                player.setClothes(9, params.variation, params.texture, 0);
            },
            "7": () => {
                var texture = params.tTexture || 0;
                player.setClothes(3, params.torso || 0, texture, 0);
                player.setClothes(11, params.variation, params.texture, 0);
                var texture = params.uTexture || 0;
                if (params.undershirt != null) player.setClothes(8, params.undershirt, texture, 0);
            },
            "14": (params) => {
                if (this.masksWithHideHairs.includes(params.variation)) player.setClothes(2, 0, 0, 0);
                player.setClothes(1, params.variation, params.texture, 0);
            }
        };

        if (clothesIndexes[item.itemId] != null) {
            player.setClothes(clothesIndexes[item.itemId], params.variation, params.texture, 0);
        } else if (propsIndexes[item.itemId] != null) {
            player.setProp(propsIndexes[item.itemId], params.variation, params.texture);
        } else if (otherItems[item.itemId] != null) {
            otherItems[item.itemId](params);
        } else return console.log("Неподходящий тип предмета для тела!");

    },
    clearView(player, itemId) {
        var clothesIndexes = {
            "2": 7,
            "13": 5
        };
        var propsIndexes = {
            "6": 0,
            "1": 1,
            "10": 2,
            "11": 6,
            "12": 7
        };
        var otherItems = {
            "3": () => {
                if (player.inventory) {
                    for (var i = 0; i < player.inventory.items.length; i++) {
                        var item = player.inventory.items[i];
                        if (!item.parentId && item.itemId == itemId) {
                            this.updateParam(item, "health", parseInt(player.armour));
                        }
                    }
                }
                player.armour = 0;
                player.setClothes(9, 0, 0, 0);
            },
            "7": () => {
                // 0 - муж, 1 - жен
                var index = (player.character.gender == 0) ? 15 : 82;
                var undershirtDefault = (player.character.gender == 0) ? 15 : 14;
                player.setClothes(3, 15, 0, 0);
                player.setClothes(11, index, 0, 0);
                player.setClothes(8, undershirtDefault, 0, 0);
            },
            "8": () => {
                player.setClothes(4, 18, 2, 0);
            },
            "9": () => {
                var index = (player.character.gender == 0) ? 34 : 35;
                player.setClothes(6, index, 0, 0);
            },
            "14": () => {
                player.setClothes(2, player.character.hair, 0, 0);
                player.setClothes(1, 0, 0, 0);
            }
        };

        if (clothesIndexes[itemId] != null) {
            player.setClothes(clothesIndexes[itemId], 0, 0, 0);
        } else if (propsIndexes[itemId] != null) {
            player.setProp(propsIndexes[itemId], -1, 0);
        } else if (otherItems[itemId] != null) {
            otherItems[itemId]();
        } else return console.log("Неподходящий тип предмета для тела!");
    },
    updateAllView(player) {
        for (var i = 0; i < player.inventory.items.length; i++) {
            var item = player.inventory.items[i];
            if (item.parentId) continue;
            this.updateView(player, item);
        }
    },
    clearAllView(player) {
        for (var index in this.bodyList) {
            var itemIds = this.bodyList[index];
            itemIds.forEach((itemId) => {
                this.clearView(player, itemId);
            });
        }
    },
    getParam(item, key) {
        for (var i = 0; i < item.params.length; i++) {
            var param = item.params[i];
            if (param.key == key) return param;
        }
        return null;
    },
    getParamsValues(item) {
        var params = {};
        for (var i = 0; i < item.params.length; i++) {
            var param = item.params[i];
            params[param.key] = param.value;
            if (param.key == 'pockets') params[param.key] = JSON.parse(params[param.key]);
        }
        return params;
    },
    updateParam(item, key, value) {
        var param = this.getParam(item, key);
        if (!param) return;
        param.value = value;
        param.save();
    },
    findFreeSlot(player, itemId) {
        var items = player.inventory.items;
        for (var bodyIndex in this.bodyList) {
            var list = this.bodyList[bodyIndex];
            if (list.includes(itemId)) { // предмет, можно надеть
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    if (!item.parentId && item.index == bodyIndex) break; // другой предмет на тело уже надет
                }
                var isFind = !items.length || (i && i == items.length);
                if (isFind) return {
                    pocketIndex: null,
                    index: bodyIndex,
                    parentId: null
                };
            }
        }

        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var params = this.getParamsValues(item);
            if (item.parentId || !params.pockets) continue; // предмет в предмете или не имеет карманы
            if (item.itemId == itemId) continue; // тип предмета совпадает (рубашку в рубашку нельзя и т.д.)
            if (this.blackList[item.itemId].includes(itemId)) continue; // предмет в черном списке (сумку в рубашку нельзя и т.д.)
            for (var j = 0; j < params.pockets.length / 2; j++) {
                var matrix = this.genMatrix(player, item, j);
                // console.log(`itemId: ${item.itemId}`);
                // console.log(`pocketIndex: ${j}`);
                // console.log(`matrix:`);
                // console.log(matrix);
                if (!matrix) continue;

                var freeIndex = this.findFreeIndexMatrix(matrix, itemId);
                // console.log(`freeIndex: ${freeIndex}`)
                if (freeIndex == -1) continue;

                return {
                    pocketIndex: j,
                    index: freeIndex,
                    parentId: item.id
                };
            }
        }
        return null;
    },
    genMatrix(player, item, pocketIndex) {
        var params = this.getParamsValues(item);
        if (!params.pockets) return null;

        var matrix = [];
        var cols = params.pockets[pocketIndex * 2];
        var rows = params.pockets[pocketIndex * 2 + 1];
        // Создаем пустую матрицу
        for (var i = 0; i < rows; i++) {
            matrix[i] = [];
            for (var j = 0; j < cols; j++) {
                matrix[i][j] = 0;
            }
        }

        var children = this.getChildrenInPocket(player, item, pocketIndex);
        // console.log(`------------ children:`);
        // console.log(children);
        // Наполняем матрицу занятами ячейками
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            var coord = this.indexToXY(rows, cols, child.index);
            if (!coord) continue;

            var info = this.getInventoryItem(child.itemId);
            for (var x = 0; x < info.width; x++) {
                for (var y = 0; y < info.height; y++) {
                    matrix[coord.y + y][coord.x + x] = 1;
                }
            }
        }

        return matrix;
    },
    indexToXY(rows, cols, index) {
        if (!rows || !cols) return null;
        var x = index % cols;
        var y = (index - x) / cols;
        if (x >= cols || y >= rows) return null;
        return {
            x: x,
            y: y
        };
    },
    xyToIndex(rows, cols, coord) {
        if (!rows || !cols) return -1;
        return coord.y * cols + coord.x;
    },
    findFreeIndexMatrix(matrix, itemId) {
        var info = this.getInventoryItem(itemId);
        if (!info || !matrix) return -1;
        var w = info.width;
        var h = info.height;

        for (var i = 0; i < matrix.length - h + 1; i++) {
            for (var j = 0; j < matrix[i].length - w + 1; j++) {
                var doBreak = false;
                for (var y = 0; y < h; y++) {
                    for (var x = 0; x < w; x++) {
                        if (matrix[i + y][j + x] == 1) {
                            doBreak = true;
                            break;
                        }
                    }
                    if (doBreak) break;
                }
                if (!doBreak) return this.xyToIndex(matrix.length, matrix[0].length, {
                    x: j,
                    y: i
                });
            }
        }

        return -1;
    },
    getItemByItemId(player, itemId) {
        var items = player.inventory.items;
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item.itemId == itemId) return item;
        }
        return null;
    },
    getArrayByItemId(player, itemId) {
        var items = player.inventory.items;
        var result = [];
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item.itemId == itemId) result.push(item);
        }
        return result;
    },
    // Полное удаление предметов инвентаря с сервера
    fullDeleteItemsByParams(itemId, keys, values) {
        /* Для всех игроков. */
        mp.players.forEach((rec) => {
            if (rec.character) this.deleteByParams(rec, itemId, keys, values);
        });
        /* Для всех объектов на полу. */
        // TODO: ...
        // mp.objects.forEach((obj) => {
        //     if (obj.getVariable("inventoryItemSqlId") > 0) {
        //         var item = obj.item;
        //         var doDelete = true;
        //         for (var i = 0; i < keys.length; i++) {
        //             var param = item.params[keys[i]];
        //             if (!param) {
        //                 doDelete = false;
        //                 break;
        //             }
        //             if (param && param != values[i]) {
        //                 doDelete = false;
        //                 break;
        //             }
        //         }
        //         if (doDelete) {
        //             DB.Handle.query(`DELETE FROM inventory_players WHERE id=?`, obj.getVariable("inventoryItemSqlId"));
        //             obj.destroy();
        //         }
        //     }
        // });
        /* Для всех игроков из БД. */
        // TODO: ^^
    },
    deleteByParams(player, itemId, keys, values) {
        if (keys.length != values.length) return;

        var items = this.getArrayByItemId(player, itemId);
        if (!items.length) return;

        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var params = this.getParamsValues(item);
            var doDelete = true;
            for (var i = 0; i < keys.length; i++) {
                var param = params[keys[i]];
                if (!param) {
                    doDelete = false;
                    break;
                }
                if (param && param != values[i]) {
                    doDelete = false;
                    break;
                }
            }
            if (doDelete) this.deleteItem(player, item);
        }
    },
};
