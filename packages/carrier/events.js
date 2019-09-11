let carrier = call('carrier');
let money = call('money');
let notifs = call('notifications');

module.exports = {
    "init": () => {
        carrier.init();
    },
    "carrier.job.start": (player) => {
        mp.events.call("jobs.set", player, 4);
    },
    "carrier.job.stop": (player) => {
        var header = `Устройство на работу`;
        var out = (text) => {
            notifs.error(player, text, header);
        };
        mp.events.call("jobs.leave", player);
    },
    "carrier.load.products.buy": (player, data) => {
        data = JSON.parse(data);
        var header = `Покупка товара`;
        var out = (text) => {
            player.call(`selectMenu.loader`, [false]);
            notifs.error(player, text, header);
        };
        if (!player.carrierLoad) return out(`Далеко от склада`);
        var veh = player.vehicle;
        if (!veh || !veh.db || veh.db.key != "job" || veh.db.owner != 4) return out(`Не в грузовике`);
        if (player.character.job != 4) return out(`Не на работе`);
        if (veh.products && veh.products.count) return out(`Товар уже загружен`);
        if (data.count > carrier.productsMax) return out(`Не более ${carrier.productsMax} ед.`);
        var price = data.count * carrier.productPrice;
        if (player.character.cash < price) return out(`Необходимо $${price}`);
        money.removeCash(player, price, (res) => {
            if (!res) return out(`Ошибка списания наличных`);

            var type = ["grains", "soils"][data.product];
            veh.products = {
                type: type,
                count: data.count
            };
            veh.setVariable("label", `${data.count} из ${carrier.productsMax} ед.`);
            notifs.success(player, `Товар куплен за $${price}`, header);
            player.call(`selectMenu.loader`, [false]);
            // player.call(`selectMenu.hide`);
        });
    },
    "carrier.load.products.sell": (player) => {
        var header = `Списание товара`;
        var out = (text) => {
            player.call(`selectMenu.loader`, [false]);
            notifs.error(player, text, header);
        };
        if (!player.carrierLoad) return out(`Далеко от склада`);
        var veh = player.vehicle;
        if (!veh || !veh.db || veh.db.key != "job" || veh.db.owner != 4) return out(`Не в грузовике`);
        if (player.character.job != 4) return out(`Не на работе`);
        if (!veh.products || !veh.products.count) return out(`Грузовик пустой`);

        var price = parseInt(veh.products.count * carrier.productPrice * carrier.productSellK);
        money.addCash(player, price, (res) => {
            if (!res) return out(`Ошибка начисления наличных`);

            delete veh.products;
            veh.setVariable("label", null);
            notifs.success(player, `Товар списан за $${price}`, header);
            player.call(`selectMenu.loader`, [false]);
            // player.call(`selectMenu.hide`);
        });
    },
    "carrier.vehicle.buy": (player) => {
        var header = `Аренда грузовика`;
        var out = (text) => {
            notifs.error(player, text, header);
        };
        var veh = player.vehicle;
        if (!veh || !veh.db || veh.db.key != "job" || veh.db.owner != 4) return out(`Не в грузовике`);
        if (player.character.job != 4) return out(`Не на работе`);
        if (veh.driver) return out(`Уже арендован`);
        if (player.character.cash < carrier.vehPrice) return out(`Необходимо $${carrier.vehPrice}`);

        money.removeCash(player, carrier.vehPrice);
        veh.driver = {
            playerId: player.id,
            characterId: player.character.id,
        };
        notifs.success(player, `Удачной работы!`, header);
        player.call(`prompt.waitShowByName`, [`carrier_job`]);
    },
    "playerEnterVehicle": (player, vehicle, seat) => {
        if (!vehicle.db) return;
        if (vehicle.db.key != "job") return;
        if (player.character.job != 4) return;
        if (vehicle.db.owner != 4) return;
        if (seat != -1) return;
        var out = (text) => {
            player.removeFromVehicle();
            notifs.error(player, text, `Аренда грузовика`);
        };
        var characterId = player.character.id;
        if (vehicle.driver && vehicle.driver.characterId != characterId) return out(`Грузовик арендован другим игроком`);
        if (vehicle.driver) {
                player.call(`prompt.waitShowByName`, [`carrier_job`]);
        } else {
            player.call(`offerDialog.show`, ["carrier_job", {
                price: carrier.vehPrice
            }]);
        }
    },
}
