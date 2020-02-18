//This file needs to be cleaned up to avoid the repeat formatting within the canvas.
const fetch = require('node-fetch');
const Canvas = require('canvas');
const Discord = require('discord.js');

const { trackerToken } = require('../config.js'); //Token for Tracker Network API

const trackerUrl = 'https://public-api.tracker.gg/v2/apex/standard/profile/';

const FONT_PATH = './fonts/LeagueGothic-Regular.otf';
const FONT_FAMILY = 'League Gothic';
const LARGE_FONT = '36px';
const SMALL_FONT = '16px';

const BANNER_PATH = './images/level-bg.png';
const CANVAS_WIDTH = 700;
const CANVAS_HEIGHT = 605;
const LEFT_PANEL_WIDTH = 325;
// const RIGHT_PANEL_WIDTH = CANVAS_WIDTH - LEFT_PANEL_WIDTH;
const LEFT_PANEL_COLOR = '#272727';
const RIGHT_PANEL_COLOR = '#db2b29';
const TEXT_COLOR = '#ffffff';

const DISCORD_IMAGE_NAME = 'stats-image.png';

module.exports = {
  name: 'stats',
  description: 'Retrieve stats based on the user. Optional: Use mention for another user.',
  args: false,
  usage: 'Optional: <username>',
  async execute(message, args, Users) {
    const { author } = message; // Get the message author's ID
    const taggedUser = !message.mentions.users.size ? author : message.mentions.users.first(); //Default to the message author ID if there are no mentions
    const headers = { 'Content-Type': 'application/json', 'TRN-Api-Key': trackerToken };

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

    const canvas = Canvas.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT); //Setup the canvas for the banner image
    const ctx = canvas.getContext('2d');
    Canvas.registerFont(FONT_PATH, { family: FONT_FAMILY }); //Register the font to be used for the banner

    //Left Panel Background
    ctx.fillStyle = LEFT_PANEL_COLOR;
    ctx.fillRect(0, 0, LEFT_PANEL_WIDTH, canvas.height);

    //Right Panel Background
    ctx.fillStyle = RIGHT_PANEL_COLOR;
    ctx.fillRect(LEFT_PANEL_WIDTH, 0, canvas.width, canvas.height);

    //Get the legend image from the URL and draw it to the left panel
    const legend = await Canvas.loadImage(legendBanner);
    ctx.drawImage(legend, -78, 0, 480, canvas.height);

    //Level Badge / Name banner placement
    const levelbg = await Canvas.loadImage(BANNER_PATH);
    ctx.drawImage(levelbg, 325, 15, 375, 96);

    //Text placement
    ctx.fillStyle = TEXT_COLOR;
    ctx.font = `${LARGE_FONT} "${FONT_FAMILY}"`;

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

    ctx.font = `${SMALL_FONT} "${FONT_FAMILY}"`;
    ctx.fillText('LEVEL', 403, 45); //Display "LEVEL" label for badge

    const attachment = new Discord.Attachment(canvas.toBuffer(), DISCORD_IMAGE_NAME);
    return message.reply(attachment);
  }
};
