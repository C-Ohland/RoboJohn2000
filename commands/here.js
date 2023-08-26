const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs')
const path = require('node:path')


module.exports = {
	data: new SlashCommandBuilder()
		.setName('here')
		.setDescription('Logs attendance for this Friday'),
				
	async execute(interaction) {
		guild_id = await interaction.guildId
		if (!fs.existsSync(path.join(__dirname,'../server_data/'+guild_id))){
			fs.mkdirSync(path.join(__dirname,'../server_data/'+guild_id))
			fs.mkdirSync(path.join(__dirname,'../server_data/'+guild_id+'/gamelist'))
			fs.mkdirSync(path.join(__dirname,'../server_data/'+guild_id+'/attendance'))
			fs.mkdirSync(path.join(__dirname,'../server_data/'+guild_id+'/votes'))
			fs.mkdirSync(path.join(__dirname,'../server_data/'+guild_id+'/quickvotes'))

		}
		const attendancePath = path.join(__dirname, '../server_data/'+guild_id+'/attendance')
		const votesPath = path.join(__dirname, '../server_data/'+guild_id+'/votes')

		const votes = fs.readdirSync(votesPath).filter(file => file.endsWith('.json'))
		const username = interaction.user.username
		var voted = false
		for (vote of votes){
			if (username + '.json' == vote){
				voted = true;
			}
		}	

		const attendanceFiles = fs.readdirSync(attendancePath).filter(file => file.endsWith('.json'))
		var here = false
		{
			for (attendant of attendanceFiles){
				if (username + '.json' == vote){
					here = true
				}
			}
		}

		if (!voted)
			interaction.reply({content : 'You can\'t log your attendance until you have recorded votes.', ephemeral : true});
		else if (here)
			interaction.reply({content : 'You were already marked here.', ephemeral : true})
		else
		{
			fs.writeFile(attendancePath + '/' + username + '.json' , JSON.stringify({"here" : true}), (err) => {
				if (err){
					console.log(err);
					interaction.reply({content : 'Error logging attendance.', ephemeral : true});
				}
				else {
					console.log("File written successfully!\n")
					interaction.reply({content : interaction.user.username + ' will be here this Friday.', ephemeral : false})
				}
			})
		}
	},
};