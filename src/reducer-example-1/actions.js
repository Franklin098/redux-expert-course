import * as actions from "./actionTypes";

// Action Creators
// help to avoid a lot of repeaded code when we want to dispatch the same action in multiple places

export const bugAdded = (description) => ({
  type: actions.BUG_ADDED,
  payload: {
    description: description,
  },
});
// just returns an object with the template object for that action
export const bugSolved = (id) => ({
  type: actions.BUG_SOLVED,
  payload: {
    id,
  },
});
