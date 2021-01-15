const customCommands = require("../customCommands");

function execute(msg, args) {
    const categories = [
        ...new Set(
            Object.values(customCommands.commands).map(
                (command) => command.category
            )
        ),
    ];
    const response =
        `Type "!help <category>" to view the commands in a category.\n` +
        `Existing categories: ${categories.join(", ")}`;
    msg.channel.send(response);
}

module.exports = {
    name: "categories",
    execute,
};
