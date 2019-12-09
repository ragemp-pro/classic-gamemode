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
    lsCells: [{
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
    lsCellExit: {
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
    // Комнаты в КПЗ БССД
    bcCells: [{
            x: -440.97,
            y: 5986.8,
            z: 31.71,
            h: 318.99
        },
        {
            x: -439.34,
            y: 5992.58,
            z: 31.71,
            h: 222.98
        }
    ],
    // Выход из КПС БССД
    bcCellExit: {
        x: -433.28,
        y: 5993.28,
        z: 31.71,
        h: 58.50
    },
    // Бонус ЗП за арест
    arrestPay: 10,
    // Время ареста за 1 ур. розыска (ms)
    arrestTime: 15 * 60 * 1000,
    // Время, через которое можно повторно искать преступника
    searchTime: 2 * 60 * 1000,
    // Организации, которые могут использовать наручники
    cuffsFactions: [1, 2, 3, 4, 6, 12, 13, 14],
    // Организации, которые могут производить обыск
    searchFactions: [1, 2, 3, 4, 6],
    // Стоимость освобождения игрока за 1 ур. розыска (ms)
    unarrestPrice: 1000,
    // Процент адвокату за освобождение (от 0.00 до 1.00)
    unarrestPayK: 0.05,
    // Мин. ранг, с которого можно выдавать лицению на оружие
    giveGunLicenseRank: 10,
    // Мин. ранг, с которого можно забирать лицению на оружие
    takeGunLicenseRank: 10,
    // Мин. ранг, с которого можно производить обыск
    searchRank: 10,


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
    getNearLSCell(player) {
        // return this.lsCells[0]; // tests
        var min = player.dist(this.lsCells[0]);
        var index = 0;
        for (var i = 1; i < this.lsCells.length; i++) {
            var dist = player.dist(this.lsCells[i]);
            if (dist < min) {
                min = dist;
                index = i;
            }
        }
        if (min > 5) return null;
        return this.lsCells[index];
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
    getNearBCCell(player) {
        // return this.bcCells[0]; // tests
        var min = player.dist(this.bcCells[0]);
        var index = 0;
        for (var i = 1; i < this.bcCells.length; i++) {
            var dist = player.dist(this.bcCells[i]);
            if (dist < min) {
                min = dist;
                index = i;
            }
        }
        if (min > 5) return null;
        return this.bcCells[index];
    },
    startLSCellArrest(player, cell, time) {
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
            var i = utils.randomInteger(0, this.lsCells.length - 1);
            cell = this.lsCells[i];
        }

        delete player.isFollowing;
        player.call(`police.follow.stop`);
        player.call(`police.arrest.set`, [player.character.arrestType]);
        player.call(`inventory.enable`, [false]);
        player.call(`hud.setData`, [{
            arrestTimeMax: parseInt(player.character.arrestTime / 1000)
        }]);
        (!player.health) ? player.spawn(cell): player.position = cell;
        player.dimension = 0;
        player.heading = cell.h;
        var playerId = player.id;
        var characterId = player.character.id;
        timer.remove(player.cellArrestTimer);
        timer.remove(player.jailArrestTimer);
        player.cellArrestDate = Date.now();
        player.cellArrestTimer = timer.add(() => {
            try {
                var rec = mp.players.at(playerId);
                if (!rec || rec.character.id != characterId || !rec.character.arrestTime) {
                    timer.remove(player.cellArrestTimer);
                    return;
                }

                this.stopCellArrest(rec);
            } catch (err) {
                console.log(err.stack);
            }
        }, time);
    },
    startJailArrest(player, cell, time) {
        // console.log(`startJailArrest: ${player.name}`)
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
        player.call(`police.arrest.set`, [player.character.arrestType]);
        player.call(`inventory.enable`, [false]);
        player.call(`hud.setData`, [{
            arrestTimeMax: parseInt(player.character.arrestTime / 1000)
        }]);
        (!player.health) ? player.spawn(cell): player.position = cell;
        player.dimension = 0;
        player.heading = cell.h;
        var playerId = player.id;
        var characterId = player.character.id;
        timer.remove(player.jailArrestTimer);
        timer.remove(player.cellArrestTimer);
        player.jailArrestDate = Date.now();
        player.jailArrestTimer = timer.add(() => {
            try {
                var rec = mp.players.at(playerId);
                if (!rec || !rec.character || rec.character.id != characterId || !rec.character.arrestTime) {
                    timer.remove(player.cellArrestTimer);
                    return;
                }
                delete rec.jailArrestTimer;
                rec.call(`inventory.enable`, [true]);
                rec.call(`police.arrest.set`, [null]);

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
    startBCCellArrest(player, cell, time) {
        // debug(`startBCCellArrest: ${player.name} ${cell} ${time}`)
        if (player.vehicle) player.removeFromVehicle();
        if (player.cuffs) this.setCuffs(player, null);
        if (player.character.wanted) this.setWanted(player, 0);
        if (player.character.arrestTime != time) player.character.update({
            arrestTime: time
        });
        if (player.character.arrestType != 2) player.character.update({
            arrestType: 2
        });
        if (!cell) {
            var i = utils.randomInteger(0, this.bcCells.length - 1);
            cell = this.bcCells[i];
        }
        debug(player.character.arrestTime)

        delete player.isFollowing;
        player.call(`police.follow.stop`);
        player.call(`police.arrest.set`, [player.character.arrestType]);
        player.call(`inventory.enable`, [false]);
        player.call(`hud.setData`, [{
            arrestTimeMax: parseInt(player.character.arrestTime / 1000)
        }]);
        (!player.health) ? player.spawn(cell): player.position = cell;
        player.dimension = 0;
        player.heading = cell.h;
        var playerId = player.id;
        var characterId = player.character.id;
        timer.remove(player.cellArrestTimer);
        timer.remove(player.jailArrestTimer);
        player.cellArrestDate = Date.now();
        player.cellArrestTimer = timer.add(() => {
            try {
                var rec = mp.players.at(playerId);
                if (!rec || rec.character.id != characterId || !rec.character.arrestTime) {
                    timer.remove(player.cellArrestTimer);
                    return;
                }

                this.stopCellArrest(rec);
            } catch (err) {
                console.log(err.stack);
            }
        }, time);
    },
    stopCellArrest(player) {
        timer.remove(player.cellArrestTimer);
        delete player.cellArrestTimer;
        player.call(`inventory.enable`, [true]);
        player.call(`police.arrest.set`, [null]);
        player.call(`hud.setData`, [{
            arrestTimeMax: 0
        }]);

        player.position = (!player.character.arrestType) ? this.lsCellExit : this.bcCellExit;
        player.heading = (!player.character.arrestType) ? this.lsCellExit.h : this.bcCellExit.h;

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
    getRandomArrestType() {
        return utils.randomInteger(0, 2);
    },
};
