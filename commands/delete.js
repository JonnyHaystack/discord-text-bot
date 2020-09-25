const customCommands = require("../customCommands");
const security = require("../security");
const config = require("../config.json");

function execute(msg, args) {
    if (!security.isAdmin(msg.member)) return;

    // Usage text.
    if (args.length < 1) {
        msg.channel.send(`Usage: ${config.prefix}${command} <command name>`);
        return;
    }

    const customCommandName = args[0].toLowerCase();

    if (customCommands.commands.hasOwnProperty(customCommandName)) {
        delete customCommands.commands[customCommandName];

        try {
            customCommands.saveCommands();
        } catch (err) {
            msg.channel.send("Failed to save command.");
            return;
        }

        console.log(
            `Command ${config.prefix}${customCommandName} has been deleted.`
        );
        msg.channel.send(
            `Command ${config.prefix}${customCommandName} has been deleted.`
        );
    } else {
        msg.channel.send(
            `Command ${config.prefix}${customCommandName} does not exist.`
        );
    }
}

module.exports = {
    name: "delete",
    execute,
};
