const fs = require("fs");
const Discord = require("discord.js");
const { dynamicSort } = require("./sort");
const config = require("./config.json");
const permissions = require("./permissions.json");

const client = new Discord.Client();

let customCommands;
try {
    customCommands = JSON.parse(fs.readFileSync("commands.json", "utf8"));
} catch (err) {
    customCommands = {};
}

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on("message", (msg) => {
    if (!msg.content.startsWith(config.prefix) || msg.author.bot) return;

    const args = msg.content.slice(config.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === "define") {
        if (!isAdmin(msg.member)) return;

        // Usage text.
        if (args.length < 2) {
            msg.channel.send(
                `Usage: ${config.prefix}${command} <command name> <text>`
            );
            return;
        }

        const customCommandName = args[0].toLowerCase();
        const customCommandText = args.splice(1).join(" ");

        customCommands[customCommandName] = { text: customCommandText };
        saveCommands();

        console.log(
            `Command ${config.prefix}${customCommandName} has been defined.`
        );
        msg.channel.send(
            `Command ${config.prefix}${customCommandName} has been defined.`
        );
    } else if (command === "delete") {
        if (!isAdmin(msg.member)) return;

        // Usage text.
        if (args.length < 1) {
            msg.channel.send(
                `Usage: ${config.prefix}${command} <command name>`
            );
            return;
        }

        const customCommandName = args[0].toLowerCase();

        if (customCommands.hasOwnProperty(customCommandName)) {
            delete customCommands[customCommandName];
            saveCommands();

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
    } else if (command === "tag") {
        if (!isAdmin(msg.member)) return;

        // Usage text.
        if (args.length < 2) {
            msg.channel.send(
                `Usage: ${config.prefix}${command} <command> <category>`
            );
        }

        const customCommandName = args[0].toLowerCase();
        const category = args[1];

        if (customCommands.hasOwnProperty(customCommandName)) {
            // The special category "clear" means to remove the current category
            // of the command.
            if (category === "clear") {
                delete customCommands[customCommandName].category;

                console.log(
                    `Cleared category of command ` +
                        `${config.prefix}${customCommandName}`
                );
                msg.channel.send(
                    `Cleared category of command ` +
                        `${config.prefix}${customCommandName}`
                );
            } else {
                customCommands[customCommandName].category = category;

                console.log(
                    `Command ${config.prefix}${customCommandName} has been ` +
                        `moved to category ${category}.`
                );
                msg.channel.send(
                    `Command ${config.prefix}${customCommandName} has been ` +
                        `moved to category ${category}.`
                );
            }

            saveCommands();
        } else {
            msg.channel.send(
                `Command ${config.prefix}${customCommandName} does not exist.`
            );
        }
    } else if (command === "help") {
        msg.channel.send(`Currently defined commands are:\n${listCommands()}`);
    } else if (customCommands.hasOwnProperty(command)) {
        // This message handler must come last otherwise it would allow built-in
        // commands to be overriden.
        handleCustomCommand(msg, command);
    }
});

function handleCustomCommand(msg, command) {
    // Look up command from the loaded commands.json, then send the text of that
    // command to the channel in which the command was used.
    msg.channel.send(customCommands[command].text);
}

function saveCommands() {
    const data = JSON.stringify(customCommands);
    fs.writeFile("commands.json", data, (err) => {
        if (err) {
            console.log("Failed to save custom command.");
            console.log(err);
            return;
        }
        console.log("Saved custom commands.");
    });
}

function listCommands() {
    // Group commands by category.
    const customCommandsArray = Object.keys(customCommands).map((key) => ({
        name: key,
        category:
            customCommands[key].category === undefined
                ? "Misc"
                : customCommands[key].category,
    }));
    const commandsGroupedByCategory = groupBy(customCommandsArray, "category");

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

function isAdmin(member) {
    const guildName = member.guild.name;
    if (
        !permissions.guilds.hasOwnProperty(guildName) ||
        !permissions.guilds[guildName].hasOwnProperty("adminRoles")
    ) {
        console.log(permissions);
        return false;
    }

    const adminRoles = permissions.guilds[guildName].adminRoles;
    const memberRoles = member.roles.cache;

    return memberRoles.some(
        (role) => adminRoles.includes(role.name) || adminRoles.includes("*")
    );
}

// Taken from https://stackoverflow.com/a/34890276
function groupBy(arr, key) {
    return arr.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
}

client.login(config.token);
