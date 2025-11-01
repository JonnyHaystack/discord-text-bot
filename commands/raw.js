const customCommands = require("../customCommands");
const security = require("../security");
const config = require("../config/config.json");

function execute(msg, args) {
    if (!security.isAdmin(msg.member)) return;

    // Usage text.
    if (args.length < 1) {
        msg.channel.send(
            `Usage: ${config.prefix}${module.exports.name} <command name>`
        );
        return;
    }

    const customCommandName = args[0].toLowerCase();

    if (customCommands.commands.hasOwnProperty(customCommandName)) {
        const customCommand = customCommands.commands[customCommandName];

        if (customCommand.hasOwnProperty("alias")) {
            msg.channel.send(
                "```!alias " +
                    customCommandName +
                    " " +
                    customCommand.alias +
                    "```"
            );
            return;
        }

        msg.channel.send(
            "```!define " + customCommandName + " " + customCommand.text + "```"
        );
        return;
    }

    msg.channel.send(
        `Command ${config.prefix}${customCommandName} does not exist.`
    );
}

module.exports = {
    name: "raw",
    execute,
};
