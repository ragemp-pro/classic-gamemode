"use strict";

/*
    Модуль планшета.

    created 24.08.19 by Carter Slade
*/

mp.mapCase = {
    enable(val) {
        mp.callCEFV(`mapCase.enable = ${val}`);
    },
    type(val) {
        mp.callCEFV(`mapCase.type = "${val}"`);
    },
    userName(val) {
        mp.callCEFV(`mapCase.userName = "${val}"`);
    },
};
mp.mapCasePd = {
    menuHeader(top, bottom) {
        mp.callCEFV(`mapCasePdData.menuHeader.top = "${top}"`);
        mp.callCEFV(`mapCasePdData.menuHeader.bottom = "${bottom}"`);
    },
    setResultData(array) {
        for (var i = 0; i < array.length; i++) {
            var pos = array[i].housePos;
            array[i].num = i + 1;
            array[i].address = mp.utils.getStreetName(pos) || "-";
        }
        if (typeof array == 'object') array = JSON.stringify(array);
        mp.callCEFV(`mapCasePdDBResultData.setResult('${array}')`);
    },
    setProfileData(data) {
        var pos = data.housePos;
        data.property = "-";
        if (data.housePos) data.property = mp.utils.getStreetName(pos) + `, ${data.houseId}` || "-";
        data.pass = 2608180000 + data.id;
        data.gender = (data.gender)? "Ж" : "М";

        if (typeof data == 'object') data = JSON.stringify(data);
        mp.callCEFV(`mapCasePdProfileData.setProfileData('${data}')`);
    },
};

mp.events.add("mapCase.init", (name, factionId) => {
    mp.mapCase.enable(false);
    var type = "";
    if (mp.factions.isPoliceFaction(factionId)) {
        type = "pd";
        if (factionId == 2) mp.mapCasePd.menuHeader("LOS SANTOS", "POLICE DEPARTMENT");
        else mp.mapCasePd.menuHeader("BONE COUNTY", "SHERIFF DEPARTMENT");
    }
    mp.mapCase.type(type);
    mp.mapCase.userName(name);
    mp.mapCase.enable(true);
});

mp.events.add("mapCase.enable", mp.mapCase.enable);

mp.events.add("mapCase.pd.resultData.set", mp.mapCasePd.setResultData);

mp.events.add("mapCase.pd.profileData.set", mp.mapCasePd.setProfileData);
