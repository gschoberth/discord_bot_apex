const REPLIES = [
  "Greg's favorite Assault Rifle.",
  "DIBS!"
];

module.exports = {
  name: 'r99',
  description: 'The absolute best SMG',
  execute(message, args) {
    message.channel.send(REPLIES[Math.floor(Math.random() * REPLIES.length)]);
  }
};
