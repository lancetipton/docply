const { camelCase, snakeCase } = require('@keg-hub/jsutils')

const convertToJson = data => {
  return data.split('\n').reduce((items, item) => {
    if (!item.trim()) return items

    try {
      const parsed = JSON.parse(item.replace(/\\"/g, ''))
      const built = {}
      Object.keys(parsed).map(
        key => (built[camelCase(snakeCase(key))] = parsed[key])
      )

      items.push(built)

      return items
    }
    catch (err) {
      return items
    }
  }, [])
}

module.exports = {
  convertToJson,
}
