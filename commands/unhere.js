const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const attendancePath = path.join(__dirname, '../attendance');


module.exports = {
	// Take in game name and max players
	data: new SlashCommandBuilder()
		.setName('unhere')
		.setDescription('Removes user from the attendance log for this week'),
				
	async execute(interaction) {
		
		const attendees = fs.readdirSync(attendancePath).filter(file => file.endsWith('.json'));
		const username = interaction.user.username;
		
		for (attendee of attendees){
			if (username + '.json' == attendee)
				here = true;
		}	
		
		if (!here)
			interaction.reply({content : 'You already weren\'t marked as here!', ephemeral : true});
		else
		{
			fs.unlink(attendancePath + '/' + username + '.json', (err) => {
			if (err){
				console.log(err);
				interaction.reply({content : 'Error removing attendance log.', ephemeral : true});
			}
			else {
				console.log("File written successfully!\n")
				interaction.reply({content : 'You have been removed from the attendance list.', ephemeral : true});
			}});
		}
		

	},
};