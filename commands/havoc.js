module.exports = {
	name: 'r99',
	description: 'The absolute best SMG',
	execute(message, args) {
		const replies = [ "Greg's favorite Assault Rifle.", 'DIBS!' ];
		message.channel.send(replies[Math.floor(Math.random() * replies.length)]);
	}
};
