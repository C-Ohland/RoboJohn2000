const { SlashCommandBuilder } = require('discord.js');
require('dotenv').config();


module.exports = {
	// Take in game name and max players
	data: new SlashCommandBuilder()
		.setName('gamelist')
		.setDescription('Lists all games in the game list.'),
				
	async execute(interaction) {
		// Create a new client instance
		const client = interaction.client;
		var gameList = '';
		
		const gameChannel = client.channels.cache.get(process.env.GAMELIST_ID);
		gameChannel.messages.fetch().then(games => {
			console.log('Received ' + games.size + ' games');
			//Iterate through the messages here with the variable "messages".
			
			if (games.size){
				games.forEach(game => gameList = gameList + game.content.substring(0, game.content.indexOf('@')) + '\n')
				interaction.reply({content : 'The current game list is: \n' + gameList, ephemeral : true});
			}
			else {
				interaction.reply({content : 'There are currently no games on the game list.', ephemeral : true});
			}
		})
	},
};