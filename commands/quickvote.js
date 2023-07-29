const { SlashCommandBuilder } = require('discord.js');
const { ActionRowBuilder, Events, StringSelectMenuBuilder } = require('discord.js');
require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('quickvote')
		.setDescription('Provides a menu for voting on activities'),
	
	async execute(interaction) {
		const client = interaction.client;
		const gameName = interaction.options.getString('name');
		const gameChannel = client.channels.cache.get(process.env.GAMELIST_ID);
		gameChannel.messages.fetch().then(games => {
			console.log('Received ' + games.size + ' games');
			
			const menuOptions = new StringSelectMenuBuilder()
				.setCustomId('quickVote')
				.setPlaceholder('Nothing selected')
				.setMinValues(1)
				.setMaxValues(games.size)
			
				if (games.size){
					games.forEach(game => {
						menuOptions.addOptions({label: game.content.substring(0, game.content.indexOf('@')), description: ' ', value: game.content.substring(0, game.content.indexOf('@'))});
					})	
					const selectMenu = new ActionRowBuilder().addComponents(menuOptions);
					
					interaction.reply({ content: 'Please select the games you would like to play:', ephemeral: true, components: [selectMenu] });
				}
				else interaction.reply('There are currently no games on the gamelist.');	
		})
	}
};