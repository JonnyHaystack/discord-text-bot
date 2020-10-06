const customCommands = require("../customCommands");
const security = require("../security");
const config = require("../config.json");

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
        msg.channel.send(
            "```!define " +
                customCommandName +
                " " +
                customCommands.commands[customCommandName].text +
                "```"
        );
    } else {
        msg.channel.send(
            `Command ${config.prefix}${customCommandName} does not exist.`
        );
    }
}

module.exports = {
    name: "raw",
    execute,
};
