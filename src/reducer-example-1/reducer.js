import * as actions from "./actionTypes";

// Our store is a simple array of bugs []

let lastId = 0;

// state = [], by default our initial state is an empty array
export default function reducer(state = [], action) {
  // the action payload should have the minimum information to perform the action
  // if we need aditional logic we can add it here. In the reducer we define the business logic

  switch (action.type) {
    case actions.BUG_ADDED:
      return [
        ...state,
        {
          description: action.payload.description,
          resolved: false,
          id: ++lastId,
        },
      ];
    case actions.BUG_REMOVED:
      return state.filter((bug) => bug.id !== action.payload.id);
    case actions.BUG_SOLVED:
      return state.map((bug) =>
        bug.id !== action.payload.id ? bug : { ...bug, resolved: true }
      );
    default:
      return state;
  }
  // return the current state always as default
  return state;
}
