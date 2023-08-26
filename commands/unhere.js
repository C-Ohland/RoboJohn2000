const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

module.exports = {
	// Take in game name and max players
	data: new SlashCommandBuilder()
		.setName('unhere')
		.setDescription('Removes user from the attendance log for this week'),
				
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
		const username = interaction.user.username
		var here = false
		{
			for (attendant of attendanceFiles){
				if (username + '.json' == vote){
					here = true
				}
			}
		}

		if (!here){
			interaction.reply({content: 'You already weren\'t marked as here!', ephemeral : true})
		}
		else {
			fs.unlink(attendancePath + '/' + username + '.json', (err) => {
				if (err){
					console.log(err);
					interaction.reply({content : 'Error removing attendance file.', ephemeral : true});
				}
				else {
					interaction.reply({ content: username + ' will no longer be here this Friday.', ephemeral : false, components: [] })
				}
			})
		}
	},
};