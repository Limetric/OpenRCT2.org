module.exports = {
    plugins: [
        require('postcss-flexbugs-fixes'),
        require('autoprefixer'),
        require('cssnano')({
            preset: ['default', {
                discardComments: {
                    removeAll: true,
                }
            }]
        })
    ]
};