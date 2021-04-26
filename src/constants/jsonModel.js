const {
  deepFreeze,
  isNum,
  isStr,
  isBool,
  isArr,
  isObj,
} = require('@keg-hub/jsutils')

const ofType = parent => {
  return child => ({
    ...types[parent],
    children: types[child] || child,
  })
}

const types = deepFreeze({
  string: { type: 'string', validate: isStr },
  number: { type: 'number', validate: isNum },
  boolean: { type: 'boolean', validate: isBool },
  null: { type: 'null', validate: val => val === null },
  array: { type: 'array', validate: isArr, of: ofType('array') },
  object: { type: 'object', validate: isObj, of: ofType('object') },
})

const configType = types.object.of({
  Env: types.array.of(types.string),
  Entrypoint: types.array.of(types.string),
  Cmd: types.array.of(types.string),
  Image: types.string,
  WorkingDir: types.string,
  Hostname: types.string,
  Domainname: types.string,
  User: types.string,
  AttachStdin: types.boolean,
  AttachStdout: types.boolean,
  AttachStderr: types.boolean,
  Tty: types.boolean,
  OpenStdin: types.boolean,
  StdinOnce: types.boolean,
  Volumes: types.object,
  OnBuild: types.array.of(types.string),
  Labels: types.object.of(types.string),
})

const jsonModel = deepFreeze({
  architecture: types.string,
  config: configType,
  container_config: configType,
  created: types.string,
  history: types.array.of(
    types.object.of({
      created: types.string,
      created_by: types.string,
      comment: types.string,
      empty_layer: types.boolean,
    })
  ),
  os: types.string,
  rootfs: types.object.of({
    type: types.string,
    diff_ids: types.array.of(types.string),
  }),
  container: types.string,
  docker_version: types.string,
})

module.exports = {
  jsonModel,
}
