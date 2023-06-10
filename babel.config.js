/* eslint-disable no-undef */
const getPlugins = () => {
  const defaultPlugins = [
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        root: ['.'],
        alias: {
        },
      },
    ],
  ]
  // eslint-disable-next-line no-undef
  if (process.env.NODE_ENV === 'production') {
    defaultPlugins.push('transform-remove-console')
  }
  return defaultPlugins
}
module.exports = {
  presets: [['@babel/preset-env', { targets: { node: 'current' } }], '@babel/preset-typescript'],
  plugins: getPlugins(),
}
