const { Events, GuildTextThreadManager} = require('discord.js');


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
				const client = interaction.client
				const gamesChannel = client.channels.cache.get(process.env.GAMELIST_ID)
				gamesChannel.messages.fetch({ limit: 100 }).then(games => {
					games.forEach(game =>{
						if (game.content.substring(0, game.content.indexOf('@')) == interaction.values) {
							game.delete()
							interaction.update({ content: 'Removal successful.', ephemeral : false, components: [] });
							targetChannel.send(interaction.values + ' has been removed from the game list')
						}
					})
				})
			}
			else if (interaction.customId == 'voteSelect'){
				
				const client = interaction.client
				const votesChannel = client.channels.cache.get(process.env.VOTES_ID);
				const pastVotes = await votesChannel.threads.cache.find(x => x.name === interaction.user.username);
				if (pastVotes) pastVotes.delete();
				
				const voteThread = await votesChannel.threads.create({
					name: interaction.user.username,
					autoArchiveDuration: 10080,
					reason: 'votes submitted',
				});
				
				for (vote of interaction.values){
					voteThread.send(vote)
				}

				interaction.update({ content: 'Your votes have been saved.', ephemeral : true, components: [] });
			}
			else if (interaction.customId == 'quickVote'){
				
				const client = interaction.client
				const quickVoteChannel = client.channels.cache.get(process.env.QUICKVOTE_ID);
				const pastVotes = await votesChannel.threads.cache.find(x => x.name === interaction.user.username);
				if (pastVotes) pastVotes.delete();
				
				if votesChannel.threads.cache.size == 0 firstVote = true
				else firstVote = false
				
				const voteThread = await votesChannel.threads.create({
					name: interaction.user.username,
					autoArchiveDuration: 10080,
					reason: 'votes submitted',
				});
				
				for (vote of interaction.values){
					voteThread.send(vote)
				}
				
				if firstVote interaction.update({ content: interaction.user.username + ' has started a quick vote! Use /quickvote to add your votes, then /endquickvote to tally the votes and pick a game.', ephemeral : false, components: [] });
				else interaction.update({ content: 'Your votes have been saved.', ephemeral : true, components: [] });
			}
			else interaction.update({content: 'Issue identifying string select menu type, tell Carson', ephemeral : true, components: [] });
		}
		else return;
		
	},
};
