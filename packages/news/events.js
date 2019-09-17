"use strict";
let factions = call('factions');
let inventory = call('inventory');
let news = call('news');
let notifs = call('notifications');

module.exports = {
    "init": () => {

    },
    "characterInit.done": (player) => {
        if (!factions.isNewsFaction(player.character.factionId)) return;
        // player.call(`mapCase.init`, [player.name, player.character.factionId]);
        mp.events.call(`mapCase.news.init`, player);
    },
    "news.storage.clothes.take": (player, index) => {
        if (!player.insideFactionWarehouse) return notifs.error(player, `Вы далеко`, `Склад Weazel News`);
        if (!factions.isNewsFaction(player.character.factionId)) return notifs.error(player, `Вы не редактор`, `Склад Weazel News`);

        var character = player.character;
        var faction = factions.getFaction(character.factionId);
        var header = `Склад ${faction.name}`;

        if (faction.ammo < news.clothesAmmo) return notifs.error(player, `Недостаточно боеприпасов`, header);

        var hats = inventory.getArrayByItemId(player, 6);
        var tops = inventory.getArrayByItemId(player, 7);
        var legs = inventory.getArrayByItemId(player, 8);
        var feets = inventory.getArrayByItemId(player, 9);
        var ears = inventory.getArrayByItemId(player, 10);
        var ties = inventory.getArrayByItemId(player, 2);
        var masks = inventory.getArrayByItemId(player, 14);
        var glasses = inventory.getArrayByItemId(player, 1);

        for (var key in hats) {
            var params = inventory.getParamsValues(hats[key]);
            if (factions.isNewsFaction(params.faction)) return notifs.error(player, `Вы уже имеете головной убор`, header);
        }
        for (var key in tops) {
            var params = inventory.getParamsValues(tops[key]);
            if (factions.isNewsFaction(params.faction)) return notifs.error(player, `Вы уже имеете рубашку`, header);
        }
        for (var key in legs) {
            var params = inventory.getParamsValues(legs[key]);
            if (factions.isNewsFaction(params.faction)) return notifs.error(player, `Вы уже имеете брюки`, header);
        }
        for (var key in feets) {
            var params = inventory.getParamsValues(feets[key]);
            if (factions.isNewsFaction(params.faction)) return notifs.error(player, `Вы уже имеете ботинки`, header);
        }
        for (var key in ears) {
            var params = inventory.getParamsValues(ears[key]);
            if (factions.isNewsFaction(params.faction)) return notifs.error(player, `Вы уже имеете наушники`, header);
        }
        for (var key in ties) {
            var params = inventory.getParamsValues(ties[key]);
            if (factions.isNewsFaction(params.faction)) return notifs.error(player, `Вы уже имеете аксессуар`, header);
        }
        for (var key in masks) {
            var params = inventory.getParamsValues(masks[key]);
            if (factions.isNewsFaction(params.faction)) return notifs.error(player, `Вы уже имеете шлем`, header);
        }
        for (var key in glasses) {
            var params = inventory.getParamsValues(glasses[key]);
            if (factions.isNewsFaction(params.faction)) return notifs.error(player, `Вы уже имеете очки`, header);
        }


        inventory.fullDeleteItemsByParams([6, 7, 8, 9, 10, 2, 14, 1], ["faction", "owner"], [character.factionId, character.id]);

        var hatParams, topParams, legsParams, feetsParams, earsParams, tiesParams, masksParams, glassesParams;
        if (character.gender == 0) { // муж.
            hatParams = { // prop 0
                sex: 1,
                variation: [-1, -1, -1, -1][index],
                texture: [-1, -1, -1, -1][index]
            };
            topParams = { // clothes 11 / 3 / 8
                sex: 1,
                torso: // /clothes 3
                    [12, 11, 4, 6][index],
                tTexture: [-1, -1, -1, -1][index],
                variation: // clothes 11
                    [41, 43, 23, 28][index],
                texture: [3, 0, 1, 2][index],
                undershirt: // clothes 8
                    [15, 15, 31, 31][index]
            };
            legsParams = { // clothes 4
                sex: 1,
                variation: [1, 0, 10, 10][index],
                texture: [1, 12, 0, 2][index]
            };
            feetsParams = { // clothes 6
                sex: 1,
                variation: [4, 4, 21, 21][index],
                texture: [1, 1, 0, 0][index]
            };
            earsParams = { // prop 2
                sex: 1,
                variation: [-1, -1, -1, -1][index],
                texture: [-1, -1, -1, -1][index]
            };
            tiesParams = { // clothes 7
                sex: 1,
                variation: [-1, -1, -1, 38][index],
                texture: [-1, -1, -1, 10][index]
            };
            masksParams = { // clothes 1
                sex: 1,
                variation: [-1, -1, -1, -1][index],
                texture: [-1, -1, -1, -1][index]
            };
            glassesParams = { // prop 1
                sex: 1,
                variation: [-1, -1, -1, -1][index],
                texture: [-1, -1, -1, -1][index]
            };
        } else {
            hatParams = { // prop 0
                sex: 0,
                variation: [-1, -1, -1, -1, -1][index],
                texture: [-1, -1, -1, -1, -1][index]
            };
            topParams = { // clothes 11 / 3 / 8
                sex: 0,
                torso: // /clothes 3
                    [0, 0, 1, 1, 1][index],
                tTexture: [-1, -1, -1, -1, -1][index],
                variation: // clothes 11
                    [27, 181, 57, 25, 57][index],
                texture: [0, 0, 0, 2, 2][index],
                undershirt: // clothes 8
                    [160, 178, 37, 37, 144][index]
            };
            legsParams = { // clothes 4
                sex: 0,
                variation: [54, 54, 54, 51, 51][index],
                texture: [2, 2, 2, 0, 1][index]
            };
            feetsParams = { // clothes 6
                sex: 0,
                variation: [29, 29, 29, 20, 23][index],
                texture: [0, 0, 0, 2, 0][index]
            };
            earsParams = { // prop 2
                sex: 0,
                variation: [2, 0, -1, -1, -1][index],
                texture: [0, 0, -1, -1, -1][index]
            };
            tiesParams = { // clothes 7
                sex: 0,
                variation: [-1, -1, -1, -1, -1][index],
                texture: [-1, -1, -1, -1, -1][index]
            };
            masksParams = { // clothes 1
                sex: 0,
                variation: [-1, -1, -1, -1, -1][index],
                texture: [-1, -1, -1, -1, -1][index]
            };
            glassesParams = { // prop 1
                sex: 0,
                variation: [-1, -1, -1, -1, -1][index],
                texture: [-1, -1, -1, -1, -1][index]
            };
        }
        if (topParams.undershirt == -1) delete topParams.undershirt;
        if (topParams.uTexture == -1) delete topParams.uTexture;
        if (topParams.tTexture == -1) delete topParams.tTexture;

        hatParams.faction = faction.id;
        topParams.faction = faction.id;
        legsParams.faction = faction.id;
        feetsParams.faction = faction.id;
        earsParams.faction = faction.id;
        tiesParams.faction = faction.id;
        masksParams.faction = faction.id;
        glassesParams.faction = faction.id;

        topParams.pockets = '[5,5,5,5,5,5,10,10]';
        legsParams.pockets = '[5,5,5,5,5,5,10,10]';
        topParams.name = `Рубашка ${faction.name}`;
        legsParams.name = `Брюки ${faction.name}`;

        hatParams.owner = character.id;
        topParams.owner = character.id;
        legsParams.owner = character.id;
        feetsParams.owner = character.id;
        earsParams.owner = character.id;
        tiesParams.owner = character.id;
        masksParams.owner = character.id;
        glassesParams.owner = character.id;

        var response = (e) => {
            if (e) notifs.error(player, e, header);
        };

        if (hatParams.variation != -1) inventory.addItem(player, 6, hatParams, response);
        if (topParams.variation != -1) inventory.addItem(player, 7, topParams, response);
        if (legsParams.variation != -1) inventory.addItem(player, 8, legsParams, response);
        if (feetsParams.variation != -1) inventory.addItem(player, 9, feetsParams, response);
        if (earsParams.variation != -1) inventory.addItem(player, 10, earsParams, response);
        if (tiesParams.variation != -1) inventory.addItem(player, 2, tiesParams, response);
        if (masksParams.variation != -1) inventory.addItem(player, 14, masksParams, response);
        if (glassesParams.variation != -1) inventory.addItem(player, 1, glassesParams, response);

        notifs.success(player, `Форма выдана`, header);
        factions.setAmmo(faction, faction.ammo - news.clothesAmmo);
    },
}
