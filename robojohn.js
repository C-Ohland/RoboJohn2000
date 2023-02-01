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
	client.user.setActivity('Arma 2');
	votesChannel = client.channels.cache.get(process.env.VOTES_ID);
	attendanceChannel = client.channels.cache.get(process.env.ATTENDANCE_ID);
	gameChannel = client.channels.cache.get(process.env.GAMELIST_ID);
},2000);


// Timed voting closeout warning
var voteWarning = cron.schedule('58 18 * * Fridays', () => {
	console.log("vote warning");
	const targetChannel = client.channels.cache.get(process.env.CHANNEL_ID);
	targetChannel.send('Concluding vote based on current attendees in 20 minutes! Make sure to get in any last-minute votes and use \/here to log your attendance for this weeks so your votes are counted.');
	
}, {
	scheduled : true,
	timezone: "America/Chicago"
});

// Timed prompt to vote
var votePrompt = cron.schedule('0 8 * * Mondays', () => {
	console.log("vote prompt");
	const targetChannel = client.channels.cache.get(process.env.CHANNEL_ID);
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
}, {
	scheduled : true,
	timezone: "America/Chicago"
});

//Timed vote closeout
//var votePrompt = cron.schedule('18 19 * * Fridays', () => {
setTimeout(() => {
	console.log("vote closeout");
	const targetChannel = client.channels.cache.get(process.env.CHANNEL_ID);
	var hereVotes = [];
	var winningGames = [];
	gameChannel.messages.fetch().then(games => {
		console.log('Received ' + games.size + ' games');
		//Iterate through the messages here with the variable "messages".
		
		const voteThreads = votesChannel.threads.cache
		var index = 1;
		attendanceChannel.messages.fetch().then(attendees => {
			games.forEach(game => {
				const name = game.content.substring(0, game.content.indexOf('@'));
				if (game.content.substring(game.content.indexOf('@')+1, game.content.length) > attendees.size) hereVotes.push([name, 0]);
			})
			voteThreads.forEach(voter => {
				attendees.forEach(attendee => {
					if (attendee.content == voter.name) voter.messages.fetch().then(votes => {
						votes.forEach(vote => {
								for (hereGameVotes of hereVotes) if (hereGameVotes[0] == vote.content) hereGameVotes[1] +=1;
						})
						
						if (index == attendees.size){
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
					index += 1;
				})
			})
		})
	})
	

}, 4000)
	// }, {
	// scheduled : true,
	// timezone: "America/Chicago"
// });

// RoboJohn goes to sleep
var votePrompt = cron.schedule('0 21 * * *', () => {
	console.log("going to sleep");
	
	client.user.setStatus('dnd');
	client.user.setActivity('Recharging');
	
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