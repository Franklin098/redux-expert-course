import store from "./build-reduxlib/customStore";
import * as actionsCreators from "./reducer-example-1/actions";

store.subscribe(() => {
  console.log("store changed !");
});

store.dispatch(actionsCreators.bugAdded("Bug 1"));

console.log(store.getState());
