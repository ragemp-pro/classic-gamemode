"use strict";

module.exports = {
    // Настройки чекпоинта
    checkpointData: {
        type: 1,
        position: null,
        scale: 1,
        direction: null,
        color: [255, 255, 255, 100],
    },

    start(player, points, end) {
        player.route = {
            i: 0,
            points: points,
            end: end
        };
        this.checkpointData.position = points[0];
        this.checkpointData.direction = points[1];
        player.call(`routes.checkpoint.create`, [this.checkpointData]);
    },
    next(player) {
        console.log(`next`)
        if (!player.route) return;
        if (player.route.i >= player.route.points.length - 1) {
            player.call(`routes.checkpoints.destroy`);
            player.route.end();
            delete player.route;
            return;
        }
        player.route.i++;
        this.checkpointData.position = player.route.points[player.route.i];
        this.checkpointData.direction = player.route.points[player.route.i + 1] || null;
        player.call(`routes.checkpoint.create`, [this.checkpointData]);
    },
};
