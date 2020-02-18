module.exports = {
  name: 'dibs',
  description: 'You called it!',
  execute(message, args) {
    message.channel.send('Cancel that.');
  }
};
