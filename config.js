const config = {
  trackerToken: process.env["TRACKER_TOKEN"],
  prefix: process.env.COMMAND_PREFIX || "!!",
  token: process.env.DISCORD_TOKEN,
};

if (!config.trackerToken || !config.token) {
  console.log(config);
  console.error(
    "Usage: TRACKER_TOKEN=<token> DISCORD_TOKEN=<token> ./index.js"
  );
  process.exit(1);
}

module.exports = config;
