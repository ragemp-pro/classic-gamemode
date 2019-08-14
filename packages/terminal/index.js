"use strict";
let notifs = require('../notifications');

module.exports = {
    // Мин. уровень админки для доступа к кносоли (character.admin)
    access: 6,
    // Доступные команды
    commands: {},


    haveAccess(player) {
        return player.character.admin >= this.access;
    },
    handleCommand(player, cmdName, cmdArgs) {
        if (!this.haveAccess(player)) return notifs.error(player, `Доступ запрещен`, "Терминал");
        // if (cmdName == "help") return helpCmdHandler(player, cmdArgs);
        var cmd = this.commands["/" + cmdName];
        if (!cmd) return this.error(`Команда "${cmdName}" не найдена. Введите "help" для просмотра всех команд.`, player);
        if (cmd.args.length > 0) {
            var syntax = cmd.args.split(" ");
            if (cmdArgs.length < syntax.length) return this.warning(`Неверное количество параметров.<br/>Используйте "${cmdName} ${cmd.args}"`, player);
            for (var i = 0; i < syntax.length; i++) {
                var argType = syntax[i].split(":")[1];
                if (!argType) continue;
                if (!isValidArg(argType, cmdArgs[i])) return this.error(`Неверное значение "${cmdArgs[i]}" для параметра ${syntax[i]}!`, player);
                else cmdArgs[i] = toValidArg(argType, cmdArgs[i]);
            }
        }
        if (player.character.admin < cmd.access) return this.warning(`Вам недоступна эта команда. Введите "help [name]" для ознакомления`, player);
        cmd.handler(player, cmdArgs, this);
    },
    log(text, player) {
        this.push('log', text, player);
    },
    info(text, player) {
        this.push('info', text, player);
    },
    warning(text, player) {
        this.push('warning', text, player);
    },
    error(text, player) {
        this.push('error', text, player);
    },
    debug(text, player) {
        this.push('debug', text, player);
    },
    push(type, text, player) {
        if (player) return player.call(`terminal.push`, [type, text]);

        mp.players.forEach((rec) => {
            if (this.haveAccess(rec)) rec.call(`terminal.push`, [type, text]);
        });
    },
};
