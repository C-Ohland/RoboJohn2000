const { SlashCommandBuilder } = require('discord.js');
require('dotenv').config();


module.exports = {
	// Take in game name and max players
	data: new SlashCommandBuilder()
		.setName('unhere')
		.setDescription('Removes user from the attendance log for this week'),
				
	async execute(interaction) {
		const client = interaction.client;
		const attendanceChannel = client.channels.cache.get(process.env.ATTENDANCE_ID);
		var here = false;
		
		attendanceChannel.messages.fetch({ limit: 100 }).then(attendees => {
			console.log('Received ' + attendees.size + ' attendees');
			//Iterate through the messages here with the variable "messages".
			
			attendees.forEach(attendee => {
				if (attendee.content == interaction.user.username) {
					here = true;
					attendee.delete();
				}
			})
			
			if (!here) interaction.reply({content : 'You already weren\'t marked as here!', ephemeral : true});
			else interaction.reply({content : interaction.user.username + 'changed their mind and won\'t be here on Friday.', ephemeral : false});
		})
	},
};