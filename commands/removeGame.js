const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const gamesPath = path.join(__dirname, '../gamelist');


module.exports = {
	// Take in game name and max players
	data: new SlashCommandBuilder()
		.setName('removegame')
		.setDescription('Removes a game from the gamelist')
		.addStringOption(option =>
			option.setName('name')
				.setDescription('The name of the game')
				.setRequired(true)),
				
	async execute(interaction) {
		const gameName = interaction.options.getString('name');
		const gameFiles = fs.readdirSync(gamesPath).filter(file => file.endsWith('.json'));
		var gameExists = false;
		
		for (const file of gameFiles) {
			if(file.toLowerCase().replace(/ /g,'') == gameName.toLowerCase().replace(/ /g,'')+'.json')
			{
				gameExists = true;
			}
			
		}
		
		if(gameExists){
			fs.unlink(gamesPath + '/' + gameName.toLowerCase().replace(/ /g,'') + '.json', (err) => {
			if (err){
				console.log(err);
				interaction.reply('Error removing the game from the list.');
			}
			else {
				interaction.reply(gameName + ' has been removed from the game list.');
			}});
		}
		else{
			interaction.reply(gameName + ' is not on the game list.');
		}

	},
};