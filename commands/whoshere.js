const { SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('whoshere')
		.setDescription('Check who is planning to be here this Friday.'),
	
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
		const attendanceFiles = fs.readdirSync(attendancePath).filter(file => file.endsWith('.json'))
		
		if (attendanceFiles.length > 0){
			var attendeeString = '';
			for (attendee of attendanceFiles){
				attendeeString = attendeeString + attendee.split('.')[0] +'\n'
			}
			interaction.reply('The current list of attendees for Friday is: \n' + attendeeString)
		}
		else {
			interaction.reply('There are no attendees logged for Friday.')
		}
	},
}