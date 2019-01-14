# OpenRCT2.org
The website runs on a Node.js app. Contributions are welcome.

## Run local server
*Make sure you have npm global packages `gulp` and `bunyan` installed and in your path.*
1. Set environment to development by setting environment variable `NODE_ENV` to `development`.
2. Install dependencies by running `npm install`.
3. Copy `config/env.sample.json` to `config/env.json` and make changes when necessary.
4. Start app by running `npm start`.
5. In a new terminal window run `gulp` and keep it running while making changes to the frontend. It compiles JS and CSS code.
5. By default the webserver listens to `http://localhost:4000`.

## Forums
The forums run on the commercial *IPS Community Suite* PHP software. This portion will not become available in the repository.