const { SlashCommandBuilder } = require('discord.js');
const { ActionRowBuilder, Events, StringSelectMenuBuilder } = require('discord.js');
require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('endquickvote')
		.setDescription('Provides a menu for voting on activities'),
	
	async execute(interaction) {
		guild_id = await interaction.guildId
		if (!fs.existsSync(path.join(__dirname,'../server_data/'+guild_id))){
			fs.mkdirSync(path.join(__dirname,'../server_data/'+guild_id))
			fs.mkdirSync(path.join(__dirname,'../server_data/'+guild_id+'/gamelist'))
			fs.mkdirSync(path.join(__dirname,'../server_data/'+guild_id+'/attendance'))
			fs.mkdirSync(path.join(__dirname,'../server_data/'+guild_id+'/votes'))
			fs.mkdirSync(path.join(__dirname,'../server_data/'+guild_id+'/quickvotes'))

		}
		const gamesPath = path.join(__dirname, '../server_data/'+guild_id+'/gamelist')
		const quickVotesPath = path.join(__dirname, '../server_data/'+guild_id+'/quickvotes')
		const gameFiles = fs.readdirSync(gamesPath).filter(file => file.endsWith('.json'))
		const quickVoteFiles = fs.readdirSync(quickVotesPath.filter(file => file.endsWith('.json')))

		var totalVotes = [];
		
		for (game of gameFiles){
			const { name, maxPlayers } = require(gamesPath + '/' + game);
			if (maxPlayers >= quickVoteFiles.length){
				totalVotes.push([name, 0])
			}
		}

		for (voter of quickVoteFiles)
		{
			console.log(voter);

			const { votes } = require(quickVotesPath + '/' + voter);
			console.log(votes);

			for (voteTotal of totalVotes){
				for (vote of votes){
					if (voteTotal[0] == vote)
						voteTotal[1] += 1;
				}
			}

			console.log(hereVotes);
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

		interaction.reply('Quick vote ended! Total votes for games valid for this number of players are:\n' + votesTotalSorted);	
	}
};
