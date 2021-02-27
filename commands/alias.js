const customCommands = require("../customCommands");
const security = require("../security");
const config = require("../config.json");

function execute(msg, args) {
    if (!security.isAdmin(msg.member)) return;

    // Usage text.
    if (args.length != 2) {
        msg.channel.send(
            `Usage: ${config.prefix}${module.exports.name} <alias name> ` +
                `<command name>`
        );
        return;
    }

    const aliasName = args[0].toLowerCase();
    const commandName = args[1].toLowerCase();

    // Don't allow overwriting existing commands with an alias. They must first
    // be deleted manually.
    if (
        customCommands.commands.hasOwnProperty(aliasName) &&
        customCommands.commands[aliasName].hasOwnProperty("text")
    ) {
        msg.channel.send(
            `${config.prefix}${aliasName} is an existing command. ` +
                `Please delete it manually first.`
        );
        return;
    }

    // Check that aliased command actually exists.
    if (!customCommands.commands.hasOwnProperty(commandName)) {
        msg.channel.send(
            `Command ${config.prefix}${commandName} does not exist.`
        );
        return;
    }

    customCommands.commands[aliasName] = {
        alias: commandName,
    };

    try {
        customCommands.saveCommands();
    } catch (err) {
        msg.channel.send("Failed to save command.");
        return;
    }

    console.log(`Alias ${config.prefix}${aliasName} has been defined.`);
    msg.channel.send(`Alias ${config.prefix}${aliasName} has been defined.`);
}

module.exports = {
    name: "alias",
    execute,
};
