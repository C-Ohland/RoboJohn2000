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
		else return;
	},
};
