const util = require("./utils");

module.exports = {
    'gif': {
      'description': 'usage: !gif **[image tags]** - get awesome gifs',
      method: function(bot, msg, params) {
        if (params.length > 0) {
          get_gif(params).then(function(body) {
            let responseObj = JSON.parse(body)
            msg.channel.send(responseObj.data.url)
          })
        } else {
          msg.channel.send(this.description)
        }
      }
    },
    'help': {
      'description': 'usage : !help - gives you the list of commands !',
      method: function(bot, msg) {
        let message = ''
        for (command in commands) {
          message += utils.boldify(command) + ' - ' + commands[command].description + '\n'
        }
        msg.channel.send(message)
      }
    },
    'whoami': {
      'description': 'usage : !whoami - did you forget who you are ?',
      method: function(bot, msg) {
        let message = `You are @${msg.author.username}`
        msg.channel.send(message)
      }
    },
    'author': {
      'description': 'usage : !author - who created me ?',
      method: function(bot, msg) {
        let prettyCode = `\`\`\`${JSON.stringify(utils.author, null, 2)}\`\`\``
        let message = `${author.name} created me ! I'm his little bot ♥\nHere's some information : 
        ${prettyCode}
        `
        msg.channel.send(message)
      }
    },
    'shelter': {
      'description': "usage : !author - I'll give you shelter :heart:",
      method: function(bot, msg) {
        let message = `:cloud_rain::cloud_rain:
        :umbrella2:`
        msg.channel.send(message)
      }
    },
    'wow': {
      'description': 'usage : !wow **[region] [realm] [character name]** - Gives you information about the character',
      method: function(bot, msg, params) {
        wow.getCharacterInformation(params[0], params[1], params[2]).then((obj) => {
          msg.channel.send(obj.message)
          msg.channel.send({ files: [obj.thumbnail] })
        }).catch(err => {
          msg.channel.send(err)
        })
      }
    },
    'ow': {
      'description': 'usage : !ow **[plateform] [region] [character name] [battletag]** - Gives you information about the character',
      method: function(bot, msg, params) {
        ow.getOverwatchProfile(params[0], params[1], params[2], params[3]).then((obj) => {
          msg.channel.send(obj.message)
        }).catch((err) => {
          msg.channel.send(err.error)
        })
      }
    }
  }