module.exports = {
	name: 'link',
	description: 'Remember the users platform and platform username for later retrieval',
	args: true,
	usage: '<platform> <username>',
	async execute(message, args, Users) {
		const platforms = [ 'PC', 'XBOX', 'PS4' ];
		const [ userPlatform, userID ] = args;
		const { author: { id } } = message;

		if (!platforms.includes(userPlatform.toUpperCase())) {
			return message.channel.send(
				`Selected Plaform: ${userPlatform} is not valid.\nPlease select from ${platforms
					.join(', ')
					.toUpperCase()}`
			);
		}

		if (userID.length < 6 || userID.length > 20) {
			return message.channel.send(`Selected username, ${userID} is not of valid length.`);
		}

		try {
			const user = await Users.create({
				discord: id,
				platform: userPlatform,
				username: userID
			});
			return message.channel.send(
				`\nUser ${message.author} added.\nPlatform: ${userPlatform.toUpperCase()} \nUsername: ${userID.toUpperCase()}`//Make embedded
			); 
		} catch (error) {
			if (error.name === 'SequelizeUniqueConstraintError') {
				return message.reply('You are already added');
			}

			return message.reply('Something went wrong with adding your profile.');
		}
	}
};
