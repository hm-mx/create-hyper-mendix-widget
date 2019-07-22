const webpack = require('webpack'); // eslint-disable-line import/no-unresolved
const XMLPlugin = require('xml-webpack-plugin'); // eslint-disable-line import/no-unresolved
const ArchivePlugin = require('webpack-archive-plugin'); // eslint-disable-line import/no-unresolved
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // eslint-disable-line import/no-unresolved
const CleanWebpackPlugin = require('clean-webpack-plugin'); // eslint-disable-line import/no-unresolved
const InjectPlugin = require('webpack-inject-plugin').default; // eslint-disable-line import/no-unresolved

const paths = require('./paths');
const babelConfig = require('./babel.config');
const {
  version,
  description,
  widgetName,
  widgetFriendlyName,
  scope,
} = require('./package.json');
const {
  mxProjectRootDir,
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

const MODES = {
  DEV: 'development',
  PROD: 'production',
};

const isDev = process.env.MODE === MODES.DEV;
const isProd = !isDev;

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
  publicPath: '/widgets/',
  proxy: [
    {
      context: ['**', `!/widgets/${widgetDir}/${widgetName}.js`],
      target: `http://${mxAppHost}:${mxAppPort}/`,
    },
  ],
  overlay: {
    errors: true,
  },
  stats: 'errors-only',
};

module.exports = {
  mode: isDev ? MODES.DEV : MODES.PROD,
  devtool: isDev ? 'eval-source-map' : false,
  entry: paths.srcEntry,
  output: {
    path: paths.buildDir,
    filename: `${widgetDir}/${widgetName}.js`,
    libraryTarget: 'umd',
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
            options: {
              config: {
                path: paths.confDir,
              },
            },
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
                  replace: isDev
                    ? '"https://invite-test.mendix.com/rest/invite/v1/"'
                    : '"https://invite.mendix.com/rest/invite/v1/"',
                },
                {
                  search: '__APPBAR2__URL__',
                  replace: isDev
                    ? '"https://home-test.mendix.com/mxid/appbar2"'
                    : '"https://home.mendix.com/mxid/appbar2"',
                },
                {
                  search: '__APP__SWITCHER__SERVICE__URL__',
                  replace: isDev
                    ? '"https://appswitcherservice-test.mendixcloud.com"'
                    : '"https://appswitcherservice.mendixcloud.com"',
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
  plugins: getPlugins(), // eslint-disable-line no-use-before-define
};

function getPlugins() {
  const plugins = [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: `${widgetUIDir}/${widgetName}.css`,
    }),
    new XMLPlugin({
      files: widgetXMLFiles,
    }),
    new webpack.EnvironmentPlugin(['MODE']),
  ];
  if (isDev) {
    const cssInjectCode = `mxui.dom.addCss('widgets/${widgetUIDir}/${widgetName}.css');`;
    plugins.push(new InjectPlugin(() => cssInjectCode));
  }
  if (isProd) {
    plugins.push(
      new ArchivePlugin({
        output: `${paths.buildDir}/${widgetName}`,
        format: 'zip',
        ext: 'mpk',
      })
    );
    if (mxProjectRootDir) {
      plugins.push(
        new ArchivePlugin({
          output: `${mxProjectRootDir}/widgets/${widgetName}`,
          format: 'zip',
          ext: 'mpk',
        })
      );
    }
  }

  return plugins;
}
