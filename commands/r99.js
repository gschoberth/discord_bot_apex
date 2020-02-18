const REPLIES = [
  'Splits lead, carry extra ammo.',
  "She's fast like me!",
  "Greg's favorite SMG.",
  'DIBS!'
];

module.exports = {
  name: 'r99',
  description: 'The absolute best SMG',
  execute(message, args) {
    message.channel.send(REPLIES[Math.floor(Math.random() * REPLIES.length)]);
  }
};
