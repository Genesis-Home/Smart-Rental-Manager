import { ConfigAPI } from "@babel/core";

module.exports = (api: ConfigAPI) => {
  api.cache.forever();

  return {
    presets: ["module:@react-native/babel-preset"],
  };
};
