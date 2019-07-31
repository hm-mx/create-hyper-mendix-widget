const webpack = require('webpack');
const XMLPlugin = require('xml-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const InjectPlugin = require('webpack-inject-plugin').default;

const paths = require('./paths');
const {
  version,
  description,
  widgetName,
  widgetFriendlyName,
  scope,
} = require('./package.json');
const {
  mxAppHost,
  mxAppPort,
  devServerPort,
} = require('./src/utils/readConfig')();

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

const devServerConfigs = {
  port: devServerPort,
  open: true,
  watchContentBase: true,
  publicPath: '/widgets/',
  proxy: [
    {
      context: ['**', `!/widgets/${widgetDir}/[name].js`],
      target: `http://${mxAppHost}:${mxAppPort}/`,
    },
  ],
  overlay: {
    errors: true,
  },
  stats: 'errors-only',
};

/**
 * It is not really necessary to make a functional call here.
 * We're doing this just to be consistent with `webpack.prod.js`
 */

const getWebpackConfig = () => {
  const libraryTarget = 'umd';
  const entry = { [widgetName]: paths.srcEntry };
  const babelConfig = {
    presets: [
      ['@babel/preset-env', { modules: libraryTarget }],
      '@babel/preset-react',
    ],
    plugins: [
      '@babel/plugin-transform-react-jsx',
      '@babel/plugin-proposal-object-rest-spread',
      '@babel/plugin-proposal-class-properties',
      ['@babel/plugin-transform-runtime', { regenerator: true }],
    ],
  };
  return {
    mode: 'development',
    devtool: 'eval-source-map',
    entry,
    output: {
      path: paths.buildDir,
      filename: `${widgetDir}/[name].js`,
      libraryTarget,
      publicPath: '/widgets/',
    },
    devServer: devServerConfigs,
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: babelConfig,
          },
        },
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
                    replace: '"https://invite-test.mendix.com/rest/invite/v1/"',
                  },
                  {
                    search: '__APPBAR2__URL__',
                    replace: '"https://home-test.mendix.com/mxid/appbar2"',
                  },
                  {
                    search: '__APP__SWITCHER__SERVICE__URL__',
                    replace:
                      '"https://appswitcherservice-test.mendixcloud.com"',
                  },
                ],
              },
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx'],
      modules: ['node_modules'],
    },
    externals: ['react', 'react-dom'],
    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({ filename: `${widgetUIDir}/[name].css` }),
      new XMLPlugin({ files: widgetXMLFiles }),
      new webpack.EnvironmentPlugin(['MODE']),
      new InjectPlugin(
        () => `mxui.dom.addCss('widgets/${widgetUIDir}/${widgetName}.css');`
      ),
    ],
  };
};

module.exports = getWebpackConfig();
