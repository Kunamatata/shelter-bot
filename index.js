require('dotenv').config()
const Discord = require('discord.js')
const request = require('request')
const rp = require('request-promise')
const querystring = require('querystring')
const wow = require('./modules/wow')
const ow = require('./modules/ow')

// create an instance of a Discord Client, and call it bot
const bot = new Discord.Client()

// the token of your bot - https://discordapp.com/developers/applications/me
const token = process.env.BOT_TOKEN

let giphy_config = {
  'api_key': 'dc6zaTOxFJmzC',
  'rating': 'r',
  'uri': 'http://api.giphy.com/v1/gifs/random?',
  'permission': ['NORMAL']
}

let author = {
  name: 'Maxime Caly',
  username: 'Kunamatata',
  twitter: 'https://twitter.com/TheKunamatata',
  github: 'https://github.com/Kunamatata',
  description: "He's a software engineer ! He enjoys portals blue or orange no distinction."
}

function get_gif (params) {
  let config = {
    tag: params.join(' '),
    api_key: giphy_config.api_key,
    rating: 'r'
  }
  let query = `${giphy_config.uri}${querystring.stringify(config)}`
  return rp(query)
}

/**
 * Transform a string into an bold string
 * @params {string} value The string to be transformed.
 * @returns {string} The bold string.
 */
function boldify (str) {
  return `**${str}**`
}

/**
 * Transform a string into an italic string
 * @params {string} value The string to be transformed.
 * @returns {string} The italic string.
 */
function italic (str) {
  return `*str*`
}

/**
 * A list of all the commands the bot can respond to
 */
let commands = {
  'gif': {
    'description': 'usage: !gif **[image tags]** - get awesome gifs',
    method: function (bot, msg, params) {
      if (params.length > 0) {
        get_gif(params).then(function (body) {
          let responseObj = JSON.parse(body)
          msg.channel.sendMessage(responseObj.data.url)
        })
      } else {
        msg.channel.sendMessage(this.description)
      }
    }
  },
  'help': {
    'description': 'usage : !help - gives you the list of commands !',
    method: function (bot, msg) {
      let message = ''
      for (command in commands) {
        message += boldify(command) + ' - ' + commands[command].description + '\n'
      }
      msg.channel.sendMessage(message)
    }
  },
  'whoami': {
    'description': 'usage : !whoami - did you forget who you are ?',
    method: function (bot, msg) {
      let message = `You are @${msg.author.username}`
      msg.channel.sendMessage(message)
    }
  },
  'author': {
    'description': 'usage : !author - who created me ?',
    method: function (bot, msg) {
      let prettyCode = `\`\`\`${JSON.stringify(author, null, 2)}\`\`\``
      let message = `${author.name} created me ! I'm his little bot ♥\nHere's some information : 
      ${prettyCode}
      `
      msg.channel.sendMessage(message)
    }
  },
  'shelter': {
    'description': "usage : !author - I'll give you shelter :heart:",
    method: function (bot, msg) {
      let message = `:cloud_rain::cloud_rain:
      :umbrella2:`
      msg.channel.sendMessage(message)
    }
  },
  'wow': {
    'description': 'usage : !wow **[region] [realm] [character name]** - Gives you information about the character',
    method: function (bot, msg, params) {
      wow.getCharacterInformation(params[0], params[1], params[2]).then((obj) => {
        msg.channel.sendMessage(obj.message)
        msg.channel.sendFile(obj.thumbnail)
      }).catch(err => {
        msg.channel.sendMessage(err)
      })
    }
  },
  'ow': {
    'description': 'usage : !ow **[plateform] [region] [character name] [battletag]** - Gives you information about the character',
    method: function (bot, msg, params) {
      ow.getOverwatchProfile(params[0], params[1], params[2], params[3]).then((obj) => {
        msg.channel.sendMessage(obj.message)
      }).catch((err) => {
        msg.channel.sendMessage(err.error)
      })
    }
  }
}

/**
 * Checks the messages in the discord chat and scans for commands
 * if it find a command in the message the command is executed
 * @params {string} the message to scan for commands
 */
function checkMessageForCommand (msg) {
  let cmdTxt = msg.content.split(/\W+/)[1]
  let cmd = commands[cmdTxt]
  let tags = msg.content.split(' ')

  // We dont't want the bot to answer to itself 
  if (msg.author.id != bot.user.id) {
    if (cmd) {
      cmd.method(bot, msg, tags.slice(1))
    }
  }
}

bot.on('ready', () => {
  console.log('ready')
  console.log(`Conntected as ${bot.user.username}#${bot.user.discriminator}`)
})

/**
 * When the bot receives the message event 
 * it checks for commands in the message
 */
bot.on('message', message => {
  checkMessageForCommand(message)
})

bot.on('presenceUpdate', function (oldUser, newUser) {
  if (newUser.game != null)
    console.log(newUser.username + ' started playing: ' + newUser.game.name)
})

// Ctrl-c on the command line
process.on('SIGINT', function () {
  bot.destroy()
  process.exit()
})

// log our bot in
bot.login(token)
