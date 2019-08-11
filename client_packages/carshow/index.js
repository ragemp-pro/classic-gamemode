let data = require('carshow/data.js');

let colorIDs = [];
let colorValues = [];

data.colors.forEach((current) => {
    colorIDs.push(current.id);
    colorValues.push(current.value);
});

let current;
let list = [];
let carShowInfo;
let currentIndex = 0;
let primary = 0, secondary = 0;
let camera;

let controlsDisabled = false;

mp.events.add('carshow.list.show', (inputList, inputInfo) => {

    if (!inputList[0]) return;
    mp.players.local.freezePosition(true);
    mp.events.call('hud.enable', false);
    mp.game.ui.displayRadar(false);
    mp.callCEFR('setOpacityChat', [0.0]);
    controlsDisabled = true;
    mp.busy.add('carshow');
    mp.prompt.showByName('carshow_control');

    list = inputList;
    carShowInfo = inputInfo;
    //let camera = mp.cameras.new('default', new mp.Vector3(-44 - 4, -1098 - 4, 25 + 2.5), new mp.Vector3(0, 0, 0), 70);
    camera = mp.cameras.new('default', new mp.Vector3(carShowInfo.cameraX, carShowInfo.cameraY, carShowInfo.cameraZ), new mp.Vector3(0, 0, 0), 70);
    //31.673555374145508
    //126.1431884765625
    //camera.pointAtCoord(-44, -1098, 25);
    camera.pointAtCoord(carShowInfo.toX, carShowInfo.toY, carShowInfo.toZ);
    camera.setActive(true);
    mp.game.cam.renderScriptCams(true, false, 0, true, false);

    //current = mp.vehicles.new(mp.game.joaat(list[i].vehiclePropertyModel), new mp.Vector3(-44.08749008178711, -1098.660400390625, 25.74812889099121));
    current = mp.vehicles.new(mp.game.joaat(list[currentIndex].vehiclePropertyModel), new mp.Vector3(carShowInfo.toX, carShowInfo.toY, carShowInfo.toZ));
    //current.setHeading(115);
    current.setHeading(carShowInfo.toH);
    current.setColours(primary, secondary);

    let models = [];
    list.forEach((current) => {
        models.push(current.properties.name);
    })
    mp.callCEFV(`selectMenu.menu = cloneObj(selectMenu.menus["carShowMenu"])`);
    mp.callCEFVN({ "selectMenu.menu.items[0].values": models });
    mp.callCEFVN({ "selectMenu.menu.items[1].values": colorValues });
    mp.callCEFVN({ "selectMenu.menu.items[2].values": colorValues });
    mp.callCEFV(`selectMenu.show = true`);


    mp.callCEFV(`carSpecifications.body = {
        name: { header: 'Название', value: '0', unit: '' },
        class: { header: 'Класс', value: '0', unit: '' },
        volume: { header: 'Объём бака', value: '0', unit: 'л' },
        consumption: { header: 'Расход топлива', value: '0', unit: 'л' },
        maxSpeed: { header: 'Макс. скорость', value: '0', unit: 'км/ч' },
        count: { header: 'В наличии', value: '0', unit: '' },
    }`);

    updateSpecifications(currentIndex);
}
);

mp.events.add('render', () => {
    if (controlsDisabled) {
        mp.game.controls.disableControlAction(1, 200, true);
    }
});

mp.events.add('carshow.list.close', () => {
    mp.prompt.hide();
    current.destroy();
    camera.setActive(false);
    camera.destroy();
    mp.game.cam.renderScriptCams(false, false, 0, true, false);
    mp.players.local.freezePosition(false);
    mp.events.call('hud.enable', true);
    mp.game.ui.displayRadar(true);
    mp.callCEFV(`selectMenu.menu = null`);
    controlsDisabled = false;
    mp.busy.remove('carshow');
    mp.callCEFR('setOpacityChat', [1.0]);
    mp.events.callRemote('carshow.list.close', carShowInfo.sqlId);
    mp.callCEFV(`carSpecifications.show = false`);
    currentIndex = 0;
    primary = 0;
    secondary = 0;
});

mp.events.add('carshow.vehicle.show', (i) => {
    currentIndex = i;
    current.destroy();
    current = mp.vehicles.new(mp.game.joaat(list[i].vehiclePropertyModel), new mp.Vector3(carShowInfo.toX, carShowInfo.toY, carShowInfo.toZ));
    //current.setHeading(115);
    current.setHeading(carShowInfo.toH);
    current.setColours(primary, secondary);
    updateSpecifications(currentIndex);
});

mp.events.add('carshow.vehicle.color', (color1, color2) => {
    if (color1 != -1) primary = color1;
    if (color2 != -1) secondary = color2;
    current.setColours(primary, secondary);
});

mp.events.add("carshow.car.buy", (carId) => {
    mp.callCEFV(`loader.show = true;`);
    mp.events.callRemote('carshow.car.buy', list[currentIndex].sqlId, primary, secondary);
});

mp.events.add("carshow.car.buy.ans", (ans, carInfo, parkingInfo) => {
    mp.callCEFV(`loader.show = false;`);
    switch (ans) {
        case 0:
            mp.chat.debug('Автомобилей нет');
            mp.notify.error('Т/с нет в наличии', 'Ошибка');
            break;
        case 1:
            mp.chat.debug('Успешно куплен');
            mp.notify.success('Вы приобрели транспорт', 'Успех');
            mp.events.call('chat.message.push', `!{#80c102}Вы успешно приобрели транспортное средство !{#009eec}${carInfo.properties.name}`);
            mp.events.call('chat.message.push', `!{#f3c800}Транспорт доставлен на подземную парковку !{#009eec}${parkingInfo.name}`);
            mp.events.call('chat.message.push', '!{#f3c800}Местоположение парковки отмечено на карте');
            mp.game.ui.setNewWaypoint(parkingInfo.x, parkingInfo.y);
            mp.events.call('carshow.list.close');
            break;
        case 2:
            mp.chat.debug('Нет денег');
            mp.notify.error('Недостаточно денег', 'Ошибка');
            break;
    }
});

function updateSpecifications(i) {
    let vehClass = current.getClass();
    switch (vehClass) {
        case 0:
            className = 'Компакт';
            break;
        case 1:
            className = 'Седан';
            break;
        case 2:
            className = 'SUV';
            break;
        case 3:
            className = 'Купе';
            break;
        case 4:
            className = 'Маслкар';
            break;
        case 5:
            className = 'Спорт. классика';
            break;
        case 6:
            className = 'Спорткар';
            break;
        case 7:
            className = 'Суперкар';
            break;
        case 8:
            className = 'Мотоцикл';
            break;
        case 9:
            className = 'Внедорожник';
            break;
        case 12:
            className = 'Фургон';
            break;
        case 13:
            className = 'Велосипед';
            break;
        default:
            className = 'Транспорт';
            break;
    }

    let maxSpeed = (mp.game.vehicle.getVehicleModelMaxSpeed(current.model) * 3.6 * 1.05).toFixed(0);

    mp.callCEFV(`carSpecifications.body.maxSpeed.value = '${maxSpeed}'`);
    mp.callCEFV(`carSpecifications.body.name.value = '${list[i].properties.name}'`);
    mp.callCEFV(`carSpecifications.body.volume.value = '${list[i].properties.maxFuel}'`);
    mp.callCEFV(`carSpecifications.body.consumption.value = '${list[i].properties.consumption}'`);
    if (className == 'Велосипед') {
        mp.callCEFV(`carSpecifications.body.volume.value = '—'`);
        mp.callCEFV(`carSpecifications.body.consumption.value = '—'`);
    }
    mp.callCEFV(`carSpecifications.body.class.value = '${className}'`);
    mp.callCEFV(`carSpecifications.body.count.value = '${list[i].count}'`);
    mp.callCEFV(`carSpecifications.price = '${list[i].properties.price}'`);
    mp.callCEFV(`carSpecifications.show = true`);
}