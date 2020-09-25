const fs = require("fs");

// Load user-defined commands.
let commands;
try {
    commands = JSON.parse(fs.readFileSync("commands.json", "utf8"));
} catch (err) {
    console.log(err);
    commands = {};
}

function execute(msg, command) {
    // Look up command from the loaded commands.json, then send the text of that
    // command to the channel in which the command was used.
    msg.channel.send(commands[command].text);
}

function saveCommands() {
    const data = JSON.stringify(commands);
    fs.writeFile("commands.json", data, (err) => {
        if (err) {
            console.log("Failed to save custom command.");
            console.log(err);
            throw err;
        }
        console.log("Saved custom commands.");
    });
}

module.exports = {
    commands,
    execute,
    saveCommands,
};
