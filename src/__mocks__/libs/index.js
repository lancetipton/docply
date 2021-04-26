const docker = require('./docker')
const tar = require('./tar')
module.exports = {
  tar,
  docker,
  ...tar,
  ...docker,
}