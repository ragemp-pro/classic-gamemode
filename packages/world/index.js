"use strict";

module.exports = {
    // Объекты мира ГТА
    objects: {},
    // Колшейпы объектов (objId: colshape)
    colshapes: {},

    init() {
        this.loadWorldObjectsFromDB();
    },
    async loadWorldObjectsFromDB() {
        var objects = await db.Models.WorldObject.findAll();
        objects.forEach(obj => {
            if (!this.objects[obj.region]) this.objects[obj.region] = {};
            if (!this.objects[obj.region][obj.street]) this.objects[obj.region][obj.street] = {};
            if (!this.objects[obj.region][obj.street][obj.type]) this.objects[obj.region][obj.street][obj.type] = [];

            this.objects[obj.region][obj.street][obj.type].push(obj);
            this.createObjColshape(obj);
        });

        console.log(`[WORLD] Объекты мира загружены (${objects.length} шт.)`);
    },
    async addObject(data) {
        var obj = await db.Models.WorldObject.create({
            region: data.region,
            street: data.street,
            type: data.type,
            pos: JSON.stringify(data.pos),
            radius: data.radius,
            hash: parseInt(data.hash) || null,
        });

        if (!this.objects[obj.region]) this.objects[obj.region] = {};
        if (!this.objects[obj.region][obj.street]) this.objects[obj.region][obj.street] = {};
        if (!this.objects[obj.region][obj.street][obj.type]) this.objects[obj.region][obj.street][obj.type] = [];

        this.objects[obj.region][obj.street][obj.type].push(obj);
    },
    createObjColshape(obj) {
        var pos = obj.pos;

        var colshape = mp.colshapes.newSphere(pos.x, pos.y, pos.z, 1.5);
        colshape.onEnter = (player) => {
            if (player.vehicle) return;

            debug(`enter obj`)
        };
        colshape.onExit = (player) => {
            debug(`exit obj`)
        };
        colshape.db = obj;

        this.colshapes[obj.id] = colshape;
    },
}
