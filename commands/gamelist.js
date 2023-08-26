const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs')
const path = require('node:path')


module.exports = {
	// Take in game name and max players
	data: new SlashCommandBuilder()
		.setName('gamelist')
		.setDescription('Lists all games in the game list.'),
				
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