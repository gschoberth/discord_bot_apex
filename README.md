# Discord Bot - Apex Legends Tracker
## Features
Apex Legends Tracker is a Discord channel bot designed to retrieve and display
formatted user stats from the game, Apex Legends.


![20200217205811](https://user-images.githubusercontent.com/551402/74705392-8f6fcf80-51c8-11ea-9dec-2d21557a7175.png)
*Example Tracker Banner*


## Discord Commands
The following are all commands currently available for the bot. Note that the default command prefix is "!!". This can be customized via environment variables at runtime.

|Commands|Arguments| Description  |
|:----|:----|:---|
|`help`|None|Sends a direct message to the user, listing out all available bot commands.|
|`link`|`[platform] [username]`|Pairs a discord user's id with a platform [PC, XBOX, PS4] and platform username.|
|`relink`|`[platform] [username]`|Edit an existing user's platform [PC, XBOX, PS4] and platform username"|
|`delete`|None|Removes the user from the database, and unpairs their Discord username  |
|`stats`|Optional:`[Discord username]`|Retrieve stats based on the user. Optional: Use mention for another user. ***Note:*** Stats will only be retrieved based on the last active legend on the user's banner.|
|`pickmydrop`|None|Let the bot pick where you will drop. ***Note:*** Currently setup for the World's Edge map|
|`r99`  |None|Selects a random quote about the R-99 |
|`havoc`|None|Selects a random quote about the Havoc Rifle|
|`dibs`|None|Call items that you want|
|`ping`|None|Very important mechanic in Apex Legends|
|`args-info`|`[command]`|Information about the arguments required for command|
|`cat`|None| No bot is complete without a command to retrieve cat pictures|

## API Links
**Discord Developer Portal** - *Requires Discord Login*
Token: [discordapp.com/developers/applications](https://discordapp.com/developers/applications/)

**Tracker Network** - *Requires Tracker Network Login*
API: [https://tracker.gg/developers/docs/titles/apex](https://tracker.gg/developers/docs/titles/apex)
Token: [tracker.gg/developers/apps](https://tracker.gg/developers/apps)

## Caveats
There are a number of limitations using the third-party API to retrieve game stats, these affected the features that had been originally planned. 

It should be noted that the stats retrieved are typically based on the most recently played legend within a users profile. Stats displayed are based on the current legends banner trackers, although some users may display more than the normal 3 stats displayed in Apex Legends.  At this time it is unknown what causes some users to have more displayed stats than others.

It should also be noted that the third-party API only allows for a limited 30 calls every 60 seconds. Because of this and the limitation of data retrievable we were unable to implement a number of planned features, these included:

- Alerts for stats such as player wins, kill counts, etc.

- Session summaries. This feature would have displayed to a user the stat changes that occurred during their previous play session. The triggering event would have been when the user exits the game completely.  

- Verus comparisons between users. The feature was planned to compare a specific set of stats between players. These would have been; damage, kills, wins, finishers. As these are the most common stats amongst all legends.
