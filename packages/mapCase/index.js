"use strict";
var factions = require('../factions');

module.exports = {
    // Вызовы в планшете ПД
    policeCalls: [],

    convertCharactersToResultData(characters) {
        var result = [];
        for (var i = 0; i < characters.length; i++) {
            var character = characters[i];
            var number = (character.Phone) ? character.Phone.number : "-";
            var housePos = null;
            if (character.House) {
                var h = character.House;
                housePos = new mp.Vector3(h.pickupX, h.pickupY, h.pickupZ);
            }
            result.push({
                id: character.id,
                name: character.name,
                phone: number,
                housePos: housePos
            });
        }
        return result;
    },
    convertCharactersToProfileData(character, vehicles) {
        var result = [];
        var number = (character.Phone) ? character.Phone.number : null;
        var housePos = null,
            houseId = 0;
        if (character.House) {
            var h = character.House;
            housePos = new mp.Vector3(h.pickupX, h.pickupY, h.pickupZ);
            houseId = h.id;
        }
        var vehNames = [];
        for (var i = 0; i < vehicles.length; i++)
            vehNames.push(`${vehicles[i].modelName} (${vehicles[i].plate})`);
        var faction = "-";
        if (character.Faction) faction = character.Faction.name;
        var rank = "-";
        if (character.FactionRank) rank = character.FactionRank.name;
        return {
            id: character.id,
            name: character.name,
            phone: number,
            housePos: housePos,
            danger: character.wanted,
            cause: character.wantedCause || "-",
            gender: character.gender,
            housePos: housePos,
            houseId: houseId,
            faction: faction,
            rank: rank,
            veh: vehNames.join(", ").trim() || "-",
        };
    },
    addPoliceCall(player, description) {
        this.removePoliceCall(player.character.id);
        var call = {
            id: player.character.id,
            name: player.name,
            description: description
        };
        this.policeCalls.push(call);

        mp.players.forEach((rec) => {
            if (!rec.character) return;
            if (!factions.isPoliceFaction(rec.character.factionId)) return;

            rec.call(`mapCase.pd.calls.add`, [call])
        });
    },
    removePoliceCall(id) {
        var deleted = false;
        for (var i = 0; i < this.policeCalls.length; i++) {
            if (this.policeCalls[i].id == id) {
                this.policeCalls.splice(i, 1);
                i--;
                deleted = true;
            }
        }
        if (!deleted) return false;
        mp.players.forEach((rec) => {
            if (!rec.character) return;
            if (!factions.isPoliceFaction(rec.character.factionId)) return;

            rec.call(`mapCase.pd.calls.remove`, [id])
        });
        return true;
    },
    acceptPoliceCall(id) {
        return this.removePoliceCall(id);
    },
};
