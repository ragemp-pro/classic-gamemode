var houseService = require('./index.js');
module.exports = {
    "/ho": {
        access: 6,
        handler: (player, args) => {
            player.spawn(new mp.Vector3(-29.178926467895508, -1849.4302978515625, 25.81756591796875));
        }
    },
}