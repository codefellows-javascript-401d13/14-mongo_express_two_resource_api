# Express Single Resource API router w/File Server persistance

This app creates an HTTP server that handles GET, POST, and DELETE to a filesystem-level persistance layer.

# System Requirements

  - Terminal.app on macOS or equivalent
  - node.js and npm package manager installed


### Installation

Clone the repository to your local server
```sh
https://github.com/zcrumbo/11-single_resource_express_api/tree/lab-zachary
```

Install the dependencies -

```sh
$ npm i
```

[HTTPie](https://httpie.org/) will be required to run the HTTP requests from your terminal window. You will need to install this with [Homebrew][1] on macOS. It is also easier to see the results of all operations by running mocha tests with the command
```sh
$ mocha
```

Start the server

```sh
$ node server.js
```
If you want to use the debug and nodemon modules, run the npm script:
```
npm start
```

### Connecting

If you are using HTTPie, in your terminal window, type the following commands, where '3000' would be replaced with your local environment PORT variable, if configured. Commands can  be sent to the api/quiver and the api/quiver/:quiverID/bike/ endpoints.
A Quiver object is required to create bike objects - all bikes must be associated with a quiver - this is achieved by passing a quiverID to the server as part of the bike post request.

```sh
$  http POST localhost:3000/api/quiver/ name='test name'  #creates a new quiver object and writes it to the database, and returns a unique id

$ http GET localhost:8000/api/quiver/:quiverID #returns the name and content of a stored quiver object

$ DELETE localhost:8000/api/quiver/:quiverID #deletes the quiver file from server storage and returns a 204 status

$  http POST  localhost:3000/api/quiver/:quiverID/bike/ title='test name' description='test content' #creates a new bike object on the associated quiver and writes it to the database, and returns a unique id

$ http PUT localhost:/3000/api/quiver/:quiverID/bike/:bikeID title="updated name" description = "updated content" # updates the bike object associated with the quiverID and returns the updated object

$ DELETE localhost:8000/api/bike/:bikeID #deletes the bike object from server storage and returns a 204 status, and removes the association from the Quiver object

$ DELETE localhost:8000/api/quiver/:quiverID/bike/:bikeID # alternate method to delete the bike object from server storage and returns a 204 status, and removes the association from the Quiver object
```

Sending the following requests to the server will have the results below:

 * `GET`:  404 response with 'not found' for valid requests made with an id that was not found

 * `GET`: 200 response with an array of all ids if no id was provided in the request
 * `GET`: 200 response with a response body for a request made with a valid id
 * `POST`: 400 response with 'bad request' if no request body was provided or the body was invalid
 * `POST`: 200 response with the body content for a post request with a valid body
 * `PUT`: 200 response with body content if a put request was made with an valid id and properly formatted body content
 * `PUT`: 400 response with 'bad request' if missing or malformed body data was passed.

[1]:https://brew.sh/

