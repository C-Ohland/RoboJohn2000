const { Events } = require('discord.js');
const fs = require('fs');
const path = require('path');
const votesPath = path.join(__dirname, '../votes');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (interaction.isChatInputCommand()){
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(`Error executing ${interaction.commandName}`);
				console.error(error);
			}
		}
		// listen for vote select menu inputs
		else if (interaction.isStringSelectMenu()) {
			const voteJSON = {"user" : interaction.user.username, "votes" : interaction.values}
			fs.writeFile(votesPath + '/' + interaction.user.username + '.json' , JSON.stringify(voteJSON), (err) => {
			if (err){
				console.log(err);
				interaction.reply('Error saving your votes.');
			}
			else {
				console.log("File written successfully!\n")
				interaction.update({ content: 'Thanks for voting!', ephemeral : true, components: [] });
			}});
		}
		else return;
	},
};
