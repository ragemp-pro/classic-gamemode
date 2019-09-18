"use strict";


/*
    Модуль мафий (организации).

    created 18.09.19 by Carter Slade
*/

mp.mafia = {
    // Блипы зон для рекетов
    mafiaZones: [],
    // Цвета блипов (factionId: blipColor)
    colors: {
        12: 2,
        13: 27,
        14: 46,
    },
    // Нативки
    natives: {
        _GET_BLIP_INFO_ID_ITERATOR: "0x186E5D252FA50E7D",
        GET_FIRST_BLIP_INFO_ID: "0x1BEDE233E6CD2A1F",
        GET_NEXT_BLIP_INFO_ID: "0x14F96AA50D6FBEA7",
        DOES_BLIP_EXIST: "0xA6DB27D19ECBB7DA",
        SET_BLIP_SPRITE: "0xDF735600A4696DAF",
        SET_BLIP_ALPHA: "0x45FF974EEE1C8734",
        SET_BLIP_ROTATION: "0xF87683CDF73C3F6E",
        SET_BLIP_COLOUR: "0x03D7FB09E75D6B7E",
        SET_BLIP_FLASHES: "0xB14552383D39CE3E",
        GET_BLIP_COLOUR: "0xDF729E8D20CF7327",
        _SET_BLIP_SHOW_HEADING_INDICATOR: "0x5FBCA48327B914DF",
    },
    flashTimer: null,
    flashColor: 1,
    bizWarTimer: null,
    bizWarFactions: [],


    initMafiaZones(zones) {
        this.clearMafiaZones();
        zones.forEach(zone => {
            var blip = mp.game.ui.addBlipForRadius(zone.x, zone.y, 50, 150);
            mp.game.invoke(this.natives.SET_BLIP_SPRITE, blip, 5);
            mp.game.invoke(this.natives.SET_BLIP_ALPHA, blip, 120);
            mp.game.invoke(this.natives.SET_BLIP_COLOUR, blip, 4);
            this.mafiaZones.push(blip);
            this.saveBlip(blip);
            if (zone.flash) this.flashBlip(zone.id, true);
        });
    },
    clearMafiaZones() {
        var blips = mp.storage.data.mafiaZones;
        if (!blips) return;
        blips.forEach(blip => {
            mp.game.ui.removeBlip(blip);
        });
        blips = [];
    },
    saveBlip(blip) {
        if (!mp.storage.data.mafiaZones) mp.storage.data.mafiaZones = [];
        mp.storage.data.mafiaZones.push(blip);
    },
    flashBlip(id, toggle) {
        var blip = this.mafiaZones[id];
        // mp.game.invoke(this.natives.SET_BLIP_FLASHES, blip, toggle);
        clearInterval(this.flashTimer);
        if (!toggle) return;
        var oldColor = mp.game.invoke(this.natives.GET_BLIP_COLOUR, blip);
        this.flashTimer = setInterval(() => {
            var color = mp.game.invoke(this.natives.GET_BLIP_COLOUR, blip);
            if (color == oldColor) mp.game.invoke(this.natives.SET_BLIP_COLOUR, blip, this.flashColor);
            else mp.game.invoke(this.natives.SET_BLIP_COLOUR, blip, oldColor);
        }, 500);
    },
    startBizWar(mafiaId, enemyMafiaId, time, mafiaScore = 0, enemyMafiaScore = 0) {
        time = parseInt(time);
        mp.callCEFV(`captureScore.start(${mafiaId}, ${enemyMafiaId}, ${time}, ${mafiaScore}, ${enemyMafiaScore})`);
        clearTimeout(this.bizWarTimer);
        this.removePlayerBlips();
        this.bizWarFactions = [mafiaId, enemyMafiaId];

        this.createPlayerBlips();
        this.bizWarTimer = setTimeout(() => {
            this.removePlayerBlips();
            this.bizWarFactions = [];
        }, time * 1000);
    },
    setBizWarScore(mafiaId, score) {
        mp.callCEFV(`captureScore.setScore(${mafiaId}, ${score})`);
    },
    logKill(target, killer, reason) {
        reason = parseInt(reason);
        // if (killer)
        //     debug(`[KILL-LIST] ${killer.name} killed ${target.name} with reason ${reason}`)
        // else
        //     debug(`[KILL-LIST] ${target.name} сам себя with reason ${reason}`)


        if (typeof target == 'object') target = JSON.stringify(target);
        if (typeof killer == 'object') killer = JSON.stringify(killer);
        // самоубийство
        if (reason == 3452007600) return mp.callCEFV(`killList.add('${target}')`);
        // на авто
        if (reason == 2741846334) return mp.callCEFV(`killList.add('${target}', '${killer}', 'car')`);
        // рукопашка
        if (reason == 2725352035) return mp.callCEFV(`killList.add('${target}', '${killer}', 'hand')`);

        // огнестрел, либо что-то еще? :D
        var name = mp.weapons.getWeaponName(reason);
        mp.callCEFV(`killList.add('${target}', '${killer}', '${name}')`);
    },
    createPlayerBlip(player) {
        if (!this.bizWarFactions.length) return;
        if (player.remoteId == mp.players.local.remoteId) return;
        var factionId = player.getVariable("factionId");
        if (!this.bizWarFactions.includes(factionId)) return;
        player.createBlip(1);
        mp.game.invoke(this.natives._SET_BLIP_SHOW_HEADING_INDICATOR, player.blip, true);
        mp.game.invoke(this.natives.SET_BLIP_COLOUR, player.blip, this.colors[factionId]);
    },
    createPlayerBlips() {
        // debug(`createPlayerBlips`)
        mp.players.forEach(rec => {
            this.createPlayerBlip(rec);
        });
    },
    removePlayerBlips() {
        // debug(`removePlayerBlips`)
        mp.players.forEach(rec => {
            var factionId = rec.getVariable("factionId");
            if (!mp.factions.isMafiaFaction(factionId)) return;
            rec.destroyBlip();
        });
    },
};

mp.events.add({
    "characterInit.done": () => {},
    "mafia.mafiaZones.init": (zones) => {
        mp.mafia.initMafiaZones(zones);
    },
    "mafia.mafiaZones.flash": (id, toggle) => {
        mp.mafia.flashBlip(id, toggle);
    },
    "mafia.bizWar.start": (mafiaId, enemymafiaId, time, mafiacore = 0, enemymafiacore = 0) => {
        mp.mafia.startBizWar(mafiaId, enemymafiaId, time, mafiacore, enemymafiacore);
    },
    "mafia.bizWar.score.set": (mafiaId, score) => {
        mp.mafia.setBizWarScore(mafiaId, score);
    },
    "mafia.bizWar.killList.log": (target, killer, reason) => {
        mp.mafia.logKill(target, killer, reason);
    },
    "factions.faction.set": (factionId) => {
        var item = {
            text: "Захват биз."
        };
        if (!mp.factions.isMafiaFaction(factionId)) mp.callCEFV(`interactionMenu.deleteItem('player_ownmenu', '${item.text}')`);
        else mp.callCEFV(`interactionMenu.addItems('player_ownmenu', '${JSON.stringify(item)}')`);
    },
    "render": () => {
        mp.mafia.mafiaZones.forEach(blip => {
            mp.game.invoke(mp.mafia.natives.SET_BLIP_ROTATION, blip, 0);
        });
    },
    "entityStreamIn": (player) => {
        if (player.type != "player") return;

        mp.mafia.createPlayerBlip(player);
    },
});

// for tests
// mp.players.local.destroyBlip();
// mp.players.local.createBlip(1);
// mp.game.invoke(mp.mafia.natives._SET_BLIP_SHOW_HEADING_INDICATOR, mp.players.local.blip, true);