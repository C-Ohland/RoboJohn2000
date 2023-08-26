const { Events, GuildTextThreadManager} = require('discord.js');
require('dotenv').config()
const fs = require('node:fs');
const path = require('node:path');

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
			const client = interaction.client
			const targetChannel = client.channels.cache.get(process.env.CHANNEL_ID)
			if (interaction.customId == 'Remove Game') {
				gamesPath = path.join(__dirname, '../server_data/'+interaction.guildId+'/gamelist');
				gameName = interaction.values
				console.log(gameName)
				fs.unlink(gamesPath + '/' + gameName[0].toLowerCase().replace(/ /g,'').replace(/'/g,'').replace(/:/g,'').replace(/\//g,'') + '.json', (err) => {
					if (err){
						console.log(err);
						interaction.update('Error removing the game from the list.');
					}
					else {
						interaction.update({ content: 'Removal successful.', ephemeral : false, components: [] })
						targetChannel.send(interaction.values + ' has been removed from the game list')
					}
				})
			}
			else if (interaction.customId == 'voteSelect'){
				
				votesPath = path.join(__dirname, '../server_data/'+interaction.guildId+'/votes')
				const voteJSON = {"user" : interaction.user.username, "votes" : interaction.values}
				fs.writeFile(votesPath + '/' + interaction.user.username + '.json' , JSON.stringify(voteJSON), (err) => {
				if (err){
					console.log(err)
					interaction.reply('Error saving your votes.')
				}
				else {
					console.log("File written successfully!\n")
					interaction.update({ content: 'Your votes have been saved.', ephemeral : true, components: [] })
				}})
			}
			else if (interaction.customId == 'quickVote'){
				const quickVotePath = path.join(__dirname, '../server_data/'+interaction.guildId+'/quickvotes');
				const quickVoteJSON = {"user" : interaction.user.username, "votes" : interaction.values}
				const quickVoteFiles = fs.readdirSync(quickVotePath).filter(file => file.endsWith('.json'))
				
				targetChannel.send(interaction.user.username + ' has added quick votes! Use /quickvote to add votes for more players, or /endquickvote to tally the votes.')
				
				fs.writeFile(quickVotePath + '/' + interaction.user.username + '.json' , JSON.stringify(quickVoteJSON), (err) => {
					if (err){
						console.log(err)
						interaction.reply('Error saving your quickvotes.')
					}
					else {
						console.log("File written successfully!\n")
						interaction.update({ content: 'Your quickvotes have been saved.', ephemeral : true, components: [] })
				}})
			}
			else interaction.update({content: 'Issue identifying string select menu type, tell Carson', ephemeral : true, components: [] });
		}
		else return;
	},
};
