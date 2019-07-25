const autoprefixer = require('autoprefixer'); // eslint-disable-line import/no-unresolved
const postcssClean = require('postcss-clean'); // eslint-disable-line import/no-unresolved
const cssnano = require('cssnano'); // eslint-disable-line import/no-unresolved

module.exports = {
  plugins: [
    autoprefixer,
    postcssClean,
    cssnano({
      preset: [
        'default',
        {
          discardComments: {
            removeAll: true,
          },
        },
      ],
    }),
  ],
};
