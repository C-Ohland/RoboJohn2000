const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('node:path');
const attendancePath = path.join(__dirname, '../attendance');
const votesPath = path.join(__dirname, '../votes');


module.exports = {
	// Take in game name and max players
	data: new SlashCommandBuilder()
		.setName('here')
		.setDescription('Logs attendance for this Friday'),
				
	async execute(interaction) {
		
		const votes = fs.readdirSync(votesPath).filter(file => file.endsWith('.json'));
		const username = interaction.user.username;
		console.log(username);
		var voted = false;
		
		for (vote of votes){
			if (username + '.json' == vote)
				voted = true;
		}	
		
		if (!voted)
			interaction.reply({content : 'You haven\'t voted!!', ephemeral : true});
		else
		{
			fs.writeFile(attendancePath + '/' + username + '.json' , JSON.stringify({"here" : true}), (err) => {
			if (err){
				console.log(err);
				interaction.reply({content : 'Error logging attendance.', ephemeral : true});
			}
			else {
				console.log("File written successfully!\n")
				interaction.reply({content : 'Your attendance has been logged.', ephemeral : true});
			}});
		}
		

	},
};