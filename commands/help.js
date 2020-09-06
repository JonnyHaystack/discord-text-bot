const customCommands = require("../customCommands");
const { dynamicSort } = require("../sort");
const config = require("../config.json");

function execute(msg, args) {
    msg.channel.send(`Currently defined commands are:\n${listCommands()}`);
}

function listCommands() {
    // Group commands by category.
    const commands = customCommands.commands;
    const commandsArray = Object.keys(commands).map((key) => ({
        name: key,
        category:
            commands[key].category === undefined
                ? "Misc"
                : commands[key].category,
    }));
    const commandsGroupedByCategory = groupBy(commandsArray, "category");

    // Print each category separately for ease of reading.
    let commandsList = "";
    Object.keys(commandsGroupedByCategory).forEach((categoryName) => {
        commandsList += `${categoryName}: `;

        // Sort commands alphabetically.
        commandsGroupedByCategory[categoryName].sort(dynamicSort("name"));

        // Print command list for this category.
        commandsList += commandsGroupedByCategory[categoryName]
            .map((command) => `\`${config.prefix}${command.name}\``)
            .join(", ");
        commandsList += "\n";
    });
    return commandsList;
}

// Taken from https://stackoverflow.com/a/34890276
function groupBy(arr, key) {
    return arr.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
}

module.exports = {
    name: "help",
    execute,
};
