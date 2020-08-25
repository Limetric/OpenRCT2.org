/* eslint-disable no-unused-vars, import/no-extraneous-dependencies */
module.exports = ({ file, options, env }) => ({
  plugins: [
    require('postcss-flexbugs-fixes'),
    require('autoprefixer'),
    env === 'production' ? require('cssnano')({
      preset: ['default', {
        discardComments: {
          removeAll: true,
        },
      }],
    }) : undefined,
  ],
});
