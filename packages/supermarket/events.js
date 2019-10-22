let supermarket = require('./index.js');
let money = call('money');
let inventory = call('inventory');
let phone = call('phone');

module.exports = {
    "init": () => {
        supermarket.init();
        inited(__dirname);
    },
    "playerEnterColshape": (player, shape) => {
        if (!player.character) return;
        if (shape.isSupermarket) {
            let id = shape.supermarketId;
            let data = supermarket.getRawShopData(id);
            let priceConfig = supermarket.getPriceConfig();
            player.call('supermarket.enter', [data, priceConfig]);
            player.currentsupermarketId = shape.supermarketId;
        }
    },
    "playerExitColshape": (player, shape) => {
        if (!player.character) return;
        if (shape.isSupermarket) {
            player.call('supermarket.exit');
        }
    },
    "supermarket.phone.buy": (player) => {
        if (player.phone) return player.call('supermarket.phone.buy.ans', [0]);
        let supermarketId = player.currentsupermarketId;
        if (supermarketId == null) return;

        let price = supermarket.productsConfig.phone * supermarket.productPrice * supermarket.getPriceMultiplier(supermarketId);
        if (player.character.cash < price) return player.call('supermarket.phone.buy.ans', [2]);
        let productsAvailable = supermarket.getProductsAmount(supermarketId);
        if (supermarket.productsConfig.phone > productsAvailable) return player.call('supermarket.phone.buy.ans', [3]);

        money.removeCash(player, price, function (result) {
            if (result) {
                supermarket.removeProducts(supermarketId, supermarket.productsConfig.phone);
                supermarket.updateCashbox(supermarketId, price);
                mp.events.call('phone.buy', player);
                player.call('supermarket.phone.buy.ans', [1]);
            } else {
                player.call('supermarket.phone.buy.ans', [4]);
            }
        }, `Покупка телефона`);
    },
    "supermarket.number.change": async (player, number) => {
        if (number.length != 6 || /\D/g.test(number) || number.charAt(0) == '0') return player.call('supermarket.number.change.ans', [0]);

        let supermarketId = player.currentsupermarketId;
        if (supermarketId == null) return;

        let price = supermarket.productsConfig.numberChange * supermarket.productPrice * supermarket.getPriceMultiplier(supermarketId);
        if (player.character.cash < price) return player.call('supermarket.number.change.ans', [2]);
        let productsAvailable = supermarket.getProductsAmount(supermarketId);
        if (supermarket.productsConfig.numberChange > productsAvailable) return player.call('supermarket.number.change.ans', [3]);

        let changed = await phone.changeNumber(player, number);
        if (!changed) {
            return player.call('supermarket.number.change.ans', [5]);
        } else {
            money.removeCash(player, price, function (result) {
                if (result) {
                    supermarket.removeProducts(supermarketId, supermarket.productsConfig.numberChange);
                    supermarket.updateCashbox(supermarketId, price);
                    player.call('supermarket.number.change.ans', [1, number]);
                } else {
                    player.call('supermarket.number.change.ans', [4]);
                }
            }, `Смена номера телефона на ${number}`);
        }

    },
    "supermarket.products.buy": (player, productId) => {
        let supermarketId = player.currentsupermarketId;
        if (supermarketId == null) return;

        let productName;
        let brand;
        let bagColor;
        switch (productId) {
            case 0:
                productName = 'water';
                break;
            case 1:
                productName = 'chocolate';
                break;
            case 2:
                productName = 'cigarettes';
                brand = 'Redwood';
                break;
            case 3:
                productName = 'rope';
                break;
            case 4:
                productName = 'bag';
                break;
            case 5:
                productName = 'canister';
                break;
            case 6:
                productName = 'duffleBag';
                bagColor = 'green';
                break;
            case 7:
                productName = 'duffleBag';
                bagColor = 'black';
                break;
        }
        let price = supermarket.productsConfig[productName] * supermarket.productPrice * supermarket.getPriceMultiplier(supermarketId);
        if (player.character.cash < price) return player.call('supermarket.products.buy.ans', [2]);
        let productsAvailable = supermarket.getProductsAmount(supermarketId);
        if (supermarket.productsConfig[productName] > productsAvailable) return player.call('supermarket.products.buy.ans', [3]);

        let itemId = supermarket.itemIds[productName];
        let params = {};

        if (productName == 'cigarettes') {
            params.count = 20;
            params.name = brand;
        } else if (productName == 'canister') {
            params.litres = 0;
            params.max = 20;
        } else if (productName == 'water') {
            params.thirst = 20;
        } else if (productName == 'chocolate') {
            params.satiety = 15;
            params.thirst = -5;
        } else if (productName == 'duffleBag') {
            params.sex = !player.character.gender;
            params.pockets = '[2,2,6,5,2,3,6,6,12,10]';
            params.texture = 0;
            bagColor == 'green' ? params.variation = 41 : params.variation = 45;
        }

        inventory.addItem(player, itemId, params, (e) => {
            if (e) return player.call('supermarket.products.buy.ans', [4, e]);
            money.removeCash(player, price, function (result) {
                if (result) {
                        supermarket.removeProducts(supermarketId, supermarket.productsConfig[productName]);
                        supermarket.updateCashbox(supermarketId, price);
                        player.call('supermarket.products.buy.ans', [1]);
                } else {
                    player.call('supermarket.products.buy.ans', [0]);
                }
            }, `Покупка в 24/7 ${productName}`);
        });
    },
}
