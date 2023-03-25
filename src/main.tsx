import React, { lazy, Suspense, createContext } from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./index.scss";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";
import { persistor } from "./store/store";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { store } from "./store/store";

import i18n from "../react-i18next-config";
import "amfe-flexible";
// import context from "./utils/context";
// import { useTranslation } from "react-i18next";
// const { t } = useTranslation();
const PGate = PersistGate as any;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(

    <Provider store={store}>
      <PGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PGate>
    </Provider>

);
