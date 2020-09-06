const permissions = require("./permissions.json");

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

module.exports = {
    isAdmin,
};
