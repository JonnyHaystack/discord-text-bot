const customCommands = require("../customCommands");
const { dynamicSort } = require("../sort");
const config = require("../config.json");

function execute(msg, args) {
    let helpMessage = "";
    let category = null;
    if (args.length == 1) {
        category = args[0];
    } else {
        if (config.hasOwnProperty("helpPrefix")) {
            helpMessage += `${config.helpPrefix}\n`;
        }
        helpMessage += "Currently defined commands are:\n";
    }
    helpMessage += listCommands(category);
    msg.channel.send(helpMessage);
}

function listCommands(category) {
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
        // Exclude hidden categories (unless a category is explicitly
        // specified).
        if (
            category == null &&
            config.hasOwnProperty("hiddenCategories") &&
            config.hiddenCategories.includes(categoryName)
        )
            return;
        // If category is specified, exclude all but the specified category
        // (case-insensitive though so it could technically match multiple).
        if (
            category != null &&
            categoryName.toUpperCase() != category.toUpperCase()
        )
            return;

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
