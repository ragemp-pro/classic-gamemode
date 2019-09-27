let shops;
let bizes;

module.exports = {
    business: {
        type: 1,
        name: "Супермаркет",
        productName: "Продукты",
    },
    rentPerDayMultiplier: 0.01,
    minPriceMultiplier: 1.0,
    maxPriceMultiplier: 2.0,
    productPrice: 10,
    phoneProducts: 15,
    numberChangeProducts: 12,
    async init() {
        bizes = call('bizes');
        await this.loadSupermarketsFromDB();
    },
    async loadSupermarketsFromDB() {
        shops = await db.Models.Supermarket.findAll();
        for (var i = 0; i < shops.length; i++) {
            this.createSupermarket(shops[i]);
        }
        console.log(`[SUPERMARKET] Загружено супермаркетов: ${i}`);
    },
    createSupermarket(shop) {
        mp.blips.new(52, new mp.Vector3(shop.x, shop.y, shop.z),
            {
                name: 'Супермаркет',
                color: 0,
                shortRange: true,
            });
        let shape = mp.colshapes.newSphere(shop.x, shop.y, shop.z, 1.8);

        mp.markers.new(1, new mp.Vector3(shop.x, shop.y, shop.z - 0.1), 0.8,
        {
            color: shop.bType ? [69, 140, 255, 128] : [50, 168, 82, 128],
            visible: true,
            dimension: 0
        });

        shape.isSupermarket = true;
        shape.supermarketId = shop.id;
    },
    getRawShopData(id) {
        let shop = shops.find(x => x.id == id);
        return {
            bType: shop.bType,
            priceMultiplier: shop.priceMultiplier
        }
    },
    getBizParamsById(id) {
        let shop = shops.find(x => x.bizId == id);
        if (!shop) return;
        let params = [
            {
                key: 'priceMultiplier',
                name: 'Наценка на товары',
                max: this.maxPriceMultiplier,
                min: this.minPriceMultiplier,
                current: shop.priceMultiplier
            }
        ]
        return params;
    },
    setBizParam(id, key, value) {
        let shop = shops.find(x => x.bizId == id);
        if (!shop) return;
        shop[key] = value;
        shop.save();
    },
    getProductsAmount(id) {
        let shop = shops.find(x => x.id == id);
        let bizId = shop.bizId;
        let products = bizes.getProductsAmount(bizId);
        return products;
    },
    removeProducts(id, products) {
        let shop = shops.find(x => x.id == id);
        let bizId = shop.bizId;
        bizes.removeProducts(bizId, products);
    },
    getPriceMultiplier(id) {
        let shop = shops.find(x => x.id == id);
        return shop.priceMultiplier;
    },
    updateCashbox(id, money) {
        let shop = shops.find(x => x.id == id);
        let bizId = shop.bizId;
        bizes.bizUpdateCashBox(bizId, money);
    }
}