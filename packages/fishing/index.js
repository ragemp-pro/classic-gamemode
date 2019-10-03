// Модуль рыбалки

"use strict"

let money = call('money');
let notifs = call('notifications');
let inventory = call('inventory');

// "amb@world_human_stand_fishing@base base" - стоит
// "amb@world_human_stand_fishing@idle_a idle_a" - медленно крутит
// "amb@world_human_stand_fishing@idle_a idle_b" - медленно крутит и иногда тянет
// "amb@world_human_stand_fishing@idle_a idle_c" - быстро крутит и тянет (вытягивает рыбу)

let shape;
let fishingPlace = {
    x: -1850.4912744140625,
    y: -1242.1881591796875,
    z: 8.615778923034668,
    marker: {
        x: -1850.1712744140625,
        y: -1241.8881591796875,
        z: 7.415778923034668,
        color: [255, 255, 125, 200],
    }
}

const ROD_ID = 5;

module.exports = {
    init() {
        this.createFishingMenuPlace();
    },
    rodPrice: 100,
    fishesTypes: [
        {
            name: 'Окунь',
            price: 10,
            minWeight: 0.8,
            maxWeight: 2,
        },
        {
            name: 'Мальма',
            price: 13,
            minWeight: 0.7,
            maxWeight: 2.1,
        },
        {
            name: 'Лосось',
            price: 17,
            minWeight: 1.3,
            maxWeight: 3.4,
        },
        {
            name: 'Тунец',
            price: 20,
            minWeight: 1.7,
            maxWeight: 3.8,
        },
        {
            name: 'Скумбрия',
            price: 25,
            minWeight: 1.2,
            maxWeight: 1.9,
        },
        {
            name: 'Сом',
            price: 30,
            minWeight: 2.5,
            maxWeight: 5.3,
        },
    ],
    getRodId() {
        return ROD_ID;
    },
    createFishingMenuPlace() {
        mp.blips.new(68, new mp.Vector3(fishingPlace.x, fishingPlace.y, fishingPlace.z),
        {
            name: `Рыбалка`,
            shortRange: true,
            color: 26
        });
        mp.markers.new(1, new mp.Vector3(fishingPlace.marker.x, fishingPlace.marker.y, fishingPlace.marker.z), 0.4,
            {
                direction: new mp.Vector3(fishingPlace.marker.x, fishingPlace.marker.y, fishingPlace.marker.z),
                rotation: 0,
                color: fishingPlace.marker.color,
                visible: true,
                dimension: 0
            });
        shape = mp.colshapes.newSphere(fishingPlace.marker.x, fishingPlace.marker.y, fishingPlace.marker.z + 1, 1.2);
        shape.pos = new mp.Vector3(fishingPlace.marker.x, fishingPlace.marker.y, fishingPlace.marker.z);
        shape.isFishingPlaceMenu = true;
    },
    async buyRod(player) {
        money.removeCash(player, this.rodPrice,  (result) => { 
            if (result) {
                inventory.addItem(player, ROD_ID, { health: 100 }, (e) => {
                    if (!e) {
                        player.call('fishing.rod.buy.ans', [1]);
                        notifs.success(player, "Удочка добавлена в инвентарь", "Покупка");
                    } else {
                        notifs.error(player, e, "Ошибка");
                        player.call('fishing.rod.buy.ans', [0]);
                    }
                });
            } else {
                player.call('fishing.rod.buy.ans', [0]);
                notifs.error(player, "Недостаточно денег", "Ошибка");
            }
        });
    },
    async sellFish(player) {
        let fishes = inventory.getArrayByItemId(player, 15);
        let sum = 0;

        if (fishes && fishes.length > 0) {
            fishes.forEach(fish => {
                let fishName = inventory.getParam(fish, 'name').value;
                let fishWeight = inventory.getParam(fish, 'weight').value;
                let fishPrice = this.fishesTypes.find(fish => fish.name == fishName).price;
                sum += fishPrice * fishWeight;
            });

            sum = parseInt(sum);

            money.addCash(player, sum, async function(result) {
                if (result) {
                    fishes.forEach(fish => inventory.deleteItem(player, fish.id));
                    player.call('fishing.fish.sell.ans', [1]);
                    return notifs.success(player, `Вы продали рыбы на ${sum}$`, 'Продажа')
                } else {
                    player.call('fishing.fish.sell.ans', [0]);
                    return notifs.error(player, 'Ошибка', 'Продажа');
                }
            })
        } else {
            player.call('fishing.fish.sell.ans', [0]);
            return notifs.error(player, 'У вас нет рыбы', 'Ошибка');
        }
    }
}