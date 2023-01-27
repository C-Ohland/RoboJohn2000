// Require the necessary discord.js classes
const cron = require('node-cron')
const fs = require('node:fs');
const path = require('node:path');
const gamesPath = path.join(__dirname, '/gamelist');
const attendancePath = path.join(__dirname, '/attendance');
const votesPath = path.join(__dirname, '/votes');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { guildId, token, targetTextId} = require('./config.json');
var gameList;

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });


// Retreive slash commands
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}


// Retreive event handlers
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Log in to Discord with your client's token
client.login(token);
setTimeout(() => {
	client.user.setActivity('Arma 2');
},5000);


// Timed voting closeout warning
var voteWarning = cron.schedule('58 6 * * Fridays', () => {
	console.log("vote warning");
	const targetChannel = client.channels.cache.get(targetTextId);
	targetChannel.send('Concluding vote based on current attendees in 20 minutes! Make sure to get in any last-minute votes and use \/here to log your attendance for this weeks so your votes are counted.');
	
}, {
	scheduled : true,
	timezone: "America/Chicago"
});

// Timed prompt to vote
var votePrompt = cron.schedule('0 8 * * Mondays', () => {
	console.log("vote prompt");
	const targetChannel = client.channels.cache.get(targetTextId);
	
	gameList = '';
	gameFiles = fs.readdirSync(gamesPath).filter(file => file.endsWith('.json'));
	if (gameFiles.length){
		for (const file of gameFiles) {
			const { name } = require(gamesPath + '/' + file);
			gameList = gameList + name + '\n';
		}
	}
	else {
		gameList = 'There are currently no games on the game list, so make sure to add some and then vote!'
	}
	
	targetChannel.send('Make sure to update your votes with \/vote this week! Otherwise, I\'ll use your existing votes. The games currently up for vote are:\n' + gameList);
	
}, {
	scheduled : true,
	timezone: "America/Chicago"
});

//Timed vote closeout
var votePrompt = cron.schedule('18 7 * * Fridays', () => {
	console.log("vote closeout");
	const targetChannel = client.channels.cache.get(targetTextId);
	const attendanceFiles = fs.readdirSync(attendancePath).filter(file => file.endsWith('.json'));
	var tallyVotes = [];
	const gameFiles = fs.readdirSync(gamesPath).filter(file => file.endsWith('.json'));
	for (game of gameFiles){
		const { name, maxPlayers } = require(gamesPath + '/' + game);
		
		if (maxPlayers > attendanceFiles.length)
			tallyVotes.push([name, 0])
	}
	console.log(tallyVotes);
	
	
	
	for (attendee of attendanceFiles)
	{
		console.log(attendee);

		const { votes } = require(votesPath + '/' + attendee);
		console.log(votes);
		
		for (voteTotal of tallyVotes){
			for (vote of votes){
				if (voteTotal[0] == vote)
					voteTotal[1] += 1;
			}
		}
		
		// fs.unlink(attendancePath + '/' + attendee, (err) => {
		// if (err){
			// console.log(err);
		// }
		// else {
			// console.log('attendee removed');
		// }});

		console.log(tallyVotes);
	}
	
	var votesSorted = '';
	var maxVotes = 0;
	var winningGames = [];
	for (gameVotes of tallyVotes){
		if (gameVotes[1] > maxVotes)
			maxVotes = gameVotes[1];
	}
	for (let i = maxVotes; i > 0; i--) {
		for (gameVotes of tallyVotes){
			if (gameVotes[1] == i){
				votesSorted += gameVotes[0] + ': ' + gameVotes[1] + '\n';
				if (i == maxVotes)
					winningGames.push(gameVotes[0]);
			}
		}
	}
	
	targetChannel.send('Time\'s up! Here are the tallied votes for games suitable for the number of attendees today: \n' + votesSorted);
	
	if (winningGames.length > 1){
		winner = Math.floor(Math.random() * winningGames.length);
		targetChannel.send('With multiple games tied for first, I randomly select '+ winningGames[winner] + ' as the winner for this week.');
	}
	else
		targetChannel.send(winningGames[0] + ' wins!!');
	
}, {
	scheduled : true,
	timezone: "America/Chicago"
});

// RoboJohn goes to sleep
var votePrompt = cron.schedule('0 9 * * *', () => {
	console.log("going to sleep");
	
	client.user.setStatus('invisible');
	
	console.log("zzzz");
}, {
	scheduled : true,
	timezone: "America/Chicago"
});

// RoboJohn wakes up
var votePrompt = cron.schedule('0 6 * * *', () => {
	console.log("Waking up");
	
	client.user.setStatus('online');
	
	console.log("happy day!");
	
}, {
	scheduled : true,
	timezone: "America/Chicago"
});