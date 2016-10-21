const Discord = require('discord.js');
const request = require("request")
const rp = require("request-promise")
const querystring = require('querystring');
require('dotenv').config()
  // create an instance of a Discord Client, and call it bot
const bot = new Discord.Client();


// the token of your bot - https://discordapp.com/developers/applications/me
const token = process.env.BOT_TOKEN;

// the ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted.

let giphy_config = {
  "api_key": "dc6zaTOxFJmzC",
  "rating": "r",
  "uri": "http://api.giphy.com/v1/gifs/search?q=",
  "permission": ["NORMAL"],
};

let author = {
  name: "Maxime Caly",
  username: "Kunamatata",
  twitter: "https://twitter.com/TheKunamatata",
  github: 'https://github.com/Kunamatata',
  description: "He's a software engineer ! He enjoys portals blue or orange no distinction."
}

function get_gif(params) {
  let config = {
    params: params,
    api_key: giphy_config.api_key,
    rating: 'r',
    limit: 1
  }
  let query = `${giphy_config.uri}${querystring.stringify(config)}`
  return rp(query)
}

/**
 * Transform a string into an bold string
 * @params {string} value The string to be transformed.
 * @returns {string} The bold string.
 */
function boldify(str){
  return `**${str}**`
}

/**
 * Transform a string into an italic string
 * @params {string} value The string to be transformed.
 * @returns {string} The italic string.
 */
function italic(str){
  return `*str*`
}

/**
 * A list of all the commands the bot can respond to
 */
let commands = {
  "gif": {
    "description": "usage: !gif <image tags> - get awesome gifs",
    method: function(bot, msg, params) {
      if (params.length > 0) {
        get_gif(params).then(function(body) {
          let responseObj = JSON.parse(body)
          let url = responseObj.data[0].bitly_url
          msg.channel.sendMessage(url)
        })
      } else {
        msg.channel.sendMessage(this.description)
      }
    }
  },
  "help": {
    "description": "usage : !help - gives you the list of commands !",
    method: function(bot, msg) {
      let message = ""
      for (command in commands) {
        message += boldify(command) + " - " + commands[command].description + "\n"
      }
      msg.channel.sendMessage(message)
    }
  },
  "whoami": {
    "description" : "usage : !whoami - did you forget who you are ?",
    method: function(bot,msg){
      let message = `You are @${msg.author.username}`
      msg.channel.sendMessage(message)
    }
  },
  "author": {
    "description" : "usage : !author - who created me ?",
    method: function(bot,msg){
      let prettyCode = `\`\`\`${JSON.stringify(author, null, 2)}\`\`\``
      let message = `${author.name} created me ! I'm his little bot ♥
      Here's some information : 
      ${prettyCode}
      `
      msg.channel.sendMessage(message)
    }
  },
  "shelter": {
    "description" : "usage : !author - I'll give you shelter :heart:",
    method: function(bot,msg){
      let message = `:cloud_rain::cloud_rain:
      :umbrella2:`
      msg.channel.sendMessage(message)
    }
  }
}

/**
 * @constructor
 * Checks the messages in the discord chat to scan for commands
 * if it find a command in the message the command is executed
 * @params {string} the message to scan for commands
 */
function checkMessageForCommand(msg) {
  let cmdTxt = msg.content.split(/\W+/)[1]
  let cmd = commands[cmdTxt]
  let tags = msg.content.split(" ")

  // We dont't want the bot to answer to itself 
  if (msg.author.id != bot.user.id) {
    if (cmd) {
      cmd.method(bot, msg, tags.slice(1))
    }
  }
}

bot.on('ready', () => {
  console.log("ready")
  // console.log(bot.users.find('discriminator', '9623'))
  // let users = bot.users.filter(user => user.username === "Kunamatata")
  // console.log(users)
    // let generalChannel = bot.channels.filter(function(channel){
    //   return channel.name === 'general' && channel.guild.name === "Gaming Room"
    // })
    // console.log(generalChannel.array()[0].sendMessage("Coucou"))
});

/**
 * When the bot receives the message event 
 * it checks for commands in the message
 */
bot.on('message', message => {
  checkMessageForCommand(message)
});

bot.on("presenceUpdate", function(oldUser, newUser) {
  if (newUser.game != null)
    console.log(newUser.username + " started playing: " + newUser.game.name)
})

  // log our bot in
bot.login(token);