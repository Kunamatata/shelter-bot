const blizzard = require('blizzard.js').initialize({
  key: process.env.BLIZZARD_CLIENT_ID,
  secret: process.env.BLIZZARD_CLIENT_SECRET,
})



function refreshToken() {
  blizzard.getApplicationToken().then(response => {
    let { access_token, expires_in } = response.data;
    blizzard.defaults.token = access_token;
    blizzard.defaults.expiresIn = expires_in;
    setTimeout(refreshToken, blizzard.defaults.expiresIn * 1000);
  })
}

refreshToken();

function getRaidProgression(raids) {
  let res = []
  for (let raid of raids) {
    let obj = {}
    obj = raid.bosses.reduce((acc, curr) => {
      acc.lfr += curr.lfrKills ? 1 : 0
      acc.normal += curr.normalKills ? 1 : 0
      acc.heroic += curr.heroicKills ? 1 : 0
      acc.mythic += curr.mythicKills ? 1 : 0
      return acc
    }, { lfr: 0, normal: 0, heroic: 0, mythic: 0 })
    obj.name = raid.name
    obj.bosses = raid.bosses.length
    res.push(obj)
  }
  return res
}

const factions = {
  '0': {
    'name': 'Alliance',
    'icon': 'a'
  },
  '1': {
    'name': 'Horde',
    'icon': 'h'
  }
}

const regions = ['us', 'eu', 'sea', 'kr', 'tw', 'cn'];

const races = {
  "1":"Human",
  "2":"Orc",
  "3":"Dwarf",
  "4":"Night Elf",
  "5":"Undead",
  "6":"Tauren",
  "7":"Gnome",
  "8":"Troll",
  "9":"Goblin",
  "10":"Blood Elf",
  "11":"Draenei",
  "22":"Worgen",
  "24":"Pandaren",
  "25":"Pandaren",
  "26":"Pandaren",
  "27":"Nightborne",
  "28":"Highmountain Tauren",
  "29":"Void Elf",
  "30":"Lightforged Draenei",
  "34":"Dark Iron Dwarf",
  "36":"Mag'har Orc",
}

const classes = {
  '1': 'Warrior',
  '2': 'Paladin',
  '3': 'Hunter',
  '4': 'Rogue',
  '5': 'Priest',
  '6': 'Death Knight',
  '7': 'Shaman',
  '8': 'Mage',
  '9': 'Warlock',
  '10': 'Monk',
  '11': 'Druid',
  '12': 'Demon Hunter'
}


module.exports = {
  getCharacterInformation: function(region, realm, character) {
    return new Promise((resolve, reject) => {
      if (regions.indexOf(region) === -1)
        reject(`That region doesn't exist...\nAvailable regions are : ${regions.join(', ')}`)
      blizzard.wow.character(['profile', 'items', 'guild', 'progression'], {
          origin: region,
          realm: realm,
          name: character
        })
        .then(response => {
          let data = response.data
          let raids = data.progression.raids.slice(-3)
          let message = `${data.name} - ${data.realm} - ${races[data.race]} ${classes[data.class]} - ${data.level} \nAverage Item Level : ${data.items.averageItemLevel} - Average Item Level Equipped : ${data.items.averageItemLevelEquipped}`

          if (data.guild) {
            message += `\n\nGuild : ${data.guild.name} - ${data.guild.realm} - Members : ${data.guild.members}`
          }

          let raidProgressions = getRaidProgression(raids)
          for (let raidProgress of raidProgressions) {
            message += `\n\n**${raidProgress.name}** - LFR : ${raidProgress.lfr}/${raidProgress.bosses} - Normal : ${raidProgress.normal}/${raidProgress.bosses} - Heroic ${raidProgress.heroic}/${raidProgress.bosses} - Mythic ${raidProgress.mythic}/${raidProgress.bosses}`
          }

          resolve({
            message: message,
            thumbnail: `https://render-${region}.WORLDOFWARCRAFT.com/character/${data.thumbnail}`
          })
        })
        .catch(err => {
          if (err.response.data.status === "nok") {
            reject(err.response.data.reason)
          } else {
            reject("This service is currently unavailable...")
          }
        })
    })
  }
}