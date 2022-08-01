// using ReduxToolKit helpers

import { createAction, createReducer, createSlice } from "@reduxjs/toolkit";

// Without Redux Toolkit:  see /store-dux-patter to see the code before adding redux toolkit

// =============== ActionCreators and ActionTypes ==============

export const bugAdded = createAction("bugAdded"); // returns a function that creates an ActionCreator
bugAdded.type; // this is the ActionType

export const bugRemoved = createAction("bugRemoved");
export const bugSolved = createAction("bugSolved");

// ================== Reducer ======================

// With Redux Toolkit we can create a reducer without a 'switch' statement
// and also write mutate-style code. Toolkit implements immer inside to translate to inmutable code.
let lastId = 0;

// (initialState, object that maps actions to functions)
export default createReducer([], {
  // key: value | actions: functions()
  bugAdded: (state, action) => {
    // we can write here mutating code
    state.push({
      description: action.payload.description,
      resolved: false,
      id: ++lastId,
    });
  },

  // we can call 'state' as 'bugs' to make it readable
  bugResolved: (bugs, action) => {
    // we can write mutating code
    const index = bugs.findIndex((bug) => bug.id === action.payload.id);
    bugs[index].resolved = true;
  },

  // to avoid harcoded name, and get createAction as our single source of truth for the action name
  [bugRemoved.type]: (bugs, action) => {
    const index = bugs.findIndex((bug) => bug.id === action.payload.id);
    if (index > -1) {
      bugs.splice(index, 1);
    }
  },
});
