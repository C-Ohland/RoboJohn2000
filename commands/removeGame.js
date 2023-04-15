const { SlashCommandBuilder } = require('discord.js');
const { ActionRowBuilder, Events, StringSelectMenuBuilder } = require('discord.js');
require('dotenv').config();


module.exports = {
	// Take in game name and max players
	data: new SlashCommandBuilder()
		.setName('removegame')
		.setDescription('Removes a game from the gamelist'),
				
	async execute(interaction) {
		const client = interaction.client;
		const gameName = interaction.options.getString('name');
		var gameExists = false;
		
		const gameChannel = client.channels.cache.get(process.env.GAMELIST_ID);
		gameChannel.messages.fetch({ limit: 100 }).then(games => {
			console.log('Received ' + games.size + ' games');
			//Iterate through the messages here with the variable "messages".
			
			const menuOptions = new StringSelectMenuBuilder()
				.setPlaceholder('Nothing selected')
				.setMinValues(1)
				.setMaxValues(1)
				.setCustomId('Remove Game')
				
				if (games.size){
					games.forEach(game => {
						menuOptions.addOptions({label: game.content.substring(0, game.content.indexOf('@')), description: ' ', value: game.content.substring(0, game.content.indexOf('@'))});
					})	
					const selectMenu = new ActionRowBuilder().addComponents(menuOptions);
					
					interaction.reply({ content: 'Please select the game you want to remove:', ephemeral: true, components: [selectMenu] });
				}
				else interaction.reply('There are currently no games on the gamelist.');	
		})
	},
};