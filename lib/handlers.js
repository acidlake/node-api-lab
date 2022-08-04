/**
 * Request handlers
 */

// Dependencies
const _data = require('./data');
const helpers = require('./helpers');

// Handlers
let handlers = { api: {v1: {
  
}} }

//
handlers.api.v1.users = function(data, callback){
  const acceptableMethods = ['post', 'get', 'put', 'delete'];
  if(acceptableMethods.indexOf(data.method) > -1){
    handlers.api.v1._users[data.method](data,callback);
  }else{
    callbacks(405);
  }
};

// container users method
handlers.api.v1._users = {} 

// Users - post
handlers.api.v1._users.post = function(data, callback){
  // Check all required fields are filled out
  const firstName = typeof(data.payload.firstName) == 'string' && 
  data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;

  const lastName = typeof(data.payload.lastName) == 'string' && 
  data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;

  const phone = typeof(data.payload.phone) == 'string' && 
  data.payload.phone.trim().length  == 10 ? data.payload.phone.trim() : false;

  const password = typeof(data.payload.password) == 'string' && 
  data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

  const tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && 
  data.payload.tosAgreement == true ? true : false;

  if(firstName && lastName && phone && password && tosAgreement){
    // check that user doesnt exist
    _data.read('users', phone, function(err, data){
      if(err){
        // Hash password
        const hashedPassword = helpers.hash(password);
        if(hashedPassword){
            // create user object
            const userObject = {
              'firstName': firstName,
              'lastName': lastName,
              'phone': phone,
              'hashedPassword': hashedPassword,
              'tosAgreement': true
            };

            // Store the user
            _data.create('users', phone, userObject, function(err){
              if(!err){
                callback(200);
              }else{
                console.log(err);
                callback(500, {'Error': 'Could not create the new user'});
              }
            });
        }else{
          callback(500, {'Error': 'Could not hash the password'});
        }
        
      }else{
        // User already exist
        callback(400, {'Error': 'A user with that phone number already exists'})
      }
    });
  }else{
    callback(400, {'Error': 'Missing required fields'});
  }
};

// Users - get
handlers.api.v1._users.get = function(data, callback){
  // Check the phone is valid
  const phone = typeof(data.query.phone) == 'string' && data.query.phone.trim().length == 10 ? 
  data.query.phone.trim() : false;
  if(phone){
    // Look up the user
    _data.read('users', phone, function(err,data){
      if(!err && data){
        // Remove hashed password from user object before it gets returned
        delete data.hashedPassword;
        callback(200, data);
      }else{
        callback(404);
      }
    })
  }else{
    callback(400, {'Error': 'Missing required field'})
  }
};

// Users - put
handlers.api.v1._users.put = function(data, callback){
  // check required fields
  const phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? 
  data.payload.phone.trim() : false;

  // check optional fields
  const firstName = typeof(data.payload.firstName) == 'string' && 
  data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;

  const lastName = typeof(data.payload.lastName) == 'string' && 
  data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;

  const password = typeof(data.payload.password) == 'string' && 
  data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
  // Error if the phone is invalid
  if(phone){
    if(firstName || lastName || password){
      // Lookup for user
      _data.read('users', phone, function(err, userData){
        if(!err && userData){
          // update fields
          if(firstName){
            userData.firstName = firstName
          }
          if(lastName){
            userData.lastName = lastName
          }
          if(password){
            userData.hashedPassword = helpers.hash(password)
          }
          // Store the new updates
          _data.update('users', phone, userData, function(err){
            if(!err){
              callback(200);
            }else{
              console.log(err)
              callback(500, {'Error': 'Could not update the user'})
            }
          })
        }else{
          callback(400, {'Error': 'The specified user does not exist'})
        }
      })
    }else{
      callback(400, {'Error': 'Missing field to update'})
    }
  }else{
    callback(400, {'Error': 'Missing required fields'});
  }

};
// Users - delete
handlers.api.v1._users.delete = function(data, callback){
  // check the phone number is valid
  const phone = typeof(data.query.phone) == 'string' && data.query.phone.trim().length == 10 ? 
  data.query.phone.trim() : false;
  if(phone){
    // Look up the user
    _data.read('users', phone, function(err,data){
      if(!err && data){
        _data.delete('users', phone, function(err){
          if(!err){
            callback(200);
          }else{
            callback(500, {'Error': 'Could not delete the specified user'})
          }
        })
      }else{
        callback(400, {'Error': 'Could not find the specifie user'});
      }
    })
  }else{
    callback(400, {'Error': 'Missing required field'})
  }
};

// container users method
handlers.api.v1._tokens = {} 

handlers.api.v1.tokens = function(data, callback){
  const acceptableMethods = ['post', 'get', 'put', 'delete'];
  if(acceptableMethods.indexOf(data.method) > -1){
    handlers.api.v1._tokens[data.method](data,callback);
  }else{
    callbacks(405);
  }
};

handlers.api.v1._tokens.post = function(data, callback){
  
}

handlers.api.v1._tokens.get = function(data, callback){

}

handlers.api.v1._tokens.put = function(data, callback){

}

handlers.api.v1._tokens.delete = function(data, callback){

}

//
handlers.api.v1.hello = (data, callback) => {
  callback(200, { 'msg': `Welecome to api version 1`, data } );
}

// Ping service
handlers.api.v1.ping = (data, callback) => {
  callback(200, new Date());
}

  // Default handler, notFound
handlers.notFound = (data, callback) => {
  callback(404);
}

// Export the module
module.exports = handlers;