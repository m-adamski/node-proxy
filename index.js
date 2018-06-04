const fs = require("fs");
const hapi = require("hapi");
const axios = require("axios");
const boom = require("boom");

// Read configuration file
let userConfig = {};
if (fs.existsSync(__dirname + "/config.json")) {
    userConfig = JSON.parse(fs.readFileSync(__dirname + "/config.json"));
}

// Define default config
let defaultConfig = { "server": { "host": "localhost", "port": 3000 }, "proxy": [] };

// Merge provided user configuration with defaults
let config = { ...defaultConfig, ...userConfig };

// Define instance of Hapi HTTP Server
const httpServer = hapi.server(config.server);

// Define route
httpServer.route({
    method: "GET",
    path: "/",
    handler: (request) => {

        // Define collection with requests
        var requestsCollection = [];

        // Move every provided in configuration proxy
        config.proxy.forEach((proxy) => {
            if (proxy.name !== undefined && proxy.request !== undefined) {
                let requestHeaders = proxy.request.headers || { "X-Custom-Request-Name": proxy.name };

                // Overwrite headers
                proxy.request.headers = requestHeaders;

                // Push request into collection
                requestsCollection.push(axios(proxy.request));
            }
        });

        // Define response
        var responseData = {};

        // Send requests
        return axios.all(requestsCollection).then(
            axios.spread((...args) => {
                var counter = 0;

                args.forEach((currentResponse) => {
                    if (currentResponse.status === 200 && currentResponse.data !== undefined) {
                        responseData[currentResponse.config.headers["X-Custom-Request-Name"] || `response_${++counter}`] = currentResponse.data;
                    }
                });
            })
        ).then(() => {
            return {
                "statusCode": 200,
                "message": "OK",
                "data": responseData
            };
        }).catch((error) => {
            boom.badImplementation("Exception while parsing responses from proxies");
        });
    }
});

// Start HTTP Server
try {
    httpServer.start();

    console.info(`HTTP Server is running and listening at ${httpServer.info.uri}`);
} catch (error) {
    console.error(error);
}