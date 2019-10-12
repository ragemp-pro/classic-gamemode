"use strict";

module.exports = {

    init() {
        this.loadTpMarkersFromDB();
    },
    async loadTpMarkersFromDB() {
        var list = await db.Models.TpMarker.findAll();

        list.forEach(el => this.createTpMarker(el));

        console.log(`[MARKERS] ТП-маркеры загружены (${list.length} шт.)`);
    },
    createTpMarker(el) {
        var posA = new mp.Vector3(el.x, el.y, el.z);
        posA.h = el.h;
        var posB = new mp.Vector3(el.tpX, el.tpY, el.tpZ);
        posB.h = el.tpH;

        var markerA = mp.markers.new(1, posA, 0.5, {
            color: [255, 207, 13, 70],
        });
        var markerB = mp.markers.new(1, posB, 0.5, {
            color: [255, 207, 13, 70],
        });

        markerA.h = posA.h;
        markerA.db = el;
        markerA.target = markerB;

        markerB.h = posB.h;
        markerB.db = el;
        markerB.target = markerA;

        var colshapeA = mp.colshapes.newSphere(posA.x, posA.y, posA.z, 1.5);
        var colshapeB = mp.colshapes.newSphere(posB.x, posB.y, posB.z, 1.5);

        colshapeA.marker = markerA;
        colshapeB.marker = markerB;

        colshapeA.onEnter = (player) => {
            if (player.lastTpMarkerId != null) return;
            var target = colshapeA.marker.target;
            var pos = target.position;
            pos.z++;
            player.position = pos;
            player.heading = target.h;

            player.lastTpMarkerId = colshapeA.marker.id;
        };
        colshapeA.onExit = (player) => {
            if (player.lastTpMarkerId == colshapeA.marker.id) return;
            delete player.lastTpMarkerId;
        };

        colshapeB.onEnter = (player) => {
            if (player.lastTpMarkerId != null) return;
            var target = colshapeB.marker.target;
            var pos = target.position;
            pos.z++;
            player.position = pos;
            player.heading = target.h;

            player.lastTpMarkerId = colshapeB.marker.id;
        };
        colshapeB.onExit = (player) => {
            if (player.lastTpMarkerId == colshapeB.marker.id) return;
            delete player.lastTpMarkerId;
        };

        markerA.colshape = colshapeA;
        markerB.colshape = colshapeB;
    },
    async addTpMarker(posA, posB) {
        var el = await db.Models.TpMarker.create({
            x: posA.x,
            y: posA.y,
            z: posA.z,
            h: posA.h,
            tpX: posB.x,
            tpY: posB.y,
            tpZ: posB.z,
            tpH: posB.h,
        });

        this.createTpMarker(el);
    },
    removeTpMarker(id) {
        var marker = mp.markers.at(id);

        marker.db.destroy();
        marker.colshape.destroy();
        marker.target.colshape.destroy();
        marker.target.destroy();
        marker.destroy();
    },
    getNearTpMarker(pos) {
        var result = null;
        mp.markers.forEachInRange(pos, 2, marker => {
            if (marker.target) result = marker;
        });

        return result;
    }

};