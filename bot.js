const fs = require("fs");
const Discord = require("discord.js");
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

        customCommands[customCommandName] = customCommandText;
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
    } else if (command === "help") {
        msg.channel.send(
            `To create a new command, type "!define <command name> ` +
                `<what you want the command to say>"\n` +
                `Currently defined commands are: ${listCommands()}`
        );
    } else if (customCommands.hasOwnProperty(command)) {
        // This message handler must come last otherwise it would allow built-in
        // commands to be overriden.
        handleCustomCommand(msg, command);
    }
});

function handleCustomCommand(msg, command) {
    // Look up command from the loaded commands.json, then send the text of that
    // command to the channel in which the command was used.
    msg.channel.send(customCommands[command]).then((sentMessage) => {
        // Filter embeds to get only the image and gifv embeds, then edit the
        // message to contain these embeds only.
        const imageEmbedsOnly = sentMessage.embeds.filter(
            (embed) => embed.type === "image" || embed.type === "gifv"
        );

        // If not all embeds are images, remove all embeds and re-add the
        // images.
        if (imageEmbedsOnly.length < sentMessage.embeds.length) {
            sentMessage.suppressEmbeds(true);
            imageEmbedsOnly.forEach((embed) =>
                sentMessage.edit(sentMessage.content, embed.thumbnail.proxyURL)
            );
        }
    });
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
    return Object.keys(customCommands)
        .map((command) => `${config.prefix}${command}`)
        .join(", ");
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

client.login(config.token);
