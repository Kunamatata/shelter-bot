const Discord = require('discord.js')
const rp = require('request-promise')
const querystring = require('querystring')
const wow = require('./modules/wow')
const ow = require('./modules/ow')

// for HEROKU since env variables are added through their dashboard
if (process.env.NODE_ENV !== 'production') require('dotenv').config()

// create an instance of a Discord Client, and call it bot
const bot = new Discord.Client()

// the token of your bot - https://discordapp.com/developers/applications/me
const token = process.env.BOT_TOKEN

/**
 * A list of all the commands the bot can respond to
 */
let commands = require('./commands');

/**
 * Checks the messages in the discord chat and scans for commands
 * if it find a command in the message the command is executed
 * @params {string} the message to scan for commands
 */
function checkMessageForCommand(msg) {
  let cmdTxt = msg.content.split(/\W+/)[1]
  let cmd = commands[cmdTxt]
  let tags = msg.content.split(' ')

  // We dont't want the bot to answer to itself 
  if (msg.author.id !== bot.user.id) {
    if (cmd) {
      cmd.method(bot, msg, tags.slice(1))
    }
  }
}

bot.on('ready', () => {
  console.log('ready')
  console.log(`Conntected as ${bot.user.username}#${bot.user.discriminator}`)
  bot.guilds.forEach((guild) => {
    console.log(guild.name);
  })
})

bot.on('guildCreate', guild => {
    console.log(`Server name: ${guild.name}\nTotal members: ${guild.memberCount}`);
})

/**
 * When the bot receives the message event 
 * it checks for commands in the message
 */
bot.on('message', message => {
  checkMessageForCommand(message)
})

bot.on('presenceUpdate', function(oldUser, newUser) {
  if (newUser.game != null)
    console.log(newUser.username + ' started playing: ' + newUser.game.name)
})

// Ctrl-c on the command line
process.on('SIGINT', function() {
  bot.destroy()
  process.exit()
})

// log our bot in
bot.login(token)