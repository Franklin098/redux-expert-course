// using Dux pattern
import reducer from "./reducer";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import logger from "./middleware/logger";
import func from "./middleware/func";
import errorToast from "./middleware/errorToast";
// custom API Middleware
import api from "./middleware/api";

export default function () {
  // without redux-toolkit
  //const store = createStore(reducer, devToolsEnhancer({ trace: true }));

  // with redux-toolkit
  const store = configureStore({
    reducer,
    middleware: [
      ...getDefaultMiddleware(),
      logger({ destination: "console" }),
      func,
      errorToast,
      api,
    ],
  }); // automatically configure devTools, and handle async actions
  return store;
}

/** Without ReduxToolkit:
import {createStore, applyMiddleware} from "redux";
const store = createStore(reducer, applyMiddleware(logger));
 */
