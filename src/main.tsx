import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/scss/index.scss";
import App from "./App";
import { AppStoreProvider } from "./stores/Store";
import { BrowserRouter } from "react-router-dom";
import { LanguageProvider } from "@/languages/Language.context";

/**
 * Augments the global Window interface with the ReactApp property.
 * This allows other scripts to interact with the React application.
 */
declare global {
  interface Window {
    ReactApp: {
      root: ReactDOM.Root | null;
      init: (container: HTMLElement) => void;
    };
  }
}

const container = document.getElementById("root");

/**
 * Initializes the React application and mounts it to the specified container.
 * This function is attached to the global `window.ReactApp` object, allowing other scripts to
 * control the initialization process.
 */
window.ReactApp = {
  root: null,
  init: (container) => {
    if (container) {
      if (!window.ReactApp.root) {
        window.ReactApp.root = ReactDOM.createRoot(container);
      }
      window.ReactApp.root.render(
        <React.StrictMode>
          <BrowserRouter>
            <AppStoreProvider>
              <LanguageProvider>
                  <App />
              </LanguageProvider>
            </AppStoreProvider>
          </BrowserRouter>
        </React.StrictMode>
      );
    } else {
      console.error("Container element not found");
    }
  },
};

// Initialize the app if the container is found
if (container) {
  window.ReactApp.init(container);
}

// Service worker or performance monitorings
