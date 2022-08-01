// index for using-reduxtoolkit
import configureStore from "./using-reduxtoolkit/configureStore";
import {
  addBug,
  assignBug,
  loadBugs,
  resolveBug,
  selectBugByUser,
  selectUnresolvedBugs,
} from "./using-reduxtoolkit/bugs";
import { projectAdded } from "./using-reduxtoolkit/projects";
import { userAdded } from "./using-reduxtoolkit/users";

const store = configureStore();

// do an API call using the custom api middleware
store.dispatch(loadBugs());

/*
//  Using Middleware to handle API Calls
store.dispatch((dispatch, getState) => {
  // Cal an API
  // when the promise is resolved => dispatch() and action
  dispatch({ type: "bugsReceived", bugs: [1, 2, 3] });
  // if the promise is rejected => dispatch() another aciton
});
*/

store.dispatch({ type: "error", payload: { message: "An error ocurred" } });

// for using Caching

// setTimeout(() => {
//   store.dispatch(loadBugs());
// }, 2000);

store.dispatch(addBug({ description: "new bug" }));

setTimeout(() => {
  store.dispatch(resolveBug(3));
}, 2000);

store.dispatch(assignBug(3, 78));

// without selectors
//const unresolvedBugs = store.getState().entities.bugs.filter((bug) => !bug.resolved);

// Whith selectors, pass in the state

const x = selectUnresolvedBugs(store.getState());
const y = selectUnresolvedBugs(store.getState()); // the result hasn't change

console.log("x==y?", x == y);

// The problem is that in React if the state changes, the components gets re-render
// So if we haven't change the list of bugs, we don't want to re-render
// if the filter operation is costing, we don't whant to do it twice

// Use Memoization, use a Cache to improve performance -> use 'reselect' library

setTimeout(() => {
  const bugsOfUser = selectBugByUser(78)(store.getState());
  console.log("bugsOfUser 78", bugsOfUser);
}, 2000);
