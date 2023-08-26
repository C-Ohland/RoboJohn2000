const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs')
const path = require('node:path')


module.exports = {
	// Take in game name and max players
	data: new SlashCommandBuilder()
		.setName('gamelist')
		.setDescription('Lists all games in the game list.'),
				
	async execute(interaction) {
		if (!fs.existsSync('../server_data/'+interaction.guild_id)){
			fs.mkdir('../server_data/'+interaction.guild_id)
			fs.mkdir('../server_data/'+interaction.guild_id+'/gamelist')
			fs.mkdir('../server_data/'+interaction.guild_id+'/attendance')
			fs.mkdir('../server_data/'+interaction.guild_id+'/votes')
			fs.mkdir('../server_data/'+interaction.guild_id+'/quickvotes')
		}
		
		const gamesPath = path.join(__dirname, '../server_data/'+interaction.guild_id+'/gamelist')

		const gameFiles = fs.readdirSync(gamesPath).filter(file => file.endsWith('.json'))
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