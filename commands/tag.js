const customCommands = require("../customCommands");
const security = require("../security");
const config = require("../config.json");

function execute(msg, args) {
    if (!security.isAdmin(msg.member)) return;

    // Usage text.
    if (args.length < 2) {
        msg.channel.send(
            `Usage: ${config.prefix}${command} <command> <category>`
        );
    }

    const customCommandName = args[0].toLowerCase();
    const category = args[1];

    if (customCommands.commands.hasOwnProperty(customCommandName)) {
        // The special category "clear" means to remove the current category
        // of the command.
        if (category === "clear") {
            delete customCommands.commands[customCommandName].category;

            console.log(
                `Cleared category of command ` +
                    `${config.prefix}${customCommandName}`
            );
            msg.channel.send(
                `Cleared category of command ` +
                    `${config.prefix}${customCommandName}`
            );
        } else {
            customCommands.commands[customCommandName].category = category;

            console.log(
                `Command ${config.prefix}${customCommandName} has been ` +
                    `moved to category ${category}.`
            );
            msg.channel.send(
                `Command ${config.prefix}${customCommandName} has been ` +
                    `moved to category ${category}.`
            );
        }

        try {
            customCommands.saveCommands();
        } catch (err) {
            msg.channel.send("Failed to save command.");
            return;
        }
    } else {
        msg.channel.send(
            `Command ${config.prefix}${customCommandName} does not exist.`
        );
    }
}

module.exports = {
    name: "tag",
    execute,
};
