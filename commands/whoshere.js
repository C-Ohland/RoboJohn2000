const { SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('whoshere')
		.setDescription('Check who is planning to be here this Friday.'),
	
	async execute(interaction) {
		const client = interaction.client;
		const attendanceChannel = client.channels.cache.get(process.env.ATTENDANCE_ID);
		var attendeeString = '';
		attendanceChannel.messages.fetch().then(attendees => {
			console.log('Received ' + attendees.size + ' attendees');
			//Iterate through the messages here with the variable "messages".
			
			attendees.forEach(attendee => {
				attendeeString = attendeeString + attendee.content + '\n'
				})
			
			interaction.reply('The current list of attendees for Friday is: \n' + attendeeString);
		})
	},
}