const { SlashCommandBuilder } = require('discord.js');
require('dotenv').config();


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
		const client = interaction.client;
		const gameName = interaction.options.getString('name');
		var gameExists = false;
		
		const gameChannel = client.channels.cache.get(process.env.GAMELIST_ID);
		gameChannel.messages.fetch({ limit: 100 }).then(games => {
			console.log('Received ' + games.size + ' games');
			//Iterate through the messages here with the variable "messages".
			
			games.forEach(game => {
				if (game.content.substring(0, game.content.indexOf('@')).toLowerCase().replace(/ /g,'') == gameName.toLowerCase().replace(/ /g,'')){
					gameExists = true;
					game.delete(1000);
				}
			})
			if(gameExists){
				interaction.reply(gameName + ' has been removed from the game list.');
			}
			else{
				interaction.reply(gameName + ' is not on the game list.');
			}
		})
	},
};