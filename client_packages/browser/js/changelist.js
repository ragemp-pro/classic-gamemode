var changelist = new Vue({
    el: "#changelist",
    data: {
        // Показ на экране
        show: false,
        // Возможности открытия по кнопке и ставить лайки
        enable: false,
        // Макс. длина строки в списке
        maxLength: 90,
        // Список обновлений
        list: [{
                build: 1200,
                date: "Пн, Сен 16, 2019",
                features: [
                    "Добавлен запрет на отправку в чат пустых сообщений. (Касается и команд /do, /me. /try)",
                    "Теперь после увольнения с работы таксиста удаляется соответствующее приложение с телефона.",
                    "Добавлен запрет на въезд в Los Santos Customs с пассажирами в транспорте.",
                ],
                fixed: [
                    "Исправлен баг с невозможностью продать дом, имея машину на парковке.",
                    "Исправлен баг с возможностью купить второе транспортное средство без дома.",
                    "Исправлен баг с невозможностью выехать из гаража после респавна личного автомобиля.",
                    "Исправлен баг с невозможностью выбрать количество литров на АЗС.",
                    "Исправлен баг с размытием экрана при нажатии на кнопку P.",
                ],
                improvements: [
                    "Теперь транспорт, купленный в автосалоне, не может быть сломан в течение двух дней.",
                    "Теперь при назначении лидера и прочих действиях, связанных с фракциями, в чат выводится название фракции, а не ID.",
                    "Сделано множество исправлений в работе голосового чата.",
                ],
                removed: [
                    "Отключены поломки для фракционного, рабочего и админского транспорта.",
                    "Убраны сообщения в чат при просмотре масок.",
                    "Из магазина масок удалены маски, не имеющие текстуры.",
                ],
                likes: 0,
                liked: false,
            },
            {
                build: 1321,
                date: "Ср, Сен 18, 2019",
                features: [
                    'Настроены аттачи ящиков с БП и медикаментами.',
                    'Настроены аттачи урожая.',
                    'Добавлен килл-лист во время капта.',
                    'Теперь банды могут воровать боеприпасы со склада.',
                    'Незнакомый человек отмечается как "Незнакомец" в чате.',
                    'Добавлено время отдыха между каптами.',
                    'Добавлены блипы бандитов во время капта.',
                    'В HUD добавлено отображение номера сборки сервера.',
                    'Добавлена возможность включить/отключить отображение  ников на F6.',

                ],
                fixed: [
                    'Исправлен баг с поднятием предметов.',
                    'Исправлен баг с появлением курсора после закрытия меню.',
                    'Исправлены наборы женской одежды для Government.',
                    'Исправлен баг с понижением/повышением/увольнением.',
                    'Исправлена возможность прикрепления автомата на спину.',
                    'Исправлены баги с отображением килл-листа.',
                    'Исправлен баг с погрузкой боеприпасов в автомобиль.',
                    'Исправлен баг с типом калибра у дробовика.',
                    'Исправлен баг с зарядкой оружия по ПКМ.',
                    'Исправлен баг с продажей транспорта на авторынке.',

                ],
                improvements: [
                    'Теперь для надевания формы необходимо полностью раздеться.',
                    'Теперь меню закрывается после взятия формы со склада.',
                    'Улучшено быстродействие инвентаря.',
                    'Время ожидания медиков увеличено до трех минут.',
                    'В предложении теперь скрыто имя незнакомца.',
                    'Теперь лидер не может повысить до лидера.',
                    'Команда /pos теперь доступна с 1 уровня администрирования.',

                ],
                removed: [],
                likes: 0,
                liked: false,
            },
            {
                build: 1456,
                date: "Сб, Сен 21, 2019",
                features: [
                    'Теперь при слете автомобилей удаляются ключи из инвентаря.',
                    'Добавлена возможность начать капт через клавишу L.',
                    'Для мафий добавлена возможность взять оружие/патроны.',
                    'Добавлены зоны бизваров.',
                    'Добавлена возможность начать бизвар.',
                    'Добавлены шкала и подсчет киллов для бизвара.',
                    'Добавлено оружие для мафий.',
                    'Добавлен показ влияния у банд и мафий.',
                    'Теперь мафия может поставлять боеприпасы как себе, так и бандитам.',
                    'Бандам и мафиям добавлен общак.',
                    'На сервер добавлена первая тестовая версия личного меню.',
                    'В меню теперь выводится организация, ранг, работа и статистика персонажа.',
                    'В меню выводится информация о доме и бизнесе.',
                    'В меню добавлена информация о скиллах работ.',
                    'В парикмахерские добавлена возможность просмотреть и выбрать прическу.',
                    'В парикмахерские добавлена возможность сменить растительность на лице.',
                    'В парикмахерские добавлен плавный поворот персонажа на A и D.',
                    'В парикмахерские добавлена возможность сменить цвет волос и бороды.',
                ],
                fixed: [
                    'Исправлен баг с остающимся блюром у планшета/инвентаря при двойном нажатии.',
                    'Исправлен баг с миганием килл-листа.',
                    'На ферме убран фарм урожая у багажника.',
                    'Исправлен баг с показом меню взаимодействия во время сбора урожая.',
                    'Исправлен баг с покупкой удочки.',
                    'Исправлен баг с возможностью начать рыбалку.',
                    'Исправлены некоторые баги в приложении для бизнеса.',
                ],
                improvements: [
                    'Врачи теперь могут возить медикаменты в "fbi2".',
                    'Добавлены подсказки после бизвара.',
                    'Бандам добавлена подсказка о скидке в наркопритоне.',
                    'Теперь можно начать захват бизнеса с помощью L.',
                    'Теперь на ферме повышается навык от пополнения пикапа урожаем.',
                    'Теперь работы на ферме доступны в зависимости от навыка.',
                    'Навык грузоперевозчика повышается от доставки зерна/урожая на ферму.',
                    'Теперь при покупке урожая можно указать его количество.',
                    'Теперь максимальное количество продуктов в грузовике зависит от навыка.',
                    'Теперь при продаже автомобиля на авторынке выводится уведомление с ценой его продажи.',
                    'Теперь починка/диагностика в автомастерской недоступны, если на складе нет ресурсов.',
                    'Теперь в автомастерской списываются ресурсы и добавляются деньги в кассу.',
                ],
                removed: [],
                likes: 0,
                liked: false,
            },
            {
                build: 1471,
                date: "Вс, Сен 22, 2019",
                features: [
                    'Добавлена возможность отправить репорт.',
                    'Добавлен антифлуд на отправку репортов.',
                    'Добавлена возможность выдать варн.',
                    'Теперь предмет можно удалить с горячей клавиши.',
                    'Добавлено 5 новых парикмахерских.',
                    'Добавлена шапка в меню магазина масок.',
                    'Добавлена шапка в меню Los Santos Customs.',
                ],
                fixed: [
                    'Исправлен баг с сохранением отыгранных минут.',
                    'Исправлены баги голосового чата и телефона.',
                ],
                improvements: [
                    'Теперь в личном меню отображаются наличные.',
                    'Теперь у персонажа отображается верное количество варнов.',
                    'Теперь нельзя авторизоваться, если аккаунт в бане.',
                    'Теперь в меню можно пролистывать пункты, зажав клавишу.',
                    'Теперь в автомастерских тратятся запчасти и пополняется касса.',
                    'Теперь в АЗС тратится топливо и пополняется касса.',
                    'Теперь в магазине масок тратятся маски и пополняется касса.',
                    'Теперь в парикмахерских тратятся ресурсы и пополняется касса.',
                    'Каждая парикмахерская теперь имеет свою шапку в зависимости от типа.',
                    'Теперь во время примерки масок убираются очки и шляпы.',
                    'Во время просмотра причесок в парикмахерской теперь убираются шляпы, маски и очки.',
                    'Теперь в сообщении репорта выводится ID игрока.',
                    'Теперь в инвентаре выводится название рыбы.',
                    'Изменен внешний вид кнопок навигации по списку игроков.',
                    'Для мафий настроены цвета шкалы бизвара, килл-листа и блипов.',
                ],
                removed: [],
                likes: 0,
                liked: false,
            },
            {
                build: 1536,
                date: "Пт, Сен 27, 2019",
                features: [
                    'В донат добавлена возможность конвертировать валюту, сменить никнейм, снять предупреждение и добавить новый слот.',
                    'Реализована генерация промокодов для игроков.',
                    'Добавлена возможность активировать реферальный промокод.',
                    'Теперь за выполнение условий промокода начисляется награда.',
                    'В личное меню добавлена возможность изменить место спавна.',
                    'В личное меню добавлен статус "Медиа".',
                    'В личное меню добавлена возможность сменить пароль, Email и подтвердить почту.',
                    'Добавлена шкала смерти.',
                    'Добавлено новое вооружение для FIB.',
                    'Реализована синхронизация анимаций. Добавлен функционал для тестирования анимациий.',
                    'Реализован функционал планшета для FIB.',
                    'Добавлено 14 супермаркетов по всей карте.',
                    'В супермаркет добавлена возможность купить телефон.',
                ],
                fixed: [
                    'Исправлен баг с бесконечной загрузкой при получении объявления в планшете Weazel News.',
                    'Исправлен баг с уведомлением в инвентаре.',
                    'Исправлен баг с причиной выдачи розыска.',
                    'Исправлен баг с размером водительского удостоверения.',
                    'Исправлен баг с размытием при нажатии на кнопку "Действия" в меню бизнеса.',
                    'Исправлен баг с поиском в списке игроков.',
                ],
                improvements: [
                    'Теперь для устройства на ферму нужны лицензии.',
                    'Теперь с фермы увольняет при устройстве/увольнении с других работ.',
                    'Добавлена подсказка об изменении скилла на работе.',
                    'В инвентарь добавлена надпись "Без карманов", если на вас нет одежды с карманами.',
                    'Теперь личное меню можно закрыть на ESC.',
                    'Теперь при получении варна увольняет из организации.',
                    'Добавлена проверка на валидность при смене ника.',
                    'Теперь рыбачить можно в любом месте рядом с водой.',
                    'Теперь супермаркеты имеют разные шапки в зависимости от типа.',
                ],
                removed: [],
                likes: 0,
                liked: false,
            },
            {
                build: 1636,
                date: "Вс, Сен 29, 2019",
                features: [
                    'В супермаркет добавлена возможность сменить номер телефона.',
                    'Добавлено приложение для отправки объявлений Weazel News.',
                    'При вызове 911 теперь можно указать причину вызова и выбрать, кому отправить вызов: PD/EMS',
                    'На сервер добавлен список обновлений (во время авторизации или по нажатию F3)',
                    'Теперь списку обновлений можно поставить лайк.',
                    'Полицейским добавлена возможность поиска преступника.',
                    'В магазин оружия добавлена возможность покупки огнестрельного оружия.',
                    'В магазин оружия добавлена возможность покупки боеприпасов.',
                    'Добавлено 9 магазинов оружия.',

                ],
                fixed: [
                    'Исправлена ошибка при покупке дома без гаража.',
                    'Исправлен баг с отсутствием персонажей при входе.',
                    'Исправлен баг с неверным отобрадением статуса в личном меню.',
                    'Исправлен баг с мерцанием подсказок.',
                    'Исправлен баг с продажей бизнеса государству.',
                    'Переписана система знакомств, исправлены ошибки, связанные с ней.',
                    'Теперь в меню указывается верная дата смены пароля.'
                ],
                improvements: [
                    'Слово "Сборка" в худе заменено на иконку.',
                    'Теперь при назначении администратора меняется статус в личном меню.',
                    'Заменены шапки в некоторых супермаркетах.',
                    'Добавлено временное ограничение на поиск преступника.',
                    'Теперь информация в меню обновляется после продажи дома.',
                    'Теперь игрока не кикает после смены никнейма.',
                    'Теперь прослушку FIB можно установить по нажатию ПКМ/используя горячую клавишу.'
                ],
                removed: [],
                likes: 0,
                liked: false,
            },
            {
                build: 1749,
                date: "Ср, Окт 02, 2019",
                features: [
                    'Для FIB добавлена возможность временно изменять номера служебного транспорта.',
                    'Теперь владелец бизнеса может редактировать его экономические параметры.',
                    'Употребление наркотика теперь повышает наркозависимость.',
                    'Курение сигарет теперь увеличивает зависимость от никотина.',
                    'Теперь в меню выводится наркозависимость и зависимость от никотина.',
                    'Добавлена возможность выкурить сигарету по нажатию ПКМ/горячей клавиши.',
                    'Добавлена возможность употребить еду/напиток по нажатию ПКМ/горячей клавиши.',
                    'Реализована синхронизация радиостанций между водителем и пассажирами.',
                    'Weazel News добавлена возможность начать/вести/завершить прямой эфир.',
                    'Weazel News добавлена возможность пригласить гостя в прямой эфир.',
                    'Добавлена возможность вступить в брак и развестись.',
                    'Теперь в меню выводится семейное положение.',
                    'Теперь каждый вид наркотиков имеет свой эффект.',
                    'Теперь в меню выводится количество преступлений и уровень законопослушности.',
                    'Теперь законопослушность понижается при выдаче розыска.'
                ],
                fixed: [
                    'Исправлен баг с пополнением склада бандами.',
                    'Исправлен баг с продажей фермы другому игроку.',
                    'Исправлен баг с повышением игрока выше своего ранга.',
                    'Исправлен баг с посадкой преступника в автомобиль.',
                    'Исправлен баг с отображением данных при установлении личности.',
                    'Исправлен баг с появлением колеса оружий при вводе текста в меню.',
                    'Исправлен баг с кнопкой "Назад" в общаке банды/мафии.',
                    'Исправлен баг с вычислением расстояния у прослушки.',
                    'Исправлен баг с панелью бизнеса.',
                    'Исправлен баг с нажатием кнопки "Создать персонажа".',
                    'Исправлен баг с некорректным отображением водительского удостоверения.',
                    'Исправлен баг с закрытием меню при отправке репорта.'
                ],
                improvements: [
                    'Теперь прослушку можно использовать через меню взаимодействия.',
                    'Теперь игрока можно посадить в тюрьму за городом через меню взаимодействия.',
                    'Фракционная одежда теперь имеет теплоемкость.',
                    'Теперь планшет нельзя открыть при открытом меню.',
                    'Добавлено оффлайн-уведомление о слете фермы.',
                    'Добавлено оффлайн-уведомление при выдаче штрафа/розыска.',
                    'Добавлены звуки в меню выбора.',
                    'Теперь при открытии меню скрывается радар и чат.',
                    'Теперь при открытии инвентаря скрывается радар и чат.',
                    'В меню игрока добавлен логотип проекта.',
                    'Время установления личности увеличено до 15 секунд.',
                    'Добавлено меню взаимодействия для FIB.',
                    'Добавлено ограничение по рангу для начала эфира.',
                    'Добавлена анимация курения сигареты.',
                    'Добавлена анимация при знакомстве.',
                    'Участники эфира теперь удаляются из эфира после выхода с сервера.',
                    'Добавлены новые виды рыб.',
                    'Теперь можно начать рыбалку только находясь лицом к воде.',
                    'Теперь в приложении Weazel News выводится корректная цена.',
                    'Теперь с работы автоматически увольняет при устройстве в организацию.',
                    'Добавлен запрет устраиваться на работу для членов фракций.',
                    'Добавлен анти-флуд на употребление наркотика.',
                    'Теперь в меню выводится номер телефона.',
                    'Теперь в описании предмета выводится калибр оружия.',
                    'Добавлены оффлайн-уведомления после выполнения условий промокода.'
                ],
                removed: [],
                likes: 0,
                liked: false,
            },
            {
                build: 1870,
                date: "Вс, Окт 06, 2019",
                features: [
                    'Реализована возможность копаться в мусорках.',
                    'Теперь предметы в мусорке выдаются в зависимости от их редкости.',
                    'На склад армии добавлены наручники.',
                    'Теперь зарплата бандам и мафиям выдается из общака.',
                    'Реализована синхронизация типов походок.',
                    'Правительству добавлено оружие, наручники, патроны и аптечки.',
                    'Теперь мусор можно сдать на свалке, цена зависит от редкости предмета.',
                    'Добавлен маршрут пилота на ферме.',
                    'Теперь ферма может работать без хозяина.',
                    'Реализованы динамические настройки в личном меню.',
                    'Добавлен планшет для правительства.',
                    'Добавлен планшет для армии.',
                    'Реализованы личные шкафы в организациях.',
                    'Добавлена возможность спавниться дома или в организации.',
                    'Добавлен поиск преступника в планшеты PD и FIB.',
                    'В дома добавлены шкафы и возможность взаимодействия с ними.',
                    'В здание правительства добавлена оплата штрафов и восстановление ключей от авто.',
                    'Реализована покупка и добавление одежды в инвентарь.',
                    'Добавлено 14 магазинов одежды.',
                ],
                fixed: [
                    'Исправлен баг с анти-флудом в репорт.',
                    'Исправлен баг с продажей фермы самому себе.',
                    'Исправлен баг с выкидыванием из авто при написании в чат.',
                    'Исправлен баг с продажей крышей мафии.',
                ],
                improvements: [
                    'В описание предмета добавлены параметры "Владелец" и "Организация".',
                    'Теперь взаимодействовать с домашним шкафом может только владелец.',
                    'Теперь взаимодействовать с багажником личного авто может только владелец.',
                    'Теперь взаимодействовать с багажником фракционного авто может только член фракции.',
                    'В меню игрока теперь отображается количество штрафов.',
                    'Добавлена анимация сбора мусора.',
                    'Теперь мусор нельзя собирать, находясь в транспорте.',
                    'Добавлена подсказка у шкафа организации.',
                    'Теперь репорты от медиа отображаются другим цветом.',
                    'Добавлен запрет на смену почты, если Email занят.',
                    'В меню игрока теперь отображается улица дома/бизнеса.',
                    'Игрок, который не имеет дома/организации, теперь всегда спавнится на улице.',
                    'Теперь в профиле человека в планшетах PD/FIB отображается количество штрафов.',
                    'Теперь в профиле человека в планшетах PD/FIB отображается семейное положение.',
                    'Теперь дубликаты ключей уничтожаются при продаже/покупке/слете транспорта.',
                    'Теперь личное авто заводится только при наличии ключей.',
                    'Теперь взаимодействие с дверями/капотом/багажником доступно только при наличии ключей.',
                ],
                removed: [],
                likes: 0,
                liked: false,
            },
        ],
        // Текущее обновление на экране
        i: 0,
    },
    watch: {
        show(val) {
            if (val) busy.add("changelist", true, true)
            else busy.remove("changelist", true);
        }
    },
    methods: {
        prettyText(text) {
            if (text.length > this.maxLength) return text.substring(0, this.maxLength) + "...";

            return text;
        },
        like() {
            var i = this.i;
            if (!this.list[i]) return;
            if (this.list[i].liked) return notifications.push(`error`, `Вы уже оценили`);
            if (!this.enable) return notifications.push(`error`, `Вы не авторизованы`);

            mp.trigger(`callRemote`, `changelist.like`, i + 1);
            this.list[i].likes++;
            this.list[i].liked = true;
        },
        initLikes(data) {
            if (typeof data == 'string') data = JSON.parse(data);

            for (var id in data) {
                this.list[id - 1].likes = data[id].likes;
                this.list[id - 1].liked = data[id].liked;
            }
        },
        setLikes(id, likes) {
            this.list[id - 1].likes = likes;
        },
    },
    mounted() {
        this.i = this.list.length - 1;

        window.addEventListener('keyup', (e) => {
            if (busy.includes(["chat", "terminal", "interaction", "mapCase", "phone", "playerMenu", "inventory"])) return;

            if (e.keyCode == 114 && this.enable) this.show = !this.show;
        });
    },
});

// for tests
// changelist.show = true;
