const webpack = require('webpack');
const XMLPlugin = require('xml-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const WorkerPlugin = require('worker-plugin');

const paths = require('./paths');
const {
  version,
  description,
  organization: companyName,
  widgetName,
  widgetFriendlyName,
} = require('./package.json');

/*
 * 'xml-webpack-plugin' causing some webpack deprecations warnigns.
 * These warnings are safe to be ignored as we're in webpack 4, consider to periodically check if these
 * dependencies can be updated especially before going to webpack 5.
 * Uncomment the line below to be able to trace webpack deprecations.
 * Set 'process.noDeprecation' to 'false' to get deprecations trace printed to your cmd/terminal.
 */
process.traceDeprecation = true;
process.noDeprecation = true;

const organization = companyName
  .replace(/[&/\\#,+()$~%.'":*?<>{}_\s]/g, '')
  .toLowerCase();

const widgetDir = `com/${organization}/widget/${widgetName}`;
const widgetUIDir = `${widgetDir}/ui`;

const sharedConfigs = {
  NAME: widgetName,
  VERSION: version,
  ORGANIZATION: organization,
};

const widgetXMLFiles = [
  {
    template: paths.widgetPackageXML,
    filename: `package.xml`,
    data: sharedConfigs,
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
  const libraryTarget = isOnPreview ? 'commonjs' : 'amd';
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
      '@babel/preset-typescript',
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

  const plugins = [
    new CleanWebpackPlugin({
      cleanAfterEveryBuildPatterns: [
        '**.*',
        `!${widgetName}.css`,
        `!${widgetName}.js`,
        `!${widgetName}.webmodeler.js`,
      ],
    }),
    !isOnPreview &&
      new MiniCssExtractPlugin({ filename: `${widgetUIDir}/[name].css` }),
    new WorkerPlugin({
      // disable warnings about "window" breaking HMR:
      globalObject: false,
    }),
    new XMLPlugin({ files: widgetXMLFiles }),
    new webpack.EnvironmentPlugin(['MODE']),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: '../reports/bundle-report.html',
    }),
  ].filter(x => x);

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
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
              },
            },
          ],
        },
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
            !isOnPreview && MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'postcss-loader',
              options: { config: { path: paths.confDir } },
            },
            'sass-loader',
          ].filter(x => x),
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
      ],
    },
    resolve: {
      extensions: ['.ts', '.js', '.tsx', '.jsx'],
      modules: ['node_modules'],
      alias: {
        react: 'preact/compat',
        'react-dom/test-utils': 'preact/test-utils',
        'react-dom': 'preact/compat',
      },
    },
    externals: [
      { MxWidgetBase: 'mxui/widget/_WidgetBase' },
      { dojoBaseDeclare: 'dojo/_base/declare' },
    ],
    plugins,
  };
};

module.exports = [getWebpackConfig(NORMAL), getWebpackConfig(PREVIEW)];
