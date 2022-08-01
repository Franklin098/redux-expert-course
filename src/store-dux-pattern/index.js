// using Dux pattern

import configureStore from "./configureStore";
import * as actions from "./bugs";

const store = configureStore();

store.dispatch(actions.bugAdded("Bug 1"));
store.dispatch(actions.bugSolved(1));
