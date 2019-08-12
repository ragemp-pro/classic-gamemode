var inventory = new Vue({
    el: '#inventory',
    data: {
        // Макс. вес предметов, переносимый игроком
        maxPlayerWeight: 15,
        // Общая информация о предметах
        itemsInfo: {
            1: {
                name: 'Очки',
                description: 'Описание очков.',
                height: 2,
                width: 3,
                weight: 0.1
            },
            3: {
                name: 'Бронежилет',
                description: 'Описание броника.',
                height: 6,
                width: 8,
                weight: 10
            },
            7: {
                name: 'Рубашка',
                description: 'Описание рубашки.',
                height: 5,
                width: 4,
                weight: 0.1
            },
            8: {
                name: 'Штаны',
                description: 'Описание штанов.',
                height: 6,
                width: 8,
                weight: 0.1
            },
            9: {
                name: 'Ботинки',
                description: 'Описание ботинков.',
                height: 3,
                width: 3,
                weight: 0.1
            },
            13: {
                name: 'Сумка',
                description: 'Описание сумки.',
                height: 6,
                width: 8,
                weight: 2
            },
            18: {
                name: 'Фонарь SureFire G2 Nitrolon',
                description: 'Компактный, легкий и мощный фонарик, который можно использовать как подствольный целеуказатель.',
                height: 6,
                width: 8,
                weight: 2,
            },
            24: {
                name: 'Аптечка',
                description: 'Описание аптечки.',
                height: 6,
                width: 8,
                weight: 0.1,
            },
            37: {
                name: 'Патрон',
                description: 'Описание патрона.',
                height: 4,
                width: 4,
                weight: 0.02,
            },
        },
        // Меню предмета по ПКМ
        itemsMenu: {
            // itemId: struct menu
            18: {
                'Включить': {
                    handler(item) {
                        console.log(`Включить ${item}`)
                    }
                }
            },
            24: {
                'Лечить': {
                    handler(item) {
                        console.log(`лечить ${item}`)
                    }
                }
            },
            37: {
                'Разрядить': {
                    handler(item) {
                        console.log(`разрядить: ${item}`)
                    }
                },
                'Сломать': {
                    handler(item) {
                        console.log(`сломать ${item}`);
                    }
                },
                'Разобрать': {
                    items: {
                        'Полностью': {
                            handler(item) {
                                console.log(`Полностью ${item}`)
                            }
                        },
                        'Для переноски': {
                            handler(item) {
                                console.log(`для переноски ${item}`)
                            }
                        },
                    }
                },
                'Присоединить': {
                    handler(item) {
                        console.log(`Присоединить ${item}`);
                    }
                },
                'Отсоединить': {
                    handler(item) {
                        console.log(`Отсоединить ${item}`);
                    }
                },
            },
        },
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
            9: [21, 22, 23, 48, 49, 50, 51, 52, 53, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100], // автоматы
            10: [13],
            11: [8],
            12: [9],
        },
        // Вайт-лист предметов, которые можно использовать в горячих клавишах
        hotkeysList: {
            // itemId: {...}
            24: {
                handler(item) {
                    console.log("Обработчик горячей клавиши. Предмет: " + item.sqlId);
                    item.params.count--;
                }
            }
        },
        // Блек-лист предметов, которые не могу храниться в других предметах
        blackList: {
            7: [13],
        },
        // Предметы в окружении (земля, шкаф, багажник, холодильник, ...)
        environment: [],
        // Предметы на игроке (экипировка)
        equipment: {},
        // Предметы на горячих клавишах
        hotkeys: {},
        // Предметы в руках
        hands: {
            left: null,
            right: null
        },
        // Сытость игрока
        satiety: 0,
        // Жажда игрока
        thirst: 0,
        // Режим отладки
        debug: true,
        // Показ инвентаря на экране
        show: false,
        // Возможность использования инвентаря
        enable: false,
        // Показ описания предмета на экране
        itemDesc: {
            item: null,
            x: 0,
            y: 0
        },
        // Показ меню предмета на экране
        itemMenu: {
            item: null,
            x: 0,
            y: 0
        },
        // Показа переносимого предмета на экране
        itemDrag: {
            item: null,
            div: null,
            accessColumns: {
                placeSqlId: null,
                pocketI: null,
                deny: false,
                columns: {},
                bodyFocus: null,
                hotkeyFocus: null,
            },
            x: 0,
            y: 0
        },
    },
    computed: {
        // Тяжесть игрока (в %)
        playerWeight() {
            var weight = this.getItemWeight(Object.values(this.equipment));
            return weight / this.maxPlayerWeight * 100;
        },
        equipmentBusyColumns() {
            var cols = {};
            for (var i in this.equipment) {
                var equip = this.equipment[i];
                if (!equip.pockets) continue;
                cols[equip.sqlId] = {};
                for (var j in equip.pockets) {
                    var pocket = equip.pockets[j];
                    if (!Object.keys(pocket.items).length) continue;
                    cols[equip.sqlId][j] = {};
                    for (var index in pocket.items) {
                        var item = pocket.items[index];
                        var w = this.itemsInfo[item.itemId].width;
                        var h = this.itemsInfo[item.itemId].height;
                        var coord = this.indexToXY(pocket.rows, pocket.cols, index);
                        for (var x = 0; x < w; x++) {
                            for (var y = 0; y < h; y++) {
                                var i = this.xyToIndex(pocket.rows, pocket.cols, {
                                    x: coord.x + x,
                                    y: coord.y + y
                                });
                                cols[equip.sqlId][j][i] = item.sqlId;
                            }
                        }
                    }
                }
            }

            return cols;
        },
        environmentBusyColumns() {
            var cols = {};
            for (var i in this.environment) {
                var env = this.environment[i];
                cols[env.sqlId] = {};
                for (var j in env.pockets) {
                    var pocket = env.pockets[j];
                    cols[env.sqlId][j] = {};
                    for (var index in pocket.items) {
                        var item = pocket.items[index];
                        var w = this.itemsInfo[item.itemId].width;
                        var h = this.itemsInfo[item.itemId].height;
                        var coord = this.indexToXY(pocket.rows, pocket.cols, index);
                        for (var x = 0; x < w; x++) {
                            for (var y = 0; y < h; y++) {
                                var i = this.xyToIndex(pocket.rows, pocket.cols, {
                                    x: coord.x + x,
                                    y: coord.y + y
                                });
                                cols[env.sqlId][j][i] = item.sqlId;
                            }
                        }
                    }
                }
            }

            return cols;
        },
    },
    methods: {
        // ******************  [ Private ] ******************
        urlItemImg(itemId) {
            return `img/inventory/items/${itemId}.png`;
        },
        itemStyle(itemId) {
            var url = this.urlItemImg(itemId);
            var style = {
                backgroundImage: `url(${url})`,
                height: this.itemsInfo[itemId].height * 2 + "vh",
                width: this.itemsInfo[itemId].width * 2 + "vh",
                pointerEvents: (this.itemDrag.item) ? 'none' : '',
            };
            return style;
        },
        valueColor(value) {
            if (value > 50) return "#bf0";
            if (value > 15) return "#fb0";
            return "#b44";
        },
        onBodyItemEnter(index) {
            if (!this.itemDrag.item) return;
            var item = this.equipment[index];
            if (item) return;
            if (!this.bodyList[index].includes(this.itemDrag.item.itemId)) return;
            var columns = this.itemDrag.accessColumns;
            columns.bodyFocus = index;
        },
        onBodyItemLeave(index) {
            var columns = this.itemDrag.accessColumns;
            columns.bodyFocus = null;
        },
        onHotkeyItemEnter(key) {
            // console.log("onHotkeyItemEnter")
            if (!this.itemDrag.item) return;
            var item = this.hotkeys[key];
            if (item) return;
            if (!this.hotkeysList[this.itemDrag.item.itemId]) return;
            var columns = this.itemDrag.accessColumns;
            columns.hotkeyFocus = key;
        },
        onHotkeyItemLeave(key) {
            // console.log("onHotkeyItemLeave")
            var columns = this.itemDrag.accessColumns;
            columns.hotkeyFocus = null;
        },
        itemMouseHandler(item, e) {
            var handlers = {
                'mouseenter': (e) => {
                    this.itemDesc.item = item;
                    var itemDiv = e.target;
                    this.itemDesc.x = e.pageX + itemDiv.offsetWidth / 5;
                    this.itemDesc.y = e.pageY + itemDiv.offsetHeight / 5;
                },
                'mouseleave': (e) => {
                    this.itemDesc.item = null;
                },
                'mousemove': (e) => {
                    var itemDiv = e.target;
                    this.itemDesc.x = e.pageX + itemDiv.offsetWidth / 5;
                    this.itemDesc.y = e.pageY + itemDiv.offsetHeight / 5;
                },
                'contextmenu': (e) => {
                    this.itemMenu.item = item;
                    this.itemMenu.x = e.pageX;
                    this.itemMenu.y = e.pageY;
                },
                'mousedown': (e) => {
                    if (e.which == 1) { // Left Mouse Button
                        this.itemDrag.item = item;
                        this.itemDrag.div = e.target;
                        this.itemDrag.x = e.pageX;
                        this.itemDrag.y = e.pageY;
                    }
                },
            };
            handlers[e.type](e);
        },
        columnMouseHandler(place, pocket, index, e) {
            if (!this.itemDrag.item) return;
            var columns = this.itemDrag.accessColumns;
            var pocketI = place.pockets.indexOf(pocket);
            var w = this.itemsInfo[this.itemDrag.item.itemId].width;
            var h = this.itemsInfo[this.itemDrag.item.itemId].height;
            if (w > pocket.cols || h > pocket.rows) return;
            var coord = this.indexToXY(pocket.rows, pocket.cols, index);
            coord.x = Math.clamp(coord.x - parseInt(w / 2), 0, pocket.cols - w);
            coord.y = Math.clamp(coord.y - parseInt(h / 2), 0, pocket.rows - h);
            var handlers = {
                'mouseenter': (e) => {
                    // console.log('mouseenter')
                    columns.placeSqlId = place.sqlId;
                    columns.pocketI = pocketI;
                    columns.deny = place.sqlId == this.itemDrag.item.sqlId ||
                        place.itemId == this.itemDrag.item.itemId ||
                        (this.blackList[place.itemId] && this.blackList[place.itemId].includes(this.itemDrag.item.itemId));
                    for (var x = 0; x < w; x++) {
                        for (var y = 0; y < h; y++) {
                            var i = this.xyToIndex(pocket.rows, pocket.cols, {
                                x: coord.x + x,
                                y: coord.y + y
                            });
                            columns.columns[i] = true;
                            if (!columns.deny) columns.deny = this.isColumnBusy(place, pocketI, i, this.itemDrag.item);
                        }
                    }
                },
                'mouseleave': (e) => {
                    columns.placeSqlId = null;
                    columns.pocketI = null;
                    columns.index = null;
                    columns.deny = false;
                    columns.columns = {};
                },
            }
            handlers[e.type](e);
        },
        isColumnBusy(place, pocketI, index, item) {
            var cols = (place.sqlId > 0) ? this.equipmentBusyColumns : this.environmentBusyColumns;
            if (!cols[place.sqlId][pocketI]) return false;
            if (!cols[place.sqlId][pocketI][index]) return false;
            return cols[place.sqlId][pocketI][index] != item.sqlId;
        },
        columnClass(index, pocket, place) {
            var classes = {
                access: this.isColumnAccess(index, pocket, place),
            };
            if (classes.access && this.itemDrag.accessColumns.deny)
                classes.deny = true;

            return classes;
        },
        getItemsCount(item) {
            if (!item.pockets) return 0;
            var count = 0;
            item.pockets.forEach((pocket) => {
                for (var index in pocket.items) {
                    count++;
                }
            });
            return count;
        },
        isColumnAccess(index, pocket, place) {
            if (!this.itemDrag.item) return false;
            var columns = this.itemDrag.accessColumns;
            if (columns.placeSqlId != place.sqlId) return false;
            var pocketI = place.pockets.indexOf(pocket);
            if (pocketI == -1) return false;
            if (columns.pocketI != pocketI) return false;
            if (!columns.columns[index]) return false;

            return true;
        },
        getPlaceWeight(place) {
            var weight = 0;
            for (var i in place.pockets) {
                var pocket = place.pockets[i];
                weight += this.getItemWeight(Object.values(pocket.items));
            }
            return weight;
        },
        getItemWeight(items, weight = 0) {
            if (!Array.isArray(items)) items = [items];
            for (var index in items) {
                var item = items[index];
                var info = this.itemsInfo[item.itemId];
                // if (!info) return weight;
                weight += info.weight;
                if (item.params.count) weight += item.params.count * info.weight;
                if (item.pockets) {
                    for (var key in item.pockets) {
                        var pocket = item.pockets[key];
                        weight += this.getItemWeight(Object.values(pocket.items), 0);
                    }
                }
            }

            return weight;
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
        getItemBySqlId(sqlId, items) {
            if (!sqlId || sqlId == -1) return null;
            for (var index in items) {
                var item = items[index];
                if (item.sqlId == sqlId) return item;
                if (item.pockets) {
                    for (var key in item.pockets) {
                        var pocket = item.pockets[key];
                        var it = this.getItemBySqlId(sqlId, pocket.items);
                        if (it) return it;
                    }
                }
            }
            return null;
        },
        notify(message) {
            alert("[Inventory] " + message);
        },
        callRemote(eventName, values) {
            // console.log(`callRemote: ${eventName}`);
            // console.log(values)

            mp.trigger("callRemote", eventName, JSON.stringify(values));
        },

        // ******************  [ Inventory Config ] ******************
        setItemsInfo(itemsInfo) {
            if (typeof itemsInfo == 'string') itemsInfo = JSON.parse(itemsInfo);
            for (var itemId in itemsInfo) {
                Vue.set(this.itemsInfo, itemId, itemsInfo[itemId]);
            }
        },
        // ******************  [ Player Inventory ] ******************
        getItem(sqlId) {
            var item = this.getItemBySqlId(sqlId, this.equipment);
            return item;
        },
        addItem(item, pocket, index, parent) {
            if (typeof item == 'number') item = this.getItem(item);
            if (typeof parent == 'number') parent = this.getItem(parent);

            this.deleteItem(item.sqlId);
            this.deleteEnvironmentItem(item.sqlId);
            if (item.pockets) {
                item.showPockets = true;
            }
            if (parent) {
                Vue.set(parent.pockets[pocket].items, index, item);
            } else Vue.set(this.equipment, index, item);
        },
        initItems(items) {
            if (typeof items == 'string') items = JSON.parse(items);
            for (var index in items) {
                var item = items[index];
                this.addItem(item, null, index);
            }
        },
        deleteItem(sqlId, items = this.equipment) {
            for (var index in items) {
                var item = items[index];
                if (item.sqlId == sqlId) Vue.delete(items, index);
                if (item.pockets) {
                    for (var key in item.pockets) {
                        var pocket = item.pockets[key];
                        this.deleteItem(sqlId, pocket.items);
                    }
                }
            }
        },
        setItemParam(item, keys, values) {
            if (typeof item == 'number') item = this.getItem(item);
            if (!item) return this.notify(`setItemParam: Предмет ${item} не найден`);
            if (!Array.isArray(keys)) keys = [keys];
            if (!Array.isArray(values)) values = [values];
            for (var i in keys) {
                Vue.set(item.params, keys[i], values[i]);
            }
        },
        getItemInfoHash(itemId) {
            var info = this.itemsInfo[itemId];
            var hash = info.name.length +
                info.description.length +
                info.height +
                info.width +
                info.weight * 1000;
            return hash;
        },
        getItemsInfoHashes(chunk = 2) {
            var hashes = [];
            for (var itemId in this.itemsInfo) {
                hashes.push(this.getItemInfoHash(itemId));
            }
            for (var i = 0; i < hashes.length; i++) {
                for (var j = 1; j < chunk; j++) {
                    if (!hashes[i + j]) break;
                    hashes[i] += hashes[i + j];
                }
                hashes.splice(i + 1, chunk - 1);
            }
            return hashes;
        },

        // ******************  [ Hotkeys ] ******************
        bindHotkey(itemSqlId, key) {
            var item = this.getItem(itemSqlId);
            if (!item) return this.notify(`Предмет должен находиться в инвентаре`);
            this.clearHotkeys(item);
            Vue.set(this.hotkeys, key, item);
        },
        unbindHotkey(key) {
            Vue.delete(this.hotkeys, key);
        },
        onUseHotkey(key) {
            if (!key) key = 10; // для клавиши '0'
            var item = this.hotkeys[key];
            if (!item) return;
            this.hotkeysList[item.itemId].handler(item);
        },
        clearHotkeys(item) {
            if (typeof item == 'number') item = this.getItem(item);
            for (var key in this.hotkeys) {
                var it = this.hotkeys[key];
                if (it.sqlId == item.sqlId) this.unbindHotkey(key);
            }
        },

        // ******************  [ Hands ] ******************
        fillHand(item, hand) {
            if (typeof item == 'number') item = this.getItem(item);
            if (!item) return this.notify(`fillHand: Предмет ${item} не опреден`);

            this.hands[hand] = item;
        },
        clearHand(hand) {
            this.hands[hand] = null;
        },

        // ******************  [ Environment ] ******************
        addEnvironmentPlace(place) {
            place.showPockets = true;
            this.environment.unshift(place);
        },
        deleteEnvironmentPlace(sqlId) {
            for (var i in this.environment) {
                var place = this.environment[i];
                if (place.sqlId == sqlId) Vue.delete(this.environment, i);
            }
        },
        getEnvironmentPlace(sqlId) {
            for (var i in this.environment) {
                var place = this.environment[i];
                if (place.sqlId == sqlId) return place;
            }
            return null;
        },
        getEnvironmentItem(sqlId) {
            var item;
            for (var i in this.environment) {
                var place = this.environment[i];
                for (var j in place.pockets) {
                    var pocket = place.pockets[j];
                    item = this.getItemBySqlId(sqlId, pocket.items);
                    if (item) break;
                }
                if (item) break;
            }
            return item;
        },
        addEnvironmentItem(item, pocket, index, placeSqlId) {
            this.deleteEnvironmentItem(item.sqlId);
            this.deleteItem(item.sqlId);

            var place = this.getEnvironmentPlace(placeSqlId);
            if (!place) return this.notify(`addEnvironmentItem: место с sqlId ${placeSqlId} не найдено`);
            Vue.set(place.pockets[pocket].items, index, item);
        },
        deleteEnvironmentItem(sqlId) {
            var places = this.environment;
            for (var i in places) {
                var place = places[i];
                for (var j in place.pockets) {
                    var items = place.pockets[j].items;
                    for (var index in items) {
                        var item = items[index];
                        if (item.sqlId == sqlId) Vue.delete(items, index);
                        if (item.pockets) {
                            for (var key in item.pockets) {
                                var pocket = item.pockets[key];
                                this.deleteItem(sqlId, pocket.items);
                            }
                        }
                    }
                }
            }
        },
        setEnvironmentItemParam(item, keys, values) {
            if (typeof item == 'number') item = this.getEnvironmentItem(item);
            if (!item) return this.notify(`setEnvironmentItemParam: Предмет ${item} не найден`);
            if (!Array.isArray(keys)) keys = [keys];
            if (!Array.isArray(values)) values = [values];
            for (var i in keys) {
                Vue.set(item.params, keys[i], values[i]);
            }
        },
    },
    watch: {
        enable(val) {
            if (!val) this.show = false;
        },
        show(val) {
            setCursor(val);
            mp.trigger("blur", val, 300);
            hud.show = !val;
            // TODO: Скрытие/показ чата.
        }
    },
    mounted() {
        let self = this;
        window.addEventListener('keyup', function(e) {
            if (e.keyCode == 73 && self.enable) self.show = !self.show;
            if (e.keyCode > 47 && e.keyCode < 58) {
                var num = e.keyCode - 48;
                self.onUseHotkey(num);
            }
        });
        window.addEventListener('click', function(e) {
            self.itemMenu.item = null;
        });
        window.addEventListener('mousemove', function(e) {
            if (self.itemDrag.item) {
                var itemDiv = self.itemDrag.div;
                self.itemDrag.x = e.pageX - itemDiv.offsetWidth / 2;
                self.itemDrag.y = e.pageY - itemDiv.offsetHeight / 2;
            }
        });
        window.addEventListener('mouseup', function(e) {
            // console.log(JSON.stringify(self.itemDrag))
            var columns = self.itemDrag.accessColumns;
            if (columns.bodyFocus != null) {
                self.addItem(self.itemDrag.item, null, columns.bodyFocus);
                self.callRemote("item.add", {
                    sqlId: self.itemDrag.item.sqlId,
                    pocketI: null,
                    index: columns.bodyFocus,
                    placeSqlId: null
                });
            } else if (columns.hotkeyFocus) {
                self.bindHotkey(self.itemDrag.item.sqlId, columns.hotkeyFocus);
            } else {
                var index = Object.keys(columns.columns)[0];
                if (!columns.deny && columns.placeSqlId != null &&
                    columns.pocketI != null &&
                    index != null) {
                    if (columns.placeSqlId > 0) self.addItem(self.itemDrag.item, columns.pocketI, index, columns.placeSqlId)
                    else self.addEnvironmentItem(self.itemDrag.item, columns.pocketI, index, columns.placeSqlId)
                    self.callRemote("item.add", {
                        sqlId: self.itemDrag.item.sqlId,
                        pocketI: columns.pocketI,
                        index: index,
                        placeSqlId: columns.placeSqlId
                    });
                }
            }

            self.itemDrag.item = null;
            self.itemDrag.div = null;
            columns.placeSqlId = null;
            columns.pocketI = null;
            columns.columns = {};
            columns.bodyFocus = null;
        });
    }
});

// for tests
/*inventory.initItems({
    0: {
        sqlId: 100,
        itemId: 1,
        params: {}
    },
    5: {
        sqlId: 200,
        itemId: 7,
        params: {},
        pockets: [{
                cols: 9,
                rows: 20,
                items: {}
            },
            {
                cols: 5,
                rows: 5,
                items: {
                    2: {
                        sqlId: 300,
                        itemId: 1,
                        params: {}
                    }
                }
            }
        ]
    }
});

inventory.addEnvironmentPlace({
    sqlId: -200,
    header: "Холодильник",
    pockets: [{
            cols: 5,
            rows: 7,
            items: {},
        },
        {
            cols: 5,
            rows: 7,
            items: {},
        },
        {
            cols: 7,
            rows: 7,
            items: {},
        }
    ],
});
inventory.addEnvironmentPlace({
    sqlId: -100,
    header: "Шкаф",
    pockets: [{
            cols: 10,
            rows: 8,
            items: {
                0: {
                    sqlId: 595,
                    itemId: 7,
                    pockets: [{
                        cols: 5,
                        rows: 5,
                        items: {},
                    }],
                    params: {}
                }
            },
        },
        {
            cols: 9,
            rows: 8,
            items: {
                0: {
                    sqlId: 590,
                    itemId: 13,
                    pockets: [{
                        cols: 5,
                        rows: 6,
                        items: {
                            0: {
                                sqlId: 600,
                                itemId: 7,
                                pockets: [{
                                    rows: 10,
                                    cols: 10,
                                    items: {
                                        0: {
                                            sqlId: 427,
                                            itemId: 13,
                                            pockets: [{
                                                    cols: 5,
                                                    rows: 3,
                                                    items: {}
                                                },
                                                {
                                                    cols: 5,
                                                    rows: 3,
                                                    items: {}
                                                },
                                                {
                                                    cols: 5,
                                                    rows: 3,
                                                    items: {}
                                                },
                                            ],
                                            params: {}
                                        }
                                    }
                                }],
                                params: {}
                            }
                        }
                    }],
                    params: {},
                }
            },
        },
        {
            cols: 4,
            rows: 2,
            items: {},
        },
        {
            cols: 5,
            rows: 2,
            items: {},
        }
    ],
});
inventory.addEnvironmentPlace({
    sqlId: 0,
    header: "На земле",
    pockets: [{
        cols: 19,
        rows: 30,
        items: {
            0: {
                sqlId: 1,
                itemId: 37,
                // index: 0,
                params: {
                    count: 110
                }
            },
            5: {
                sqlId: 2,
                itemId: 37,
                // index: 5,
                params: {
                    count: 10
                }
            },
            10: {
                sqlId: 3,
                itemId: 24,
                // index: 10,
                params: {
                    count: 4,
                    health: 70,
                }
            },
            140: {
                sqlId: 4,
                itemId: 18,
                // index: 10,
                params: {
                    health: 70,
                }
            },
            148: {
                sqlId: 5,
                itemId: 1,
                // index: 10,
                params: {}
            },
        }
    }]
});
inventory.show = true;
inventory.enable = true;*/