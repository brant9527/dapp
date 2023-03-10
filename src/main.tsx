import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./index.scss";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";
import { persistor } from "./store/store";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { store } from "./store/store";
import Index from "./components/Wallet/test";
import { routers } from "./router/route";
import i18n from "../react-i18next-config";
import "amfe-flexible";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>
);
