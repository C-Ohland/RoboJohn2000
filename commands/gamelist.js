const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const gamesPath = path.join(__dirname, '../gamelist');


module.exports = {
	// Take in game name and max players
	data: new SlashCommandBuilder()
		.setName('gamelist')
		.setDescription('Lists all games in the game list.'),
				
	async execute(interaction) {
		const gameFiles = fs.readdirSync(gamesPath).filter(file => file.endsWith('.json'));
		var gameList = '';
			
		if (gameFiles.length){
			for (const file of gameFiles) {
				const { name } = require(gamesPath + '/' + file);
				gameList = gameList + name + '\n';
			}
			interaction.reply({content : 'The current game list is: \n' + gameList, ephemeral : true});
		}
		else {
			interaction.reply({content : 'There are currently no games on the game list.', ephemeral : true});
		}
			
	},
};