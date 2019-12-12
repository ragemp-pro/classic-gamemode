"use strict";

/*
    Модуль мирных зон.

    created 12.12.19 by Carter Slade
*/

mp.peaceZones = {
    inside: false,
    interiors: [60418], // интерьеры в ЗЗ

    isInside() {
        if (this.inside) return true;

        var interior = mp.utils.getLocalInterior();
        return interior && this.interiors.includes(interior);
    },
};

mp.events.add({
    "peaceZones.inside": (enable) => {
        mp.peaceZones.inside = enable;
    },
    "render": () => {
        if (mp.peaceZones.isInside()) {
            mp.game.controls.disableControlAction(0, 24, true); /// удары
            mp.game.controls.disableControlAction(0, 25, true); /// INPUT_AIM
            mp.game.controls.disableControlAction(0, 140, true); /// удары R
        }
    },
});
