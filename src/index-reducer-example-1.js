// index for reducer-example-1

import store from "./reducer-example-1/store";
import * as actions from "./reducer-example-1/actionTypes";

//  we can use the memo to unsubscribe, to avoid memory leaks when we unmount the UI component
const unsubscribe = store.subscribe(() => {
  console.log("Store changed !", store.getState());
});

// what if we have multiple places to dispatch the same action? we'll have a lot of same code
// in different places. We can solve that with actionCreators
store.dispatch({
  type: actions.BUG_ADDED,
  payload: {
    description: "Bug 1",
  },
});

// using actionCreators to avoid repeated code
import { bugAdded, bugSolved } from "./reducer-example-1/actions";

store.dispatch(bugAdded("Bug 2"));

console.log(store.getState());

// ==========================================================================

store.dispatch({
  type: actions.BUG_REMOVED,
  payload: {
    id: 1,
  },
});

store.dispatch(bugSolved(2));

console.log(store.getState());

unsubscribe();
