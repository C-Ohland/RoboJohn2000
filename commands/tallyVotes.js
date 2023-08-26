const { SlashCommandBuilder } = require('discord.js');
const { ActionRowBuilder, Events, StringSelectMenuBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('tallyvotes')
		.setDescription('Check the current status of the vote for this week'),
	
	async execute(interaction) {
		if (!fs.existsSync('../server_data/'+interaction.guild_id)){
			fs.mkdir('../server_data/'+interaction.guild_id)
			fs.mkdir('../server_data/'+interaction.guild_id+'/gamelist')
			fs.mkdir('../server_data/'+interaction.guild_id+'/attendance')
			fs.mkdir('../server_data/'+interaction.guild_id+'/votes')
			fs.mkdir('../server_data/'+interaction.guild_id+'/quickvotes')
		}
		const gamesPath = path.join(__dirname, '../server_data/'+interaction.guild_id+'/gamelist')
		const attendancePath = path.join(__dirname, '../server_data/'+interaction.guild_id+'/attendance')
		const votesPath = path.join(__dirname, '../server_data/'+interaction.guild_id+'/votes')
		const attendanceFiles = fs.readdirSync(attendancePath).filter(file => file.endsWith('.json'))
		const gameFiles = fs.readdirSync(gamesPath).filter(file => file.endsWith('.json'))
		const voteFiles = fs.readdirSync(votesPath).filter(file => file.endsWith('.json'))

		var hereVotes = [];
		var totalVotes = [];
		var attendeesHere = false;
		
		for (game of gameFiles){
			const { name } = require(gamesPath + '/' + game);

			hereVotes.push([name, 0])
		}
		for (game of gameFiles){
			const { name } = require(gamesPath + '/' + game);

			totalVotes.push([name, 0])
		}
		console.log(hereVotes);

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

		if (attendanceFiles.length > 0) {
			interaction.reply('The overall votes are:\n' + votesTotalSorted + '\nThe votes for this week\'s currently logged attendees are:\n' + votesHereSorted);
		}
		else interaction.reply('Nobody has been marked here for this week, but the stored votes are:\n' + votesTotalSorted)		
	}
};