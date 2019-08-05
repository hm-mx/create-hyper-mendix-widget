const webpack = require('webpack');
const XMLPlugin = require('xml-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const paths = require('./paths');
const {
  version,
  description,
  widgetName,
  widgetFriendlyName,
  scope,
} = require('./package.json');

/*
 * 'xml-webpack-plugin' & 'webpack-archive-plugin' causing some webpack deprecations warnigns.
 * These warnings are safe to be ignored as we're in webpack 4, consider to periodically check if these
 * dependencies can be updated especially before going to webpack 5.
 * Uncomment the line below to be able to trace webpack deprecations.
 * Set 'process.noDeprecation' to 'false' to get deprecations trace printed to your cmd/terminal.
 */
process.traceDeprecation = true;
process.noDeprecation = true;

const widgetDir = `com/mendix/widget/custom`;
const widgetUIDir = `${widgetDir}/ui`;

const sharedConfigs = { NAME: widgetName, VERSION: version, SCOPE: scope };
const widgetXMLFiles = [
  {
    template: paths.widgetPackageXML,
    filename: `package.xml`,
    data: {
      ...sharedConfigs,
    },
  },
  {
    template: paths.widgetConfigXML,
    filename: `${widgetName}.xml`,
    data: {
      ...sharedConfigs,
      FRIENDLY_NAME: widgetFriendlyName,
      WIDGET_DESC: description,
    },
  },
];

const PREVIEW = 'preview';
const NORMAL = 'normal';

const getWebpackConfig = (mode = NORMAL) => {
  const isOnPreview = mode === PREVIEW;
  /**
   * for widget itself, use `umd`
   * for preview, use `commonjs`
   */
  const libraryTarget = isOnPreview ? 'commonjs' : 'umd';
  const entry = isOnPreview
    ? { [`${widgetName}.webmodeler`]: paths.srcPreviewEntry }
    : { [widgetName]: paths.srcEntry };

  /**
   * We cannot use a external babel.config.js
   * because `@babel/preset-env > modules` is dynamic
   * So we have to put this inside of this getWebpackConfig function
   */
  const babelConfig = {
    presets: [
      ['@babel/preset-env', { modules: libraryTarget }],
      '@babel/preset-react',
    ],
    plugins: [
      '@babel/plugin-transform-react-jsx',
      '@babel/plugin-proposal-object-rest-spread',
      '@researchgate/babel-plugin-transform-scss-import-to-string', // for preview
      '@babel/plugin-proposal-class-properties',
      ['@babel/plugin-transform-runtime', { regenerator: true }],
    ],
  };

  const commonRules = [
    {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: babelConfig,
      },
    },
  ];

  const rulesForPreviewOnly = [
    {
      test: /\.scss$/,
      use: [
        'css-loader',
        {
          loader: 'postcss-loader',
          options: { config: { path: paths.confDir } },
        },
        { loader: 'sass-loader' },
      ],
    },
  ];

  const rulesForWidgetOnly = [
    {
      test: /\.(sa|sc|c)ss$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        {
          loader: 'postcss-loader',
          options: { config: { path: paths.confDir } },
        },
        'sass-loader',
      ],
    },
    {
      test: /\.(gif|png|jpe?g|svg)$/i,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: `[name].[ext]`,
            outputPath: `${widgetUIDir}/images`,
          },
        },
      ],
    },
    {
      test: /\.jsx?$/,
      use: [
        {
          loader: 'string-replace-loader',
          options: {
            multiple: [
              {
                search: '__INVITE__API__',
                replace: '"https://invite.mendix.com/rest/invite/v1/"',
              },
              {
                search: '__APPBAR2__URL__',
                replace: '"https://home.mendix.com/mxid/appbar2"',
              },
              {
                search: '__APP__SWITCHER__SERVICE__URL__',
                replace: '"https://appswitcherservice.mendixcloud.com"',
              },
            ],
          },
        },
      ],
    },
  ];

  const rules = isOnPreview
    ? [...commonRules, ...rulesForPreviewOnly]
    : [...commonRules, ...rulesForWidgetOnly];

  const plugins = [
    new CleanWebpackPlugin({
      cleanAfterEveryBuildPatterns: [
        '**.*',
        `!${widgetName}.css`,
        `!${widgetName}.webmodeler.css`,
        `!${widgetName}.js`,
        `!${widgetName}.webmodeler.js`,
      ],
    }),
    new MiniCssExtractPlugin({ filename: `${widgetUIDir}/[name].css` }),
    new XMLPlugin({ files: widgetXMLFiles }),
    new webpack.EnvironmentPlugin(['MODE']),
  ];

  return {
    mode: 'production',
    devtool: false,
    entry,
    output: {
      path: paths.buildDir,
      filename: !isOnPreview ? `${widgetDir}/[name].js` : `[name].js`,
      libraryTarget,
      publicPath: '/widgets/',
    },
    module: { rules },
    resolve: {
      extensions: ['.js', '.jsx'],
      modules: ['node_modules'],
    },
    externals: ['react', 'react-dom'],
    plugins,
  };
};

module.exports = [getWebpackConfig(NORMAL), getWebpackConfig(PREVIEW)];
