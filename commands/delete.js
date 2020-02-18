module.exports = {
  name:"delete",
  description: "Removes the user from the database, and unlinks their Discord username",
  args: false,
  usage: '',
  async execute(message,args,Users){
    const { author: { id } } = message;
    
    const affectedRows = await Users.destroy({where:{discord:id}})
    if(!affectedRows) return message.reply("No record of user.")

    return message.reply(`${message.author} has been removed.`)    
  }
}