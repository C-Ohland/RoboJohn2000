// Require the necessary discord.js classes
const cron = require('node-cron')
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();


// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent] });


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

// Log in to Discord with your client's process.env.DISCORD_TOKEN
client.login(process.env.DISCORD_TOKEN);
setTimeout(() => {
	let date_ob = new Date();
	if (date_ob.getHours() > 2 && date_ob.getHours() < 12) {
		client.user.setActivity('Recharging');
		client.user.setStatus('dnd');
	}
	else {
		client.user.setActivity('Arma 3');
		client.user.setStatus('online');
	}
},6000);


// Timed voting closeout warning
var voteWarning = cron.schedule('38 18 * * Fridays', () => {
	console.log("vote warning");
	const targetChannel = client.channels.cache.get(process.env.CHANNEL_ID);
	targetChannel.send('Concluding vote based on current attendees in 20 minutes! Make sure to get in any last-minute votes and use \/here to log your attendance for this week so your votes are counted.');
	
}, {
	scheduled : true,
	timezone: "America/Chicago"
});

// Timed prompt to vote
var voteTime = cron.schedule('0 8 * * Mondays', () => {
	votePrompt();
}, {
	scheduled : true,
	timezone: "America/Chicago"
});

//Timed vote closeout
var voteCloseout = cron.schedule('58 18 * * Fridays', () => {
	console.log('making attempt');
	voteTally(true);
	}, {
	scheduled : true,
	timezone: "America/Chicago"
});

// RoboJohn goes to sleep
var sleep = cron.schedule('0 21 * * *', () => {
	console.log("zzzzz");
	
	client.user.setStatus('dnd');
	client.user.setActivity('Recharging');
	
}, {
	scheduled : true,
	timezone: "America/Chicago"
});

// RoboJohn wakes up
var awaken = cron.schedule('0 6 * * *', () => {
	console.log("Waking up");
	
	client.user.setStatus('online');
	client.user.setActivity('Arma 3');
	
	console.log("happy day!");
	
}, {
	scheduled : true,
	timezone: "America/Chicago"
});

// RoboJohn lets people know what's likely to be picked
var likelyGame = cron.schedule('0 18 * * Thursdays', () => {
	voteTally(false);
	
}, {
	scheduled : true,
	timezone: "America/Chicago"
});

// RoboJohn lets people know what's likely to be picked
var likelyGame = cron.schedule('0 18 * * Thursdays', () => {
	voteTally(false);
	
}, {
	scheduled : true,
	timezone: "America/Chicago"
});

// Wipe Attendance
var resetVotes = cron.schedule('0 23 * * Fridays', () => {
	console.log("Clearing attendance")
	clearAttendance();
	
}, {
	scheduled : true,
	timezone: "America/Chicago"
});

function voteTally(final) {
	console.log("vote closeout");
	const targetChannel = client.channels.cache.get(process.env.CHANNEL_ID);
	const gamesPath = path.join(__dirname, 'server_data/'+process.env.GUILD_ID+'/gamelist')
	const attendancePath = path.join(__dirname, 'server_data/'+process.env.GUILD_ID+'/attendance')
	const votesPath = path.join(__dirname, 'server_data/'+process.env.GUILD_ID+'/votes')
	const gameFiles = fs.readdirSync(gamesPath).filter(file => file.endsWith('.json'))
	const attendanceFiles = fs.readdirSync(attendancePath).filter(file => file.endsWith('.json'))

	var hereVotes = [];
	var winningGames = [];

	for (game of gameFiles){
		const { name } = require(gamesPath + '/' + game);

		hereVotes.push([name, 0])
	}

	for (attendee of attendanceFiles){
		console.log(attendee);

		const { votes } = require(votesPath + '/' + attendee);
		console.log(votes);
	
		for (voteHereTotal of hereVotes){
			for (voteHere of votes){
				if (voteHereTotal[0] == voteHere)
					voteHereTotal[1] += 1;
			}
		}

		console.log(hereVotes);
	}

	var votesHereSorted = '';
	var maxVotes = 0;
	for (gameHereVotes of hereVotes){
		if (gameHereVotes[1] > maxVotes)
			maxVotes = gameHereVotes[1];
	}
	for (let i = maxVotes; i > 0; i--) {
		for (gameHereVotes of hereVotes){
			if (gameHereVotes[1] == i){
				votesHereSorted += gameHereVotes[0] + ': ' + gameHereVotes[1] + '\n';
				if (i == maxVotes) winningGames.push(gameVotes[0])
			}
		}
	}


	if (final){
		targetChannel.send('Time\'s up! Here are the tallied votes for games suitable for the number of attendees today: \n' + votesHereSorted);
		if (winningGames.length > 1){
			winner = Math.floor(Math.random() * winningGames.length);
			targetChannel.send('With multiple games tied for first, I randomly select '+ winningGames[winner] + ' as the winner for this week.');
		}
		else targetChannel.send(winningGames[0] + ' wins!');
	}
	else {
		targetChannel.send('Current attendees\' votes are: \n' + votesHereSorted + '\nIf you\'re interested in one of the leading games, make sure to /vote and /here before tomorrow night.')
	}
}


function votePrompt() {
	console.log("vote prompt");
	const targetChannel = client.channels.cache.get(process.env.CHANNEL_ID)
	const gamesPath = path.join(__dirname, 'server_data/'+process.env.GUILD_ID+'/gamelist')
	const gameFiles = fs.readdirSync(gamesPath).filter(file => file.endsWith('.json'))
	var gameList = '';
	
	if (gameFiles.length){
		for (const file of gameFiles) {
			const { name } = require(gamesPath + '/' + file);
			gameList = gameList + name + '\n';
		}
		gameMessage = 'The games currently up for vote are :\n' + gamelist
	}
	else {
		gameMessage = 'There are no games on the gamelist right now, so make sure to add some and then vote!'
	}
	targetChannel.send('Make sure to update your votes with \/vote this week! Otherwise I\'ll use your existing votes.' + gameMessage)
}

function clearAttendance() {
	const attendancePath = path.join(__dirname, 'server_data/'+process.env.GUILD_ID+'/attendance')
	const attendanceFiles = fs.readdirSync(attendancePath).filter(file => file.endsWith('.json'))
	const targetChannel = client.channels.cache.get(process.env.CHANNEL_ID)

	for (attendee of attendanceFiles){
		fs.unlink(attendancePath + '/' + attendee, (err) => {
			targetChannel.send('Error resetting attendance')
		})
	}
}