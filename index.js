const fs = require('fs');
const fetch = require('node-fetch');

const Discord = require('discord.js');
const Sequelize = require('sequelize');

const client = new Discord.Client();
const { prefix, token } = require('./config.json');
const cooldowns = new Discord.Collection();

//DB Stuff
const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite'
});

//Table Schema
const Users = sequelize.define('tags', {
	discord: {
		type: Sequelize.STRING,
		unique: true,
		allowNull: false
	},
	platform: {
		type: Sequelize.STRING,
		defaultValue: 'origin',
		allowNull: false
	},
	username: {
		type: Sequelize.STRING,
		allowNull: false
	}
});

// Get me all the commands in the commands folder and add them
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

//Once it's up and ready, run this code
client.once('ready', () => {
	console.log('Ready!');
	Users.sync({ force: true }); // Recreates the table everytime on startup, get rid of this on deployment
});

client.on('message', (message) => {
	const { content, channel } = message;

	if (
		!content.startsWith(prefix) ||
		message.author.bot // If it isn't a command or it came from a bot, bail out.
	)
		return;

	const args = content.slice(prefix.length).split(/ +/); //Split the prefix into its own element and on space(s)
	const commandName = args.shift().toLowerCase(); // Remove the prefix from the array and make everything else lowercase

	//If the command isn't in the collection bail out
	const command =
		client.commands.get(commandName) ||
		client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	//Check if the command requires arguements and if one was provided with the command
	if (command.args && !args.length) {
		let reply = `You didn't provide any arguements, ${message.author}!`;

		if (command.usage) reply += `\nThe proper format would be: \`${prefix}${command.name} ${command.usage}\``;

		return message.channel.send(reply);
	}

	//Channel only commands
	if (command.guildOnly && message.channel.type !== 'text') {
		return message.reply("I can't execute that command inside DMs!");
	}

	//Command cooldowns
	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(
				`Please wit ${timeLeft.toFixed(1)} more second(s) before using \`${command.name}\` command again.`
			);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		command.execute(message, args, Users);
	} catch (error) {
		console.log(error);
		message.reply('Something went wrong trying to execute command');
	}
});

client.on('presenceUpdate', (oldMember, newMember) => {});

client.login(token);
