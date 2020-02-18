module.exports = {
	name: 'ping',
	description: 'Pong!',
	execute(message, args) {
		message.channel.send('Do I look like Pathfinder?!');
	}
};
