const customCommands = require("../customCommands");
const security = require("../security");
const config = require("../config.json");

function execute(msg, args) {
    if (!security.isAdmin(msg.member)) return;

    // Usage text.
    if (args.length < 2) {
        msg.channel.send(
            `Usage: ${config.prefix}${module.exports.name} <command name> ` +
                `<text>`
        );
        return;
    }

    const customCommandName = args[0].toLowerCase();
    const customCommandText = args.splice(1).join(" ");

    customCommands.commands[customCommandName] = {
        ...customCommands.commands[customCommandName],
        text: customCommandText,
    };

    try {
        customCommands.saveCommands();
    } catch (err) {
        msg.channel.send("Failed to save command.");
        return;
    }

    console.log(
        `Command ${config.prefix}${customCommandName} has been defined.`
    );
    msg.channel.send(
        `Command ${config.prefix}${customCommandName} has been defined.`
    );
}

module.exports = {
    name: "define",
    execute,
};
