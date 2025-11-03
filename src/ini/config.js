export default {
  // environment
  ENV: process.env.ENV || "prod",
  ENV_IS_PROD: process.env.ENV ? process.env.ENV === "prod" : true,
  ENV_IS_DEV: process.env.ENV ? process.env.ENV === "dev" : false,
  ENV_IS_TEST: process.env.ENV ? process.env.ENV === "test" : false,
  ENV_NOT_PROD: process.env.ENV ? process.env.ENV !== "prod" : false,
  ENV_NOT_DEV: process.env.ENV ? process.env.ENV !== "dev" : true,
  ENV_NOT_TEST: process.env.ENV ? process.env.ENV !== "test" : true,

  // Boolean
  ENVTEST: process.env.ENVTEST === "true",
  DEBUG_INITIAL_SLEEP: process.env.DEBUG_INITIAL_SLEEP === "true",
  DEBUG_SINGLE_ROUND:
    process.env.DEBUG_SINGLE_ROUND === "true" ||
    process.env.DEBUG_SINGLE_ROUND === undefined,
  DEBUG_SINGLE_ROUND_ON_ERROR:
    process.env.DEBUG_SINGLE_ROUND_ON_ERROR === "true",
  DEBUG_VERBOSE: process.env.DEBUG_VERBOSE === "true",

  // String

  // Number

  // Other

  // process
  MY_HOSTNAME: process.env.MY_HOSTNAME,
};
