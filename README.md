![CF](https://camo.githubusercontent.com/70edab54bba80edb7493cad3135e9606781cbb6b/687474703a2f2f692e696d6775722e636f6d2f377635415363382e706e67) Lab 13: Single Resource Mongo and Express API
===

## To Submit this Assignment
  * Fork this repository
  * Write all of your code in a directory named `lab-` + `<your name>` **e.g.** `lab-brian`
  * Push to your repository
  * Submit a pull request to this repository
  * Submit a link to your PR in canvas
  * Write a question and observation on canvas

## Include
  * `package.json`
  * `.eslintrc`
  * `gulpfile.js`
  * `.gitignore`
  * `README.md`

## Description
  * Create an HTTP Server using `express`
  * Create a resource **model** of your choice that uses `mongoose.Schema` and `mongoose.model`
  * Use the `body-parser` express middleware to parse the `req` body on `POST` and `PUT` requests
  * Use the npm `debug` module to log the functions and methods that are being used in your application
  * Use the express `Router` to create a route for doing **RESTFUL CRUD** operations against your _model_

## Server Endpoints
### `/api/resource-name`
* `POST` request
  * should pass data as stringifed JSON in the body of a post request to create a new resource

### `/api/resource-name/:id`
* `GET` request
  * should pass the id of a resource through the url endpoint to get a resource
    * **this should use `req.params`, not querystring parameters**
* `PUT` request
  * should pass data as stringifed JSON in the body of a put request to update a pre-existing resource
* `DELETE` request
  * should pass the id of a resource though the url endpoint to delete a resource
    * **this should use `req.params`**

## Tests
* Create a test that will ensure that your API returns a status code of 404 for routes that have not been registered
* Create a series of tests to ensure that your `/api/resource-name` endpoint responds as described for each condition below:
  * `GET` - test 200, returns a resource with a valid body
 * `GET` - test 404, respond with 'not found' for valid requests made with an id that was not found
 * `PUT` - test 200, returns a resource with an updated body
 * `PUT` - test 400, responds with 'bad request' if no request body was provided
 * `PUT` - test 404, responds with 'not found' for valid requests made with an id that was not found
 * `POST` - test 400, responds with 'bad request' if no request body was provided
 * `POST` - test 200, returns a resource for requests made with a valid body

## Bonus
* **2pts:** a `GET` request to `/api/resource-name` should return an array of stored resources
