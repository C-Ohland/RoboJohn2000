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
	if (date_ob.getHours() > 20 || date_ob.getHours() < 6) {
		client.user.setActivity('Recharging');
		client.user.setStatus('dnd');
	}
	else {
		client.user.setActivity('Arma 3');
		client.user.setStatus('online');
	}
},6000);


// Timed voting closeout warning
var voteWarning = cron.schedule('58 18 * * Fridays', () => {
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
var voteCloseout = cron.schedule('18 19 * * Fridays', () => {
	console.log('making attempt');
	voteTally();
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

function voteTally() {
	console.log("vote closeout");
	const targetChannel = client.channels.cache.get(process.env.CHANNEL_ID);
	const gameChannel = client.channels.cache.get(process.env.GAMELIST_ID);
	const attendanceChannel = client.channels.cache.get(process.env.ATTENDANCE_ID);
	const votesChannel = client.channels.cache.get(process.env.VOTES_ID);
	var hereVotes = [];
	var winningGames = [];
	gameChannel.messages.fetch().then(games => {
		console.log('Received ' + games.size + ' games');
		//Iterate through the messages here with the variable "messages".
		
		const voteThreads = votesChannel.threads.cache
		var index = 0;
		attendanceChannel.messages.fetch().then(attendees => {
			games.forEach(game => {
				const name = game.content.substring(0, game.content.indexOf('@'));
				if (game.content.substring(game.content.indexOf('@')+1, game.content.length) > attendees.size) hereVotes.push([name, 0]);
				console.log(hereVotes);
			})
			console.log('here1')
			voteThreads.forEach(voter => {
				attendees.forEach(attendee => {
					console.log(attendee.content);
					index += 1;
					if (attendee.content == voter.name) voter.messages.fetch().then(votes => {
						votes.forEach(vote => {
								for (hereGameVotes of hereVotes) if (hereGameVotes[0] == vote.content) hereGameVotes[1] +=1;
						})
						console.log('here2');
						console.log(hereGameVotes);
						console.log(attendees.size)
						console.log(index)
						if (index == attendees.size){
							console.log('here3')
							var votesHereSorted = '';
							var maxVotes = 0;
							for (gameVotes of hereVotes){
								if (gameVotes[1] > maxVotes) maxVotes = gameVotes[1];
							}
							for (let i = maxVotes; i > 0; i--) {
								for (gameVotes of hereVotes){
									if (gameVotes[1] == i){
										votesHereSorted += gameVotes[0] + ': ' + gameVotes[1] + '\n';
										if (i == maxVotes) winningGames.push(gameVotes[0]);
									}
								}
							}
							targetChannel.send('Time\'s up! Here are the tallied votes for games suitable for the number of attendees today: \n' + votesHereSorted);

							if (winningGames.length > 1){
								winner = Math.floor(Math.random() * winningGames.length);
								targetChannel.send('With multiple games tied for first, I randomly select '+ winningGames[winner] + ' as the winner for this week.');
							}
							else targetChannel.send(winningGames[0] + ' wins!');
						}
					})
				})
			})
		})
	})
}


function votePrompt() {
	console.log("vote prompt");
	const targetChannel = client.channels.cache.get(process.env.CHANNEL_ID);
	const gameChannel = client.channels.cache.get(process.env.GAMELIST_ID);
	var gameList = '';
	
	gameChannel.messages.fetch().then(games => {
		if (games.size){
			games.forEach(game => {
				gameList = gameList + game.content.substring(0, game.content.indexOf('@')) + '\n';
			})
		}
		else {
			gameList = 'There are currently no games on the game list, so make sure to add some and then vote!'
		}
		targetChannel.send('Make sure to update your votes with \/vote this week! Otherwise, I\'ll use your existing votes. The games currently up for vote are:\n' + gameList);
	})
}