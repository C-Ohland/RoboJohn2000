const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('node:path');
const gamesPath = path.join(__dirname, '../gamelist');


module.exports = {
	// Take in game name and max players
	data: new SlashCommandBuilder()
		.setName('registergame')
		.setDescription('Registers a new game to the voting list')
		.addStringOption(option =>
			option.setName('name')
				.setDescription('The name of the game')
				.setRequired(true))
		.addIntegerOption(option =>
			option.setName('maxplayers')
				.setDescription('The maximum number of players the game can accomodate')
				.setMinValue(4)
				.setRequired(true)),
				
	async execute(interaction) {
		const gameName = interaction.options.getString('name');
		const maxPlayers = interaction.options.getInteger('maxplayers');
		const gameFiles = fs.readdirSync(gamesPath).filter(file => file.endsWith('.json'));
		var alreadyRegistered = false;
		
		for (const file of gameFiles) {
			if(file.toLowerCase().replace(/ /g,'') == gameName.toLowerCase().replace(/ /g,'')+'.json')
			{
				alreadyRegistered = true;
			}
			
		}
		
		if(alreadyRegistered){
			await interaction.reply(gameName + ' is already registered.');
		}
		
		else{
			const gameJSON = {"name" : gameName,
			"maxPlayers" : maxPlayers};
			fs.writeFile(gamesPath + '/' + gameName.toLowerCase().replace(/ /g,'') + '.json' , JSON.stringify(gameJSON), (err) => {
			if (err){
				console.log(err);
				interaction.reply('Error adding the game to the list.');
			}
			else {
				console.log("File written successfully!\n")
				interaction.reply(gameName +  ' has been registered to the game list!');
			}});
			

		}

	},
};