import { createStore } from "redux";
import reducer from "./reducer";
import { devToolsEnhancer } from "redux-devtools-extension"; // use google chrome dev tools

const store = createStore(reducer, devToolsEnhancer({ trace: true }));

export default store;
