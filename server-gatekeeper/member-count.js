module.exports = (client) => {
    const channelID = 'Enter Channel ID';

    const updateMembers = guild => {
        const channel = guild.channels.cache.get(channelID);
        channel.setName(`Members: ${guild.memberCount.toLocaleString()} `);
    }

    client.on('guildMemberAdd', member => updateMembers(member.guild));
    client.on('guildMemberRemove', member => updateMembers(member.guild));

    const guild = client.guilds.cache.get('Enter Server ID');
    updateMembers(guild);
}