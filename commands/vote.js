const { SlashCommandBuilder } = require('discord.js');
const { ActionRowBuilder, Events, StringSelectMenuBuilder } = require('discord.js');
const fs = require('fs');
const path = require('node:path');
const gamesPath = path.join(__dirname, '..\\gamelist');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('vote')
		.setDescription('Provides a menu for voting on activities'),
	
	async execute(interaction) {
		const gameFiles = fs.readdirSync(gamesPath).filter(file => file.endsWith('.json'));

		const menuOptions = new StringSelectMenuBuilder()
			.setCustomId('voteSelect')
			.setPlaceholder('Nothing selected')
			.setMinValues(1)
			.setMaxValues(gameFiles.length)
			
		for (const file of gameFiles) {
			const { name } = require(gamesPath + '/' + file);
			menuOptions.addOptions({label: name, description: name, value: name});
		}
		
		const selectMenu = new ActionRowBuilder().addComponents(menuOptions);
			
		await interaction.reply({ content: 'Please select the games you would like to play:', ephemeral: true, components: [selectMenu] });
		
	}
};