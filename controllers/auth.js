
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const request = require('request');
const config = require('../config');

// Authentication middleware
// This middlemware will check access token in authorization headers
// of a request.
// Also, it will verify acess token against Auth0 JSON Web key set

exports.checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 10,
    jwksUri: 'https://dev-pbipvtad.us.auth0.com/.well-known/jwks.json'
  }),
  audience: 'https://dev-pbipvtad.us.auth0.com/api/v2/',
  issuer: 'https://dev-pbipvtad.us.auth0.com/',
  algorithms: ['RS256']
});

exports.checkRole = role => (req, res, next) => {
  const user = req.user;
  // console.log('authjs checkRole() user: \n', user);

  if (user && user[config.AUTH0_NAMESPACE + '/roles'].includes(role)) {
    next();
  } else {
    return res.status(401).send('You are not authorized to delete this resource!');
  }
};

exports.getAccessToken = () => {

  const options = {
    method: 'POST',
    url: config.AUTH0_TOKEN_URL,
    headers: {'content-type': 'application/json'},
    form: {
      grant_type: 'client_credentials',
      client_id: config.AUTH0_CLIENT_ID,
      client_secret: config.AUTH0_CLIENT_SECRET,
      audience: config.AUTH0_AUDIENCE
    }
  };

  return new Promise((resolve, reject) => {
    request(options, (error, res, body) => {
      if (error) { 
        // console.log("in request object error:", error);
        return reject(new Error(error)); 
      }
      // console.log("auth js getAccessToken() request object body:\n", body);
      resolve(body ? JSON.parse(body) : '');
    })

  });

};

exports.getAuth0User = (accessToken) => (userId) => {

  const options = {
    method: 'GET',
    url: `${config.AUTH0_DOMAIN}/api/v2/users/${userId}?fields=name,picture,user_id`,
    headers: {authorization: `Bearer ${accessToken}`}
  };
  return new Promise((resolve, reject) => {
    request(options, (error, res, body) => {
      if (error) { 
        // console.log("in getAuth0User() object error:", error);
        return reject(new Error(error)); 
      }
      // console.log("auth js getAuth0User() object body:", body);
      resolve(body ? JSON.parse(body) : '');
    })

  });

};
