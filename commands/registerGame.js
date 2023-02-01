const { SlashCommandBuilder } = require('discord.js');
require('dotenv').config();


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
		const client = interaction.client;
		const gameName = interaction.options.getString('name');
		const maxPlayers = interaction.options.getInteger('maxplayers');
		var alreadyRegistered = false;		
		const gameChannel = client.channels.cache.get(process.env.GAMELIST_ID);
		gameChannel.messages.fetch({ limit: 100 }).then(games => {
			console.log('Received ' + games.size + ' games');
			//Iterate through the messages here with the variable "messages".
			
			games.forEach(game => {
				if (game.content.toLowerCase().replace(/ /g,'') == gameName.toLowerCase().replace(/ /g,''))
					alreadyRegistered = true;
			})
			if(alreadyRegistered){
				interaction.reply(gameName + ' is already registered.');
			}
			else{
				gameChannel.send(gameName + '@' + maxPlayers);
				interaction.reply(gameName +  ' has been registered to the game list!');
			}
			
		})
	},
};