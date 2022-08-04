/*
*
*   Main Configuration file
*
*/

// Env
let environments = {}

// Develop
environments.develop = {
  'httpPort': 3000,
  'httpsPort': 3001,
  'envName': 'development',
  'hashingSecret': 'thisIsASecret'
}

// Staging
environments.staging = {
  'httpPort' : 4000,
  'httpsPort': 4001,
  'envName': 'staging',
  'hashingSecret': 'thisIsAlsoSecret'
}

// Production
environments.production = {
  'httpPort': 5000,
  'httpsPort': 5001,
  'envName': 'production',
  'hashingSecret': 'thisIsProdASecret'
}

// determine which environments
let currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// check if current env is one of the above if not, default to develop
let environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.develop;

// export module
module.exports = environmentToExport;
