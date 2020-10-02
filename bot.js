const fs = require("fs");
const Discord = require("discord.js");
const customCommands = require("./customCommands");
const config = require("./config.json");

const client = new Discord.Client();

// Load built-in commands.
client.commands = new Discord.Collection();

const commandFiles = fs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on("message", (msg) => {
    if (!msg.content.startsWith(config.prefix) || msg.author.bot) return;

    const args = msg.content.slice(config.prefix.length).trim().split(" ");
    const command = args.shift().toLowerCase();

    if (client.commands.has(command)) {
        client.commands.get(command).execute(msg, args);
    } else if (customCommands.commands.hasOwnProperty(command)) {
        // This message handler must come last otherwise it would allow built-in
        // commands to be overriden.
        customCommands.execute(msg, command);
    }
});

client.login(config.token);
