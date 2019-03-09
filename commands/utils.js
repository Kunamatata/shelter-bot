const querystring = require('querystring');
const rp = require('request-promise');

const giphy_config = {
  'api_key': 'dc6zaTOxFJmzC',
  'rating': 'r',
  'uri': 'http://api.giphy.com/v1/gifs/random?',
  'permission': ['NORMAL']
}

const author = {
  name: 'Maxime Caly',
  username: 'Kunamatata',
  twitter: 'https://twitter.com/TheKunamatata',
  github: 'https://github.com/Kunamatata',
  description: "He's a software engineer ! He enjoys portals blue or orange no distinction."
}

function get_gif(params) {
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
function boldify(str) {
  return `**${str}**`
}

/**
 * Transform a string into an italic string
 * @params {string} value The string to be transformed.
 * @returns {string} The italic string.
 */
function italic(str) {
  return `*str*`
}

module.exports = {
  giphy_config,
  author,
  get_gif,
  boldify,
  italic,
}