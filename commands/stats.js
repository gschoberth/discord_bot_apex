//This file needs to be cleaned up to avoid the repeat formatting within the canvas.
const fetch = require('node-fetch');
const Canvas = require('canvas');
const Discord = require('discord.js');

const { trackerToken } = require('../config.json'); //Token for Tracker Network API
const trackerUrl = 'https://public-api.tracker.gg/v2/apex/standard/profile/';

module.exports = {
	name: 'stats',
	description: 'Retrieve stats based on the user. Optional: Use mention for another user.',
	args: false,
	usage: 'Optional: <username>',
	async execute(message, args, Users) {
		const { author } = message; // Get the message author's ID
		const taggedUser = !message.mentions.users.size ? author : message.mentions.users.first(); //Default to the message author ID if there are no mentions
		const headers = { 'Content-Type': 'application/json', 'TRN-Api-Key': trackerToken };

		const fontPath = './fonts/LeagueGothic-Regular.otf';
		const fontFamily = 'League Gothic';

		const bannerPath = './images/level-bg.png';

		const canvasWidth = 700;
		const canvasHeight = 605;

		const leftPanelColor = '#272727';
		const rightPanelColor = '#db2b29';
		const textColor = '#ffffff';

		const leftPanelWidth = 325;
		const rightPanelWidth = canvasWidth - leftPanelWidth;

		const user = await Users.findOne({ where: { discord: taggedUser.id } }); //Fetch the user from DB

		if (!user) return message.reply(`Could not find user: ${taggedUser}`);

		let { platform, username } = user;
		platform = platform === 'pc' ? 'origin' : platform; //Convert the pc tag to 'origin' for the API

		const response = await fetch(`${trackerUrl}${platform}/${username}`, { method: 'GET', headers: headers })
			.then((response) => response.json())
			.then((json) => json.data)
			.catch((error) => message.reply('Something went wrong retrieving the information.'));

		if(!Array.isArray || response.segments.length === 0)
			return message.reply("An issue occurred retrieving your information.")

		const { displayValue: playerLevel } = response.segments[0].stats.level; //Only need the level from this part of the response data
		const { metadata: { name: legendName, imageUrl: legendBanner }, stats } = response.segments[1]; //Get the legend name, legend banner image url, and the stats object

		const canvas = Canvas.createCanvas(canvasWidth, canvasHeight); //Setup the canvas for the banner image
		const ctx = canvas.getContext('2d');
		Canvas.registerFont(fontPath, { family: fontFamily }); //Register the font to be used for the banner

		//Left Panel Background
		ctx.fillStyle = leftPanelColor;
		ctx.fillRect(0, 0, leftPanelWidth, canvas.height);

		//Right Panel Background
		ctx.fillStyle = rightPanelColor;
		ctx.fillRect(leftPanelWidth, 0, canvas.width, canvas.height);

		//Get the legend image from the URL and draw it to the left panel
		const legend = await Canvas.loadImage(legendBanner);
		ctx.drawImage(legend, -78, 0, 480, canvas.height);

		//Level Badge / Name banner placement
		const levelbg = await Canvas.loadImage(bannerPath);
		ctx.drawImage(levelbg, 325, 15, 375, 96);

		//Text placement
		ctx.fillStyle = textColor;
		ctx.font = '36px "League Gothic"';

		//All left aligned text
		ctx.textAlign = 'left';

		ctx.fillText(`${user.username.toUpperCase()}`, 460, 50); //Add retrieved username for display

		const userData = Object.values(stats); //Convert the stats object to an array so we can iterate through it

		if (!Array.isArray(userData) || !userData.length) {
			ctx.fillText(`:(  No Trackers Active`, 355, 180); //Display No Tracker Text
			ctx.fillRect(355, 190, 315, 2);
		} else {
			userData.map((value, index) => {
				ctx.fillText(`${value.displayName}: ${value.displayValue}`, 355, 180 + index * 60);
				ctx.fillRect(355, 190 + index * 60, 315, 2);
			});
		}

		//All centered text
		ctx.textAlign = 'center';

		ctx.fillText(`${legendName.toUpperCase()}`, 162.5, 50); //Display Legend Name
		ctx.fillText(`${playerLevel}`, 403, 80); //Display Player Level

		ctx.font = '16px "League Gothic"';
		ctx.fillText('LEVEL', 403, 45); //Display "LEVEL" label for badge

		const attachment = new Discord.Attachment(canvas.toBuffer(), 'stats-image.png');
		return message.reply(attachment);
	}
};
