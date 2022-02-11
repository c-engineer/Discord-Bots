import DiscordJS, { Intents } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config({path: '../../.env'});

const memberCount = require('./member-count');

const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
});

// Check Bot is Online
client.on('ready', () => {
    client.user?.setActivity('00110010', { type: 'WATCHING'});
    memberCount(client);
});

// Display User Verified Role
client.on('messageCreate', (message) => {
    if(message.content === 'role') {
        if (message.member?.roles.cache.some(role => role.name === 'Admin')) {
            message.reply({
                content: 'You are a verified admin 🛡',
            });
        } else if (message.member?.roles.cache.some(role => role.name === 'Mod')) {
            message.reply({
                content: 'You are a verified mod ⚔',
            });
        } else if (message.member?.roles.cache.some(role => role.name === 'WL')) {
            message.reply({
                content: 'You are a Whitelist Investor 💎',
            });
        } else if (message.member?.roles.cache.some(role => role.name === 'VIP')) {
            message.reply({
                content: 'You are a VIP Investor 🔥',
            });
        } 
    }
});

client.login(process.env.DISCORD_SERVER_GATEKEEPER_TOKEN);