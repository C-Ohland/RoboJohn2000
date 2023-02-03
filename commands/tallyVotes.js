const { SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('tallyvotes')
		.setDescription('Check the current status of the vote for this week'),
	
	async execute(interaction) {
		const client = interaction.client;
		const votesChannel = client.channels.cache.get(process.env.VOTES_ID);
		const attendanceChannel = client.channels.cache.get(process.env.ATTENDANCE_ID);
		const gameChannel = client.channels.cache.get(process.env.GAMELIST_ID);
		var hereVotes = [];
		var totalVotes = [];
		var attendeesHere = false;
		
		
		
		gameChannel.messages.fetch().then(games => {
			console.log('Received ' + games.size + ' games');
			//Iterate through the messages here with the variable "messages".
			games.forEach(game => {
							const name = game.content.substring(0, game.content.indexOf('@'));
							hereVotes.push([name, 0]);
							totalVotes.push([name, 0]);
						})
			
			const voteThreads = votesChannel.threads.cache
			const voterNum = voteThreads.size;
			var i = 1;
			attendanceChannel.messages.fetch().then(attendees => {
				voteThreads.forEach(voter => {
					voter.messages.fetch().then(votes => {
							
						votes.forEach(vote => {
							for (gameVotes of totalVotes) if (gameVotes[0] == vote.content) gameVotes[1] += 1;
						})
						
						votes.forEach(vote => {
							attendees.forEach(attendee =>{
								if (vote.channel.name == attendee.content) for (hereGameVotes of hereVotes) if (hereGameVotes[0] == vote.content) hereGameVotes[1] +=1;
							})
						})
						
						if (i == voterNum){
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
									}
								}
							}
							
							var votesTotalSorted = '';
							var maxVotes = 0;
							for (gameVotes of totalVotes){
								if (gameVotes[1] > maxVotes)
									maxVotes = gameVotes[1];
							}
							for (let i = maxVotes; i > 0; i--) {
								for (gameVotes of totalVotes){
									if (gameVotes[1] == i){
										votesTotalSorted += gameVotes[0] + ': ' + gameVotes[1] + '\n';
									}
								}
							}
							
							if (attendees.size) {
								interaction.reply('The overall votes are:\n' + votesTotalSorted + '\nThe votes for this week\'s currently logged attendees are:\n' + votesHereSorted);
							}
							else interaction.reply('Nobody has been marked here for this week, but the stored votes are:\n' + votesTotalSorted)
						}
						i += 1;
					})
				})
			})
		})		
	}
};