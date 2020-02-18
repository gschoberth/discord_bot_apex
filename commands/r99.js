module.exports = {
	name: 'r99',
	description: 'The absolute best SMG',
	execute(message, args) {
		const replies = [ 'Splits lead, carry extra ammo.', "She's fast like me!", "Greg's favorite SMG.", 'DIBS!' ];
		message.channel.send(replies[Math.floor(Math.random() * replies.length)]);
	}
};
