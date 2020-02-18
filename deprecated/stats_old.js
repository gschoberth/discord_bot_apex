//This file needs to be cleaned up to avoid the repeat formatting within the canvas.

const { trackerToken } = require('../config.js');
const fetch = require('node-fetch');

const Canvas = require('canvas');
Canvas.registerFont('./fonts/LeagueGothic-Regular.otf', { family: 'League Gothic' });

const Discord = require('discord.js');

const url = 'https://public-api.tracker.gg/v2/apex/standard/profile';
const headers = {
	'Content-Type': 'application/json',
	'TRN-Api-Key': trackerToken
};

module.exports = {
	name: 'stats',
	description: 'Retrieve stats based on the user. Optional: Use mention for another user.',
	args: false,
	usage: 'Optional: <username>',
	async execute(message, args, Users) {
		const { author } = message; // Get the message author's ID
		const taggedUser = !message.mentions.users.size ? author : message.mentions.users.first(); //Default to the message author ID if there are no mentions

		//Fetch the user from DB
		const user = await Users.findOne({ where: { discord: taggedUser.id } });

		if (user) {
			let { platform, username } = user;
			platform = platform === 'pc' ? 'origin' : platform;

			const res = await fetch(
				`https://public-api.tracker.gg/v2/apex/standard/profile/${platform}/${username}`,
				//`https://public-api.tracker.gg/v2/apex/standard/profile/${platform}/${username}/segments/legend`,
				{ method: 'GET', headers: headers }
			)
				.then((response) => response.json())
				.then((json) => {
					return json.data;
				});

			//let { metadata: { name, imageUrl }, stats } = res[0];
			const {displayValue:playerLevel} = res.segments[0].stats.level 
			const {metadata:{name,imageUrl},stats} = res.segments[1]
			const userData = Object.values(stats);

			const canvas = Canvas.createCanvas(700, 605);
			const ctx = canvas.getContext('2d');

			//Left Panel
			ctx.fillStyle = '#272727';
			ctx.fillRect(0, 0, 325, canvas.height);

			const legend = await Canvas.loadImage(imageUrl);
			ctx.drawImage(legend, -78, 0, 480, canvas.height);

			ctx.fillStyle = '#ffffff';
			ctx.font = '36px "League Gothic"';
			ctx.textAlign = 'center';
			ctx.fillText(`${name.toUpperCase()}`, 162.5, 50);

			//Right Panel

			ctx.fillStyle = '#db2b29';
			ctx.fillRect(325, 0, canvas.width, canvas.height);

			ctx.fillStyle = '#ffffff';
			ctx.textAlign = 'left';
			ctx.font = '36px "League Gothic"';
			ctx.fillText(`${message.author.username.toUpperCase()}`, 460, 50);

      if(userData.length === 0){
        ctx.fillStyle = '#ffffff';
				ctx.textAlign = 'center';
				ctx.font = '36px "League Gothic"';
        ctx.fillText(`:(  No Trackers Active`, 512.5, 180);
        ctx.fillRect(355, 190, 315, 2);
      } else{
        userData.map((value, index) => {
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'left';
          ctx.font = '36px "League Gothic"';
          ctx.fillText(`${value.displayName}: ${value.displayValue}`, 355, 180 + index * 60);
          ctx.fillRect(355, 190 + index * 60, 315, 2);
        });
      }

			const levelbg = await Canvas.loadImage('./level-bg.png');
			ctx.drawImage(levelbg, 325, 15, 375, 96);

			ctx.textAlign = "center"
			ctx.font = '16px "League Gothic"'
			ctx.fillText("LEVEL",403,45)

			ctx.font = '36px "League Gothic"'
			ctx.fillText(`${playerLevel}`, 403,80)

			const attachment = new Discord.Attachment(canvas.toBuffer(), 'stats-image.png');
			return message.channel.send(attachment);
		}

		return message.reply(`Could not find user: ${taggedUser}`);
	}
};
