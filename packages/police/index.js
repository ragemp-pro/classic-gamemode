"use strict";
var factions = require('../factions');
var mapCase = require('../mapCase');
var notifs = require('../notifications');
var utils = require('../utils');
let timer = call('timer');

module.exports = {
    // Кол-во боеприпасов, списываемое за выдачу формы (LSPD, LSSD)
    clothesAmmo: 0,
    // Кол-во боеприпасов, списываемое за выдачу бронежилета (LSPD, LSSD)
    armourAmmo: 100,
    // Кол-во боеприпасов, списываемое за выдачу снаряжения (LSPD, LSSD)
    itemAmmo: 100,
    // Кол-во боеприпасов, списываемое за выдачу оружия (LSPD, LSSD)
    gunAmmo: 100,
    // Кол-во боеприпасов, списываемое за выдачу патронов (LSPD, LSSD)
    ammoAmmo: 1,
    // Комнаты в КПЗ ЛСПД
    cells: [{
            x: 460.03,
            y: -994.1,
            z: 24.91,
            h: 268.34
        },
        {
            x: 460.09,
            y: -998.03,
            z: 24.91,
            h: 268.34
        },
        {
            x: 460.02,
            y: -1001.57,
            z: 24.91,
            h: 268.34
        }
    ],
    // Выход из КПС ЛСПД
    cellExit: {
        x: 461.64,
        y: -989.16,
        z: 24.91,
        h: 93.45
    },
    // Комнаты в тюрьме за городом
    jailCells: [{
        x: 1753.02,
        y: 2623.72,
        z: 45.56,
        h: 228.06
    }],
    // Выход из тюрьмы за городом
    jailExit: {
        x: 1845.97,
        y: 2585.97,
        z: 45.67,
        h: 271.52
    },
    // Бонус ЗП за арест
    arrestPay: 10,
    // Время ареста за 1 ур. розыска (ms)
    arrestTime: 15 * 60 * 1000,
    // Время, через которое можно повторно искать преступника
    searchTime: 2 * 60 * 1000,
    // Организации, которые могут использовать наручники
    cuffsFactions: [1, 2, 3, 4, 6],
    // Стоимость освобождения игрока за 1 ур. розыска (ms)
    unarrestPrice: 1000,
    // Процент адвокату за освобождение (от 0.00 до 1.00)
    unarrestPayK: 0.05,


    setCuffs(player, cuffs) {
        if (cuffs) {
            player.playAnimation("mp_arresting", 'idle', 1, 49);
            var index = (player.character.gender == 0) ? 41 : 25;
            player.setClothes(7, index, 0, 0);
            player.cuffs = cuffs;
            player.call("police.cuffs.set", [true])
            player.setVariable("cuffs", true);
        } else {
            player.playAnimation("special_ped@tonya@intro", 'idle', 1, 49);
            player.setClothes(7, 0, 0, 0);
            delete player.cuffs;
            player.call("police.cuffs.set", [false])
            delete player.isFollowing;
            player.call("police.follow.stop");
            player.setVariable("cuffs", null);
        }
    },
    setWanted(player, wanted, cause = null) {
        if (wanted > player.character.wanted) {
            player.character.crimes += wanted - player.character.wanted;
            player.character.law -= wanted - player.character.wanted;
            mp.events.call("player.law.changed", player);
        }

        player.character.wanted = wanted;
        player.character.wantedCause = cause;
        player.character.save();
        player.call(`police.wanted.set`, [player.character.wanted]);

        if (!player.character.wanted) {
            mapCase.removePoliceWanted(player.character.id);
            mapCase.removeFibWanted(player.character.id);
        } else {
            mapCase.addPoliceWanted(player);
            mapCase.addFibWanted(player);
        }
    },
    getNearCell(player) {
        // return this.cells[0]; // tests
        var min = player.dist(this.cells[0]);
        var index = 0;
        for (var i = 1; i < this.cells.length; i++) {
            var dist = player.dist(this.cells[i]);
            if (dist < min) {
                min = dist;
                index = i;
            }
        }
        if (min > 5) return null;
        return this.cells[index];
    },
    getNearJailCell(player) {
        // return this.jailCells[0]; // tests
        var min = player.dist(this.jailCells[0]);
        var index = 0;
        for (var i = 1; i < this.jailCells.length; i++) {
            var dist = player.dist(this.cells[i]);
            if (dist < min) {
                min = dist;
                index = i;
            }
        }
        if (min > 5) return null;
        return this.jailCells[index];
    },
    startCellArrest(player, cell, time) {
        if (player.vehicle) player.removeFromVehicle();
        if (player.cuffs) this.setCuffs(player, null);
        if (player.character.wanted) this.setWanted(player, 0);
        if (player.character.arrestTime != time) player.character.update({
            arrestTime: time
        });
        if (player.character.arrestType != 0) player.character.update({
            arrestType: 0
        });
        if (!cell) {
            var i = utils.randomInteger(0, this.cells.length - 1);
            cell = this.cells[i];
        }

        delete player.isFollowing;
        player.call(`police.follow.stop`);
        player.call(`inventory.enable`, [false]);
        player.position = cell;
        player.heading = cell.h;
        var playerId = player.id;
        var characterId = player.character.id;
        mp.timer.remove(player.cellArrestTimer);
        mp.timer.remove(player.jailArrestTimer);
        player.cellArrestDate = Date.now();
        player.cellArrestTimer = mp.timer.add(() => {
            try {
                var rec = mp.players.at(playerId);
                if (!rec || rec.character.id != characterId || !rec.character.arrestTime) {
                    mp.timer.remove(player.cellArrestTimer);
                    return;
                }

                this.stopCellArrest(rec);
            } catch (err) {
                console.log(err.stack);
            }
        }, time);
    },
    startJailArrest(player, cell, time) {
        console.log(`startJailArrest: ${player.name}`)
        if (player.vehicle) player.removeFromVehicle();
        if (player.cuffs) this.setCuffs(player, false);
        if (player.character.wanted) this.setWanted(player, 0);
        if (player.character.arrestTime != time) player.character.update({
            arrestTime: time
        });
        if (player.character.arrestType != 1) player.character.update({
            arrestType: 1
        });
        if (!cell) {
            var i = utils.randomInteger(0, this.jailCells.length - 1);
            cell = this.jailCells[i];
        }

        delete player.isFollowing;
        player.call(`police.follow.stop`);
        player.call(`inventory.enable`, [false]);
        player.position = cell;
        player.heading = cell.h;
        var playerId = player.id;
        var characterId = player.character.id;
        mp.timer.remove(player.jailArrestTimer);
        mp.timer.remove(player.cellArrestTimer);
        player.jailArrestDate = Date.now();
        player.jailArrestTimer = mp.timer.add(() => {
            try {
                var rec = mp.players.at(playerId);
                if (!rec || !rec.character || rec.character.id != characterId || !rec.character.arrestTime) {
                    mp.timer.remove(player.cellArrestTimer);
                    return;
                }
                delete rec.jailArrestTimer;
                rec.call(`inventory.enable`, [true]);

                rec.position = this.jailExit;
                rec.heading = this.jailExit.h;

                rec.character.arrestTime = 0;
                rec.character.arrestType = 0;
                rec.character.save();

                notifs.success(rec, `Вы выпущены на свободу`, `Арест`);
            } catch (err) {
                console.log(err.stack);
            }
        }, time);
    },
    stopCellArrest(player) {
        mp.timer.remove(player.cellArrestTimer);
        delete player.cellArrestTimer;
        player.call(`inventory.enable`, [true]);

        player.position = this.cellExit;
        player.heading = this.cellExit.h;

        player.character.arrestTime = 0;
        player.character.arrestType = 0;
        player.character.save();

        notifs.success(player, `Вы выпущены на свободу`, `Арест`);
    },
    getUnarrestPrice(time) {
        var wanted = Math.ceil(time / this.arrestTime);
        return wanted * this.unarrestPrice;
    },
    getWanted() {
        var wanted = [];
        mp.players.forEach((rec) => {
            if (!rec.character) return;
            if (!rec.character.wanted) return;
            wanted.push(rec);
        });
        return wanted;
    },
    getSearchPosition(pos) {
        return pos;
    },
};
