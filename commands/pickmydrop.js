module.exports = {
  name: 'pickmydrop',
  description: 'Where should you drop?',
  execute(message, args) {
    const replies = [
      "Skyhook! It's probably far from the circle!",
      'Survey Camp! Gun racks!',
      'Refinery!',
      'The Epicenter!',
      'Overlook!',
      'Drill Site!',
      'Lava Fissure!',
      'The Train Yard! Get that vault key!',
      'Boat! Start the party, party animal!',
      'Fragment West!',
      "Fragment East! RIP Max's favorite landing spot.",
      "Harvester, world's biggest care package!",
      'Guy sir!',
      'Thermal Station!',
      'Tree!',
      'Sorting Factory!',
      'Java City!',
      'Dome! Watch out for the lava',
      "Hell I don't know, I'm not jump master!",
      'Get wrecked on the train!'
    ];
    message.channel.send(replies[Math.floor(Math.random() * replies.length)]);
  }
};
