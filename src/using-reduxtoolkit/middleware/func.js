// Do we have to manually create this simple middleware in order to dispatch functions? (like API calls)

// No, the middleware is already build for us -> Thunk
// in ReduxToolkit is already included, if not install it npm i redux-thunk and pass it as a middleware in createStore()

const func =
  ({ dispatch, getState }) =>
  (next) =>
  (action) => {
    if (typeof action === "function") {
      action(dispatch, getState);
    } else {
      next(action);
    }
  };

export default func;
