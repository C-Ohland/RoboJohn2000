const { SlashCommandBuilder } = require('discord.js');
const { ActionRowBuilder, Events, StringSelectMenuBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const gamesPath = path.join(__dirname, '../gamelist');
const attendancePath = path.join(__dirname, '../attendance');
const votesPath = path.join(__dirname, '../votes');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('votestatus')
		.setDescription('Check the current status of the vote for this week'),
	
	async execute(interaction) {
		console.log("vote closeout");
		const attendanceFiles = fs.readdirSync(attendancePath).filter(file => file.endsWith('.json'));
		var hereVotes = [];
		const gameFiles = fs.readdirSync(gamesPath).filter(file => file.endsWith('.json'));
		
		for (game of gameFiles){
			const { name } = require(gamesPath + '/' + game);
			
			hereVotes.push([name, 0])
		}
		console.log(hereVotes);
		
		var totalVotes = hereVotes;
		
		const voteFiles = fs.readdirSync(votesPath).filter(file => file.endsWith('.json'));
		for (voter of voteFiles)
		{
			console.log(voter);

			const { votes } = require(votesPath + '/' + voter);
			console.log(votes);
			
			for (voteTotal of totalVotes){
				for (vote of votes){
					if (voteTotal[0] == vote)
						voteTotal[1] += 1;
				}
			}

			console.log(hereVotes);
		}
		
		for (attendee of attendanceFiles)
		{
			console.log(attendee);

			const { votes } = require(votesPath + '/' + attendee);
			console.log(votes);
			
			for (voteTotal of hereVotes){
				for (vote of votes){
					if (voteTotal[0] == vote)
						voteTotal[1] += 1;
				}
			}

			console.log(hereVotes);
		}
		
		var votesHereSorted = '';
		var maxVotes = 0;
		for (gameVotes of hereVotes){
			if (gameVotes[1] > maxVotes)
				maxVotes = gameVotes[1];
		}
		for (let i = maxVotes; i > 0; i--) {
			for (gameVotes of hereVotes){
				if (gameVotes[1] == i){
					votesHereSorted += gameVotes[0] + ': ' + gameVotes[1] + '\n';
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
		
		
		
		interaction.reply('The overall votes are:\n' + votesTotalSorted + '\n\nThe votes for this week\'s currently logged attendees are:' + votesHereSorted);
		
	}
};