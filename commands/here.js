const { SlashCommandBuilder } = require('discord.js');
require('dotenv').config();


module.exports = {
	data: new SlashCommandBuilder()
		.setName('here')
		.setDescription('Logs attendance for this Friday'),
				
	async execute(interaction) {
		const client = interaction.client;
		const votesChannel = client.channels.cache.get(process.env.VOTES_ID);
		const attendanceChannel = client.channels.cache.get(process.env.ATTENDANCE_ID);
		var alreadyHere = false;
		
		const voted = await votesChannel.threads.cache.find(x => x.name === interaction.user.username);
		if (!voted) interaction.reply({content : 'You can\'t log your attendance until you have recorded votes.', ephemeral : true});
		else {
			attendanceChannel.messages.fetch({ limit: 100 }).then(attendees => {
				console.log('Received ' + attendees.size + ' attendees');
				//Iterate through the messages here with the variable "messages".
				
				attendees.forEach(attendee => {
					if (attendee.content == interaction.user.username)
						alreadyHere = true;
					})
				
				if (!alreadyHere) attendanceChannel.send(interaction.user.username);
				
				interaction.reply({content : interaction.user.username + ' will be here this Friday.', ephemeral : false});
			})
		}
	},
};