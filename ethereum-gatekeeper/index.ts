import DiscordJS, { Intents } from 'discord.js';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { createAlchemyWeb3 }from '@alch/alchemy-web3';
dotenv.config({path: '../../.env'});

const date = new Date();
const web3 = createAlchemyWeb3(process.env.INFURA_API_URL + '/' + process.env.INFURA_API_KEY);
const etherscan = process.env.ETHERSCAN_API_URL;

const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ],
});

// Check Bot is Online
client.on('ready', () => {
    client.user?.setActivity('Ethereum Blockchain', { type: 'WATCHING'});
    console.log('Ethereum Gatekeeper is Online.');
});

async function getBlock() {
    let block = await web3.eth.getBlockNumber();
    return block;
}

async function getGweiPrice() {
    let weiGas = await web3.eth.getGasPrice();
    let ethGas = web3.utils.fromWei(weiGas);
    return ethGas;
}

async function getPrice() {
    const response = await fetch(etherscan + '?module=stats&action=ethprice&apikey=' + process.env.ETHERSCAN_API_KEY);
    let json = response.json();
    return json;
}

async function gasTracker() {
    const response = await fetch(etherscan + '?module=gastracker&action=gasoracle&apikey=' + process.env.ETHERSCAN_API_KEY);
    let json = response.json();
    return json;
}

// Get Ethereum Current Block Number
client.on('messageCreate', (message) => {
    if(message.content === 'eth-block') {
        getBlock().then(function(data) {
            message.reply({
                content: '🗳 Current Block: ' + String(data),
            });
            console.log('🗳 Current Block: ' + data);
        });
    }
});

// Get Ethereum Current Gas Price (Gwei)
client.on('messageCreate', (message) => {
    if(message.content === 'eth-gas-1') {
        getGweiPrice().then(function(data) {
            message.reply({
                content: '⛽ Gas Price: ' + String(data),
            });
            console.log('⛽ Gas Price: ' + data);
        });
    }
});

// Ethereum Gas Price (BTC & USD)
client.on('messageCreate', (message) => {
    if(message.content === 'eth-gas-2') {
        getPrice().then(function(data) {
            if(data.message === 'OK') {
                let ethbtc = data.result.ethbtc;
                date.setTime(data.result.ethbtc_timestamp);
                let ethbtcTimestamp = date.toUTCString();
                let ethusd = data.result.ethusd;
                date.setTime(data.result.ethusd_timestamp);
                let ethusdTimestamp = date.toUTCString();

                let output = '1 ETH = ' + ethbtc + 'BTC - Updated at: ' + ethbtcTimestamp + '\n' +
                                '1 ETH = $' + ethusd + ' - Updated at: ' + ethusdTimestamp; 

                message.reply({
                    content: String(output),
                });
                console.log(output);
            }
        });
    }
});

// Ethereum Gas Tracker
client.on('messageCreate', (message) => {
    if(message.content === 'eth-gas-tracker') {
        gasTracker().then(function(data) {
            // Gas Price Updated
            if (data.message === 'OK') {
                let safeGasPrice = data.result.SafeGasPrice + ' Gwei';
                let medGasPrice = data.result.ProposeGasPrice + ' Gwei';
                let fastGasPrice = data.result.FastGasPrice + ' Gwei';

                let output = '⚡ Safe Gas Price: ' + safeGasPrice + '\n' + 
                                '⚡ Proposed Gas Price: ' + medGasPrice + '\n' + 
                                '⚡ Fast Gas Price: ' + fastGasPrice + '\n';
                message.reply({
                    content: String(output),
                });
                console.log(output);
            }
        });
    }
});

client.login(process.env.DISCORD_ETH_GATEKEEPER_TOKEN);