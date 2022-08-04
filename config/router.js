/**
 * 
 * Routes file
 * 
 */

// Dependencies
const handlers = require('../lib/handlers');

  let router = {}

  router = {
    'ping' : handlers.api.v1.ping,
    'hello' : handlers.api.v1.hello,
    'api/v1' : handlers.api.v1.hello,
    'api/v1/users': handlers.api.v1.users,
    'tokens': handlers.api.v1.tokens
  }



// Export module
module.exports = router;