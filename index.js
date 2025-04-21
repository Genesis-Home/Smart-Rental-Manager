/**
 * @format
 */

import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";

// Ensure the appName is of type string
AppRegistry.registerComponent(appName, () => App);
