import { ConfigAPI } from "@babel/core";

module.exports = (api: ConfigAPI) => {
  api.cache.forever();

  return {
    presets: ["module:@react-native/babel-preset"],
     plugins: [
    ['module:react-native-dotenv', {
      moduleName: '@env',
      path: '.env',
      blocklist: null,
      allowlist: null,
      safe: false,
      allowUndefined: true,
    }],
  ],
  };
};
