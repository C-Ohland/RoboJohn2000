const { SlashCommandBuilder } = require('discord.js');
const { ActionRowBuilder, Events, StringSelectMenuBuilder } = require('discord.js');
require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('endquickvote')
		.setDescription('Provides a menu for voting on activities'),
	
	async execute(interaction) {
		console.log("quickvote closeout");
		const targetChannel = client.channels.cache.get(process.env.CHANNEL_ID);
		const gameChannel = client.channels.cache.get(process.env.GAMELIST_ID);
		const attendanceChannel = client.channels.cache.get(process.env.ATTENDANCE_ID);
		const votesChannel = client.channels.cache.get(process.env.VOTES_ID);
		var voteTotals = [];
		var winningGames = [];
		gameChannel.messages.fetch().then(games => {
			console.log('Received ' + games.size + ' games');
			//Iterate through the messages here with the variable "messages".
			
			const voteThreads = votesChannel.threads.cache
			var index = 0;
			games.forEach(game => {
				const name = game.content.substring(0, game.content.indexOf('@'));
				if (game.content.substring(game.content.indexOf('@')+1, game.content.length) >= attendees.size) voteTotals.push([name, 0]);
				console.log(voteTotals);
			})
			voteThreads.forEach(voter => {
				voter.messages.fetch().then(votes => {
					votes.forEach(vote => {
							for (gameVote of voteTotals) if (gameVote[0] == vote.content) gameVote[1] +=1;
					})
					console.log(voteThreads.size);
					console.log(gameVote);
					console.log(index)
					index = index + 1;
					if (index == voteThreads.size){
						var votesSorted = '';
						var maxVotes = 0;
						for (gameVotes of voteTotals){
							if (gameVotes[1] > maxVotes) maxVotes = gameVotes[1];
						}
						for (let i = maxVotes; i > maxVotes-3; i--) {
							for (gameVotes of voteTotals){
								if (gameVotes[1] == i){
									votesSorted += gameVotes[0] + ': ' + gameVotes[1] + '\n';
									if (i == maxVotes) winningGames.push(gameVotes[0]);
								}
							}
						}
						
						interaction.reply('Quickvote ended! Here are the tallied votes for games suitable for the number of players: \n' + votesSorted);
						if (winningGames.length > 1){
							winner = Math.floor(Math.random() * winningGames.length);
							targetChannel.send('With multiple games tied for first, I randomly select '+ winningGames[winner] + ' as the winner for this week.');
						}
						else targetChannel.send(winningGames[0] + ' wins!');
					}
				})
			})
		})
	}
};