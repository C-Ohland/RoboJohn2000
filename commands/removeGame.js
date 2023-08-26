const { SlashCommandBuilder } = require('discord.js');
const { ActionRowBuilder, Events, StringSelectMenuBuilder } = require('discord.js');
const fs = require('node:fs')
const path = require('node:path')


module.exports = {
	// Take in game name and max players
	data: new SlashCommandBuilder()
		.setName('removegame')
		.setDescription('Removes a game from the gamelist'),
				
	async execute(interaction) {
		if (!fs.existsSync('../server_data/'+interaction.guild_id)){
			fs.mkdir('../server_data/'+interaction.guild_id)
			fs.mkdir('../server_data/'+interaction.guild_id+'/gamelist')
			fs.mkdir('../server_data/'+interaction.guild_id+'/attendance')
			fs.mkdir('../server_data/'+interaction.guild_id+'/votes')
			fs.mkdir('../server_data/'+interaction.guild_id+'/quickvotes')
		}
		const gamesPath = path.join(__dirname, '../server_data'+interaction.guild_id+'/gamelist')
		const gameFiles = fs.readdirSync(gamesPath).filter(file => file.endsWith('.json'));
		
		const menuOptions = new StringSelectMenuBuilder()
			.setPlaceholder('Nothing selected')
			.setMinValues(1)
			.setMaxValues(1)
			.setCustomId('Remove Game')
			
		if (gameFile.length){
			for (const file of gameFiles){
				const { name } = require(gamesPath + '/' + file)
				menuOptions.addOptions({label: name, description: name, value: name})
			}
			const selectMenu = new ActionRowBuilder().addComponents(menuOptions);
			
			interaction.reply({ content: 'Please select the game you want to remove:', ephemeral: true, components: [selectMenu] });
		}
		else {
			interaction.reply('There are currently no games on the gamelist.');	
		}
	},
};