"use strict";

var prevValues = {};
var hudState = false;
mp.events.add('hud.load', () => {
    var anchor = mp.utils.getMinimapAnchor();
    var resolution = mp.game.graphics.getScreenActiveResolution(0, 0);
    mp.callCEFV(`hud.leftWeather = ${resolution.x * (anchor.rightX * 1.1)}`);
    mp.events.call('hud.enable', true);

    mp.keys.bind(0x74, true, function () { /// Включение/отключение худа на F5
      if (hudState) {
        mp.events.call('hud.enable', false);
      } else {
        mp.events.call('hud.enable', true);
      }
    });
});

mp.events.add('hud.enable', (state) => {
    mp.callCEFVN({"hud.show" : state});
    hudState = state;
});

mp.events.add("hud.setData", (data) => {
    for (var key in data) {
        if (prevValues[key] == data[key]) continue;
        prevValues[key] = data[key];

        if (typeof data[key] == 'string') data[key] = `'${data[key]}'`;
        mp.callCEFV(`hud.${key} = ${data[key]}`);
    }
});

mp.events.add("hud.tick", () => {
    var pos = mp.players.local.position;
    mp.events.call("hud.setData", {
        street: mp.utils.getStreetName(pos),
        region: mp.utils.getRegionName(pos)
    });
});

var mainTimerId = setInterval(() => { mp.events.call('hud.tick') }, 1000);