/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from "react";
import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import store from "./src/store/store/index";
import { Provider } from "react-redux";
import AppNavigator from "./src/navigation/navigation";
import { I18nextProvider } from "react-i18next";
import i18n, { fetchTranslations } from "./src/utilities/languageData";
import Colors from "./src/utilities/constants/colors";
import { setupNotificationHandlers } from "./src/services/notificationService";

function App() {
  const getTranslations = async () => {
    return fetchTranslations();
  };
  useEffect(() => {
    getTranslations();
    // Setup notification handlers
    setupNotificationHandlers();
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
          <StatusBar backgroundColor="#24A69E" barStyle="dark-content" />
          <AppNavigator />
          <Toast />
        </SafeAreaView>
      </Provider>
    </I18nextProvider>
  );
}

export default App;
