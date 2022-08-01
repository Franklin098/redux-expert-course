import reducer from "../reducer-example-1/reducer";

function createStore(reducer) {
  let state; // internal state of the store, should be private

  function getState() {
    return state;
  }

  // dispatch actions

  function dispatch(action) {
    // call the reducer, takes in the current state and the action, returns a new state
    state = reducer(state, action);
    // notify the subscribers
    for (let listener of listeners) {
      listener();
    }
  }

  // registry the subscribers
  let listeners = [];
  function subscribe(listener) {
    listeners.push(listener);
  }

  return {
    getState,
    dispatch,
    subscribe,
  };
}

export default createStore(reducer);
