const https = require('https')
const rp = require('request-promise')

const regions = ['eu', 'us', 'kr', 'cn', 'global']
const platforms = ['pc', 'xbl', 'psn']

module.exports = {
  getOverwatchProfile: function (platform, region, name, battletag) {
    return new Promise((resolve, reject) => {
      const query = `https://api.lootbox.eu/${platform}/${region}/${name}-${battletag}/profile`
      rp(query).then((res) => {
        let response = JSON.parse(res)

        if (response.statusCode === 404) {
          reject(response)
          return
        }

        let data = response.data
        let compWinRatio = (data.games.competitive.wins / data.games.competitive.played) * 100
        let message = `${data.username} - ${data.level} \n`

        message += `Quick Play : ${data.playtime.quick} - Competitive : ${data.playtime.competitive} \n`
        message += `Competitive Rank : ${data.competitive.rank} - Ratio : ${compWinRatio.toFixed(2)}%`

        resolve({message: message})
      }).catch((err) => {
        let message = `Something went wrong ! :cry: - use !help`
        console.log(err)
        if (regions.indexOf(region) === -1)
          message += `\nThe available regions are : ${regions.join(', ')}`
        else if (platforms.indexOf(platform) === -1) {
          message += `\nThe available platforms are : ${platforms.join(', ')}`
        }

        reject({error: message})
      })
    })
  }
}