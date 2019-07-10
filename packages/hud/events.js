module.exports = {
    /// Отображение онлайна в худе
    "playerJoin": (player) => {
        player.call('hud.load'); 
        mp.players.forEach((current) => {
            current.call("hud.setData", [{players: mp.players.length}]);
        });
    },
    "playerQuit": (player) => {
        mp.players.forEach((current) => {
            current.call("hud.setData", [{players: mp.players.length}]); /// После выхода из игры игрок какое-то время висит в пуле, возможно стоит создать таймер
        });
    }
}