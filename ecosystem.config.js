module.exports = {
    apps: [
        {
            name: 'app',
            script: './dist/app.js',
            env: {
                NODE_ENV: 'production'
            }
        }
    ]
};
