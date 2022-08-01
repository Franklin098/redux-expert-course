// using Dux pattern

import { createStore } from "redux";
import reducer from "./bugs";
import { devToolsEnhancer } from "redux-devtools-extension"; // use google chrome dev tools

export default function () {
  const store = createStore(reducer, devToolsEnhancer({ trace: true }));

  return store;
}
