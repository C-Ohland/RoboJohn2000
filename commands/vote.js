const { SlashCommandBuilder } = require('discord.js');
const { ActionRowBuilder, Events, StringSelectMenuBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('vote')
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
		const gameFiles = fs.readdirSync(gamesPath).filter(file => file.endsWith('.json'))
		const menuOptions = new StringSelectMenuBuilder()
			.setCustomId('voteSelect')
			.setPlaceholder('Nothing selected')
			.setMinValues(1)
			.setMaxValues(gameFiles.length)

		if (gameFiles.length > 0){
			for (const file of gameFiles) {
				const { name } = require(gamesPath + '/' + file);
				menuOptions.addOptions({label: name, description: name, value: name});
			}
			const selectMenu = new ActionRowBuilder().addComponents(menuOptions);

			interaction.reply({ content: 'Please select the games you would like to play:', ephemeral: true, components: [selectMenu] });
		}
		else interaction.reply('There are currently no games on the gamelist.');
	}
};