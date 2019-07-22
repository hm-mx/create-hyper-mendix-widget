const isDev = process.env.MODE === 'development';

const presetENV = isDev
  ? [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ]
  : '@babel/preset-env';

module.exports = {
  presets: [presetENV, '@babel/preset-react'],
  plugins: [
    '@babel/plugin-transform-react-jsx',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-class-properties',
    [
      '@babel/plugin-transform-runtime',
      {
        regenerator: true,
      },
    ],
  ],
};
