// let vehicles = call('vehicles');
// let money = call('money');

let customs;

let modsConfig = {
    "11": "engineType",
    "12": "brakeType",
    "13": "transmissionType",
    "15": "suspensionType",
    "16": "armourType",
    "18": "turbo",
    "0": "spoiler",
    "1": "frontBumper",
    "2": "rearBumper",
    "3": "sideSkirt",
    "4": "exhaust",
    "5": "frame",
    "6": "grille",
    "7": "hood",
    "8": "fender",
    "9": "rightFender",
    "10": "roof",
    "23": "frontWheels",
    "48": "livery"
}
module.exports = {
    async init() {
        await this.loadCustomsFromDB();
    },
    async loadCustomsFromDB() {
        customs = await db.Models.LosSantosCustoms.findAll();
        for (var i = 0; i < customs.length; i++) {
            this.createLSC(customs[i]);
        }
        console.log(`[TUNING] Загружено LSC: ${i}`);
    },
    createLSC(LSC) {
        mp.blips.new(72, new mp.Vector3(LSC.x, LSC.y, LSC.z),
            {
                name: 'Los Santos Customs',
                color: 0,
                shortRange: true,
            });
        let shape = mp.colshapes.newSphere(LSC.x, LSC.y, LSC.z, 4);

        shape.isCustoms = true;
        shape.customsId = LSC.id;
    },
    getCustomsDataById(id) {
        return customs.find(x => x.id == id);
    },
    getModsConfig() {
        return modsConfig;
    },
    setTuning(vehicle) {
        for (let key in modsConfig) {
            let modType = parseInt(key);
            let modIndex = vehicle.tuning[modsConfig[key]];
            if (modIndex != -1) {
                //console.log(`${modsConfig[key]} set`)
                vehicle.setMod(modType, modIndex);
            }
        }
    },
    getModTypeByName(name) {
        for (let key in modsConfig) {
            if (modsConfig[key] == name) return key;
        }
    },
    saveMod(vehicle, typeName, modIndex) {
        vehicle.tuning[typeName] = modIndex;
        vehicle.tuning.save();
    } 
}