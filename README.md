# Node Proxy

Simple node application to proxy responses from requests defined in configuration file.

## Configuration
The structure of the configuration file contains two basic sections related to the configuration of the HTTP server and requests. First, create ``config.json`` file in application root directory based on provided ``config.json.dist`` file.

**Basic HTTP server configuration:**

```(json)
"server": {
    "host": "localhost",
    "port": 3300
}
```

Additional parameters can be found in [documentation](https://hapijs.com/api#-server-options).

**Requests collection configuration:**

```(json)
"proxy": [
    {
        "name": "aliasABC",
        "request": {
            "method": "GET",
            "url": "https://example.com/api/user"
        }
    }
]
```

Parameter ``name`` defines an alias for the data returned from the request whose configuration is specified in ``request`` section. Requests are handled by the Axios HTTP Client library. Documentation for making requests can be found [here](https://github.com/axios/axios#request-config).

## Run application
The application package contain [forever tool](https://github.com/foreverjs/forever) to run application continuously. To start application, move to root directory and type command:

```(bash)
$ yarn run forever-start
```

This should start the application instance and print information about the running process. If you want to print this information manually, you must enter the command:

```(bash)
$ yarn run forever-list
```

To stop the application instance, just enter command:

```(bash)
$ yarn run forever-stop
```

## Example response
The response of the application depends on the requests you have defined, but based on the example configuration, the response may look similar to this:

```(json)
{
    "statusCode": 200,
    "message": "OK",
    "data": {
        "aliasABC": {
            "status": 200,
            "users: [
                {
                    "name": "Sample Person",
                    "username": "sample.person",
                    "email": "sample.person@example.com"
                },
                {
                    "name": "Sample Person",
                    "username": "sample.person",
                    "email": "sample.person@example.com"
                }
            ]
        }
    }
}
```

## License
MIT