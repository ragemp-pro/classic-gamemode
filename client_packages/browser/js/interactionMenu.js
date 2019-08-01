var interactionMenu = new Vue({
    el: "#interactionMenu",
    data: {
        show: false,
        left: 80, /// сдвиг от левой части экрана
        // Текущее меню
        menu: null,
        menus: {
            "vehicle": {
                name: "vehicle", // название меню
                items: [
                    {
                        text: "Двери",
                        icon: "key.png"
                    },
                    {
                        text: "Капот",
                        icon: "hood.png"
                    },
                    {
                        text: "Багажник",
                        icon: "trunk.png"
                    }
                ],
                handler(index) {
                    var item = this.items[index];
                    if (item.text == 'Двери') {
                        mp.trigger(`vehicles.lock`);
                        mp.trigger(`interaction.menu.close`);
                    }
                    if (item.text == 'Капот') {
                        mp.trigger(`vehicles.hood`);
                        mp.trigger(`interaction.menu.close`);
                    }
                    if (item.text == 'Багажник') {
                        mp.trigger(`vehicles.trunk`);
                        mp.trigger(`interaction.menu.close`);
                    }
                }
            },
            "vehicle_inside": {
                name: "vehicle_inside", // название меню
                items: [
                    {
                        text: "Двери",
                        icon: "key.png"
                    },
                    {
                        text: "Вытолкнуть",
                        icon: "eject.png"
                    }
                ],
                handler(index) {
                    var item = this.items[index];
                    if (item.text == 'Двери') {
                        mp.trigger(`vehicles.lock`);
                        mp.trigger(`interaction.menu.close`);
                    }
                    if (item.text == 'Вытолкнуть') {
                        mp.trigger(`interaction.ejectlist.get`);
                        mp.trigger(`interaction.menu.close`);
                    }
                    if (item.text == 'Звук сирены') {
                        mp.trigger(`vehicles.siren.sound`);
                        mp.trigger(`interaction.menu.close`);
                    }
                }
            },
            "vehicle_ejectlist": {
                name: "vehicle_ejectlist", 
                items: [
                ],
                handler(index) {
                    var item = this.items[index];
                    // if (item.text == 'Двери') {
                    //     mp.trigger(`vehicles.lock`);
                    //     mp.trigger(`interaction.menu.close`);
                    // }
                    mp.trigger(`interaction.eject`, index);
                    mp.trigger(`interaction.menu.close`);
                }
            }
        }
    },
    methods: {
        imgSrc(index) {
            var item = this.menu.items[index];
            var icon = item.icon || "default.png";
            return "img/interactionMenu/" + icon;
        },
        onClick(index) {
            this.menu.handler(index);
        }
    }
});

// for tests
// Для своего меню необходимо создать след. структуру (комментарии внутри):
/*var testMenu = {
    name: "test", // название меню
    items: [{
            text: "Познакомиться", // текст пункта меню
            icon: "handshake.png" // иконка пункта меню (необяз.)
        },
        {
            text: "Обмен",
            icon: "trade.png"
        },
        {
            text: "Документы",
            icon: "card.png"
        },
        {
            text: "Новый пункт"
        }
    ],
    handler(index) { // обработчик кликов на пункт меню
        var item = this.items[index];
        console.log(`Кликнули на пункт: ${item.text}`);
    }
};
// Далее, присвоить эту структуру модулю interactionMenu:
interactionMenu.menu = testMenu;
// Показываем меню:
interactionMenu.show = true;*/