// clean redux code using Dux pattern -> all items in 1 file

// a slice of our store for Bugs

// Action Types
const BUG_ADDED = "bugAdded";
const BUG_REMOVED = "bugRemoved";
const BUG_SOLVED = "bugSolved";

// Action Creators

export const bugAdded = (description) => ({
  type: BUG_ADDED,
  payload: {
    description: description,
  },
});
// just returns an object with the template object for that action
export const bugSolved = (id) => ({
  type: BUG_SOLVED,
  payload: {
    id,
  },
});

// Reducer
let lastId = 0;

export default function reducer(state = [], action) {
  switch (action.type) {
    case BUG_ADDED:
      return [
        ...state,
        {
          description: action.payload.description,
          resolved: false,
          id: ++lastId,
        },
      ];
    case BUG_REMOVED:
      return state.filter((bug) => bug.id !== action.payload.id);
    case BUG_SOLVED:
      return state.map((bug) =>
        bug.id !== action.payload.id ? bug : { ...bug, resolved: true }
      );
    default:
      return state;
  }
  return state;
}
