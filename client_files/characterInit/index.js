"use strict";
/// Выбор персоонажа и подключение создания персоонажа
require("characterInit/characterCreate.js");
const freemodeCharacters = [mp.game.joaat("mp_m_freemode_01"), mp.game.joaat("mp_f_freemode_01")];

let charNum;
let charClothes = [];
let charInfos = [];

let peds = [];
let selectMarkers = [];
let currentCharacter = 0;

/// ИЗМЕНЯТЬ ДАННЫЕ НАСТРОЙки ДЛЯ УСТАНОВКИ ПЕДОВ
/// Начальная координата камеры
const camPos = [1220.15, 195.36, 80.5];//[-1828.8, -870.1, 3.1];
/// На сколько ниже камера смотрит, чем находится
const camPosZDelta = -0.5;
/// Расстояние от камеры до текущего педа
const camDist = 2.5;
/// Расстояние между педами
const pedDist = 2.5;
/// Поворот педа
const pedRotation = 180;
/// Поворот камеры
const camRotation = 30;

const cosCamRot = Math.cos(camRotation * Math.PI/180);
const sinCamRot = Math.sin(camRotation * Math.PI/180);
const cosPedRot = Math.cos((pedRotation - 90) * Math.PI/180);
const sinPedRot = Math.sin((pedRotation - 90) * Math.PI/180);

let isBinding = false;

let creatorTimer = null;
let slotsNumber;


mp.events.add('characterInit.init', (characters, accountInfo) => {
    mp.console("На клиенте вызван characterInit.init");
    mp.gui.cursor.show(true, true);
    if (characters != null) {
        currentCharacter = 0;
        charNum = characters.length;
        mp.console(`Персонажей: ${charNum} шт.`);
        for (let i = 0; i < characters.length; i++) {
            charInfos.push(characters[i].charInfo);
            charClothes.push(characters[i].charClothes);
        }
        mp.console(`Для них иниц-ны инфо и шмот`);
    }
    if (!isBinding){
        binding(true);
        isBinding = true;
    }
    mp.console(`ТПшим игрока по позиции камеры`);
    mp.console(`Позиция: ${JSON.stringify(camPos)}`);
    mp.players.local.position = new mp.Vector3(camPos[0], camPos[1], camPos[2] + 10);

    if (characters != null) {
        mp.console(`Создаем камеру`);
        mp.utils.cam.create(camPos[0], camPos[1], camPos[2], camPos[0] + camDist * sinCamRot, camPos[1] + camDist * cosCamRot, camPos[2] + camPosZDelta, 60);
        createPeds();
        setInfo();
        slotsNumber = accountInfo.slots;
        mp.callCEFV(`characterInfo.slots = ${accountInfo.slots}`);
        mp.callCEFV(`characterInfo.coins = ${accountInfo.coins}`);
        mp.callCEFV(`characterAddSlot.hours = ${accountInfo.timeForSecondSlot}`);
        if (slotsNumber == 1) {
            mp.callCEFV(`characterAddSlot.price = ${accountInfo.costSecondSlot}`);
        }
        else {
            mp.callCEFV(`characterAddSlot.price = ${accountInfo.costThirdSlot}`);
        }

    }
    else {
        mp.utils.cam.tpTo(camPos[0] + currentCharacter * pedDist * sinPedRot,
            camPos[1] + currentCharacter * pedDist * cosPedRot,
            camPos[2],
            (camPos[0] + currentCharacter * pedDist * sinPedRot) + camDist * sinCamRot,
            (camPos[1] + currentCharacter * pedDist * cosPedRot) + camDist * cosCamRot,
            camPos[2] + camPosZDelta, 60);
        mp.callCEFV(`characterInfo.show = true;`);
    }

    mp.players.local.setAlpha(0);
});

mp.events.add("characterInit.done", () => {
    mp.gui.cursor.show(false, false);
    mp.players.local.freezePosition(false);
    mp.game.ui.displayRadar(true);
    mp.game.ui.displayHud(true);
    mp.utils.disablePlayerMoving(false);

    mp.utils.cam.destroy();

    for (let i = 0; i < selectMarkers.length; i++) {
        selectMarkers[i].destroy();
        peds[i].destroy();
    }
    selectMarkers = [];
    peds = [];

    // Отключение регенарции здоровья
    mp.game.player.setHealthRechargeMultiplier(0);

    mp.utils.closeDoors();

    mp.utils.requestIpls();
});

mp.events.add('characterInit.slot.buy', () => {
    mp.events.callRemote('characterInit.slot.buy');
});
mp.events.add('characterInit.slot.buy.ans', (result, slots, coins) => {
    mp.callCEFV(`characterInfo.slots = ${slots}`);
    mp.callCEFV(`characterInfo.coins = ${coins}`);
    if (result === 0) {
        mp.notify.error("Недостаточно коинов на счете");
    }
    if (result === 2) {
        mp.notify.error("Невозможно иметь более 3 слотов");
    }
    mp.callCEFV(`loader.show = false;`);
});

mp.events.add('characterInit.choose', () => {
    if(isBinding) {
        binding(false);
        isBinding = false;
        mp.events.callRemote('characterInit.choose', currentCharacter);
    }
});
mp.events.add('characterInit.choose.ans', (ans) => {     //0 - не успешно     1 - успешно
    if (ans === 0) {
        if(!isBinding){
            binding(true);
            isBinding = true;
        }
    }
    mp.callCEFV(`loader.show = false;`);
    mp.callCEFV(`characterInfo.show = false;`);
});

mp.events.add('characterInit.chooseRight', () => {
    chooseRight();
});
mp.events.add('characterInit.chooseLeft', () => {
    chooseLeft();
});

let createPeds = function() {
    mp.console(`Создаем педов`);
    if (peds.length !== 0) return;
    creatorTimer = mp.timer.add(async () => {
        for (let i = 0; i < charNum; i++) {
            setCharCustom(i);
            setCharClothes(i);
            setCharTattoos(i);

            let x = (camPos[0] + i * pedDist * sinPedRot) + camDist * sinCamRot;
            let y = (camPos[1] + i * pedDist * cosPedRot) + camDist * cosCamRot;
            let z = mp.game.gameplay.getGroundZFor3dCoord(x, y, camPos[2] + 1, 0.0, false) + 1;
            mp.console(`Создаем педа`);
            let ped = mp.peds.new(mp.players.local.model, new mp.Vector3(x, y, z), pedRotation, mp.players.local.dimension);
            mp.console(`Клонируем на него внешку игрока`);
            mp.players.local.cloneToTarget(ped.handle);

            mp.console(`Создаем маркер`);
            selectMarkers.push(mp.markers.new(2, new mp.Vector3(x, y, z + 1), 0.2,
            {
                direction: 0,
                rotation: new mp.Vector3(0, 180, 0),
                color: (i === currentCharacter) ? [255, 221, 85, 255] : [255, 255, 255, 120],
                visible: true,
                dimension: mp.players.local.dimension
            }));
            mp.console(`Кладем педа в массив`);
            peds.push(ped);
        }
        creatorTimer = null;
    }, 500);
};

let updateMarkers = function() {
    for (let i = 0; i < selectMarkers.length; i++) {
        selectMarkers[i].destroy();

        let x = (camPos[0] + i * pedDist * sinPedRot) + camDist * sinCamRot;
        let y = (camPos[1] + i * pedDist * cosPedRot) + camDist * cosCamRot;
        let z = mp.game.gameplay.getGroundZFor3dCoord(x, y, camPos[2] + 1, 0.0, false) + 1;

        selectMarkers[i] = mp.markers.new(2, new mp.Vector3(x, y, z + 1),
            0.2, {
            direction: 0,
            rotation: new mp.Vector3(0, 180, 0),
            color: (i === currentCharacter) ? [255, 221, 85, 255] : [255, 255, 255, 120],
            visible: true,
            dimension: mp.players.local.dimension
        });
    }
};

let setInfo = function() {
    charInfos.forEach(charInfo => {
        mp.callCEFV(`characterInfo.addCharacter({
            name: "${charInfo.name}",
            cash: ${charInfo.cash},
            bank: ${charInfo.bank},
            status: "${charInfo.status}",
            hours: ${charInfo.hours},
            faction: "${charInfo.faction}",
            job: "${charInfo.job}",
            house: "${charInfo.house}",
            biz: "${charInfo.biz}",
            warns: ${charInfo.warnNumber}
        });`);
    });
    mp.callCEFV(`characterInfo.show = true;`);
};

let chooseLeft = function() {
    if (mp.game.ui.isPauseMenuActive()) return;
    if (currentCharacter > 0) {
        currentCharacter--;
    }
    else {
        return;
    }

    updateMarkers();
    mp.callCEFV(`characterInfo.i = ${currentCharacter};`);
    mp.utils.cam.moveTo(
        camPos[0] + currentCharacter * pedDist * sinPedRot,
        camPos[1] + currentCharacter * pedDist * cosPedRot,
        camPos[2],
        (camPos[0] + currentCharacter * pedDist * sinPedRot) + camDist * sinCamRot,
        (camPos[1] + currentCharacter * pedDist * cosPedRot) + camDist * cosCamRot,
        camPos[2] + camPosZDelta,
        500);
};

let chooseRight = function() {
    if (mp.game.ui.isPauseMenuActive()) return;
    if (currentCharacter < charNum) {
        currentCharacter++;
    }
    else {
        return;
    }
    updateMarkers();
    mp.callCEFV(`characterInfo.i = ${currentCharacter};`);
    mp.utils.cam.moveTo(
        camPos[0] + currentCharacter * pedDist * sinPedRot,
        camPos[1] + currentCharacter * pedDist * cosPedRot,
        camPos[2],
        (camPos[0] + currentCharacter * pedDist * sinPedRot) + camDist * sinCamRot,
        (camPos[1] + currentCharacter * pedDist * cosPedRot) + camDist * cosCamRot,
        camPos[2] + camPosZDelta,
        500);
};

let choose = function() {
    if (mp.game.ui.isPauseMenuActive()) return;
    if (currentCharacter >= slotsNumber) return;
    if (isBinding) {
        binding(false);
        isBinding = false;
        if (creatorTimer != null) mp.timer.remove(creatorTimer);
        mp.events.callRemote('characterInit.choose', currentCharacter);
        mp.callCEFV(`loader.show = true;`);
    }
};

let setCharClothes = function(indexPed) {
    mp.console(`Ставим на игрока шмот от педа ${indexPed}`);
    if (charClothes.length <= indexPed) return;
    mp.utils.clearAllView(mp.players.local, charInfos[indexPed].hair); // раздеваем игрока полностью
    let clothes = charClothes[indexPed].clothes;
    let props = charClothes[indexPed].props;
    for (let i = 0; i < clothes.length; i++) {
        mp.players.local.setComponentVariation(clothes[i][0], clothes[i][1], clothes[i][2], 0);
    }
    for (let i = 0; i < props.length; i++) {
        mp.players.local.setPropIndex(props[i][0], props[i][1], props[i][2], false);
    }
    mp.console(`- поставили`);
};

let setCharTattoos = function(indexPed) {
    mp.console(`Ставим на игрока татуировки от педа ${indexPed}`);
    if (charInfos.length <= indexPed) return;
    let tattoos = charInfos[indexPed].tattoos;
    tattoos.forEach((tattoo) => {
        mp.players.local.setDecoration(mp.game.joaat(tattoo.collection), mp.game.joaat(tattoo.hashName));
    });
    mp.console(`- поставили`);
};

let setCharCustom = function (indexPed) {
    mp.console(`Ставим кастомку на игрока от педа ${indexPed}`);
    if (charInfos.length <= indexPed) return;
    mp.players.local.model = freemodeCharacters[charInfos[indexPed].gender];
    mp.players.local.setHeadBlendData(
        // shape
        charInfos[indexPed].mother,
        charInfos[indexPed].father,
        0,

        // skin
        0,
        charInfos[indexPed].skin,
        0,

        // mixes
        charInfos[indexPed].similarity,
        1.0,
        0.0,

        false
    );
    mp.players.local.setComponentVariation(2, charInfos[indexPed].hair, 0, 2);
    mp.players.local.setHairColor(charInfos[indexPed].hairColor, charInfos[indexPed].hairHighlightColor);
    mp.players.local.setEyeColor(charInfos[indexPed].eyeColor);
    for (let i = 0; i < 10; i++) {
        mp.players.local.setHeadOverlay(i, charInfos[indexPed].Appearances[i].value,
            charInfos[indexPed].Appearances[i].opacity, colorForOverlayIdx(i, indexPed), 0);

    }
    for (let i = 0; i < 20; i++) {
        mp.players.local.setFaceFeature(i, charInfos[indexPed].Features[i].value);
    }
    mp.console(`- поставили`);
};

let colorForOverlayIdx = function(index, indexPed) {
    let color;

    switch (index) {
        case 1:
            color = charInfos[indexPed].beardColor;
        break;

        case 2:
            color = charInfos[indexPed].eyebrowColor;
        break;

        case 5:
            color = charInfos[indexPed].blushColor;
        break;

        case 8:
            color = charInfos[indexPed].lipstickColor;
        break;

        case 10:
            color = charInfos[indexPed].chestHairColor;
        break;

        default:
            color = 0;
    }
    return color;
};



function binding(active) {
    if (active) {
        mp.console("Включаем обработчик клавиш");
        mp.keys.bind(0x27, true, chooseRight);   // Right arrow
        mp.keys.bind(0x25, true, chooseLeft);    // Left arrow
        mp.keys.bind(0x0D, true, choose);        // Enter
        mp.console("- включили");
    }
    else {
        mp.console("Выключаем обработчик клавиш");
        mp.keys.unbind(0x27, true, chooseRight);
        mp.keys.unbind(0x25, true, chooseLeft);
        mp.keys.unbind(0x0D, true, choose);
        mp.console("- выключили");
    }
}
