// using ReduxToolKit createSlice
import { createSlice } from "@reduxjs/toolkit";

// to use Memoization, cache selectors,  improve performance and avoid re-renders
import { createSelector } from "reselect";

// use apiCall middleware actionTypes
import { apiCallBegan } from "./api";
import moment from "moment";

const slice = createSlice({
  name: "bugs",
  initialState: {
    list: [], // array of bugs, the actual data
    loading: false, // to display loading indicator in the UI
    lastFetch: null, // timestamp of the last call to the server (useful to implement caching)
  },
  reducers: {
    // addBug -> command, bugAdded -> event
    bugAdded: (bugs, action) => {
      // payload contains the data from the API call
      bugs.list.push(action.payload);
    },
    // resolveBug -> command, bugResolved -> event
    bugResolved: (bugs, action) => {
      // we can write mutating code
      const index = bugs.list.findIndex((bug) => bug.id === action.payload.id);
      bugs.list[index].resolved = true;
    },
    bugRemoved: (bugs, action) => {
      const index = bugs.list.findIndex((bug) => bug.id === action.payload.id);
      if (index > -1) {
        bugs.list.splice(index, 1);
      }
    },
    bugAssignedUser: (bugs, action) => {
      const index = bugs.list.findIndex((bug) => bug.id === action.payload.id);
      if (index > -1) {
        bugs.list[index].userId = action.payload.userId;
      }
    },
    // bugs/bugsReceived
    bugsReceived: (bugs, action) => {
      bugs.list = action.payload;
      bugs.loading = false;
      bugs.lastFetch = Date.now();
    },
    bugsRequested: (bugs, action) => {
      bugs.loading = true;
    },
    bugsRequestFailed: (bugs, action) => {
      bugs.loading = false;
    },
  },
});

// in our UI we should only call actions in form of Commands like 'addBug', not events like 'bugAdded'
export const {
  bugAdded,
  bugResolved,
  bugAssignedUser,
  bugsReceived,
  bugsRequested,
  bugsRequestFailed,
} = slice.actions;

export default slice.reducer;

// Action Creators

const url = "/bugs";
export const loadBugs = () => (dispatch, getState) => {
  // implementing Caching
  const { lastFetch } = getState().entities.bugs;
  const diffInMinutes = moment().diff(moment(lastFetch), "minutes");
  if (diffInMinutes < 10) {
    return; // do not call the server for 2nd time
  }
  return dispatch(
    apiCallBegan({
      url,
      onStart: bugsRequested.type,
      onSuccess: bugsReceived.type, // action to call if the call is succeed
      onError: bugsRequestFailed.type,
    })
  );
};

export const addBug = (bug) =>
  apiCallBegan({
    url,
    method: "post",
    data: bug,
    onSuccess: bugAdded.type,
  });

export const resolveBug = (id) =>
  apiCallBegan({
    url: `${url}/${id}`,
    method: "patch",
    data: { resolved: true },
    onSuccess: bugResolved.type,
  });

export const assignBug = (bugId, userId) =>
  apiCallBegan({
    url: `${url}/${bugId}`,
    method: "patch",
    data: { userId },
    onSuccess: bugAssignedUser.type,
  });

// Selector function

// export const selectUnresolvedBugs = (state) => {
//   return state.entities.bugs.filter((bug) => !bug.resolved);
// };

// to use Memoization, cache selectors,  improve performance and avoid re-renders
export const selectUnresolvedBugs = createSelector(
  (state) => state.entities.bugs,
  (state) => state.entities.projects,
  (bugs, projects) => bugs.list.filter((bug) => !bug.resolved)
  // if the state of bugs or projects hasn't change, the out is not going to be recalculate
  // we have a cache to get the result
);

export const selectBugByUser = (userId) =>
  createSelector(
    (state) => state.entities.bugs, // output of this is the input of the next line
    (bugs) => bugs.list.filter((bug) => bug.userId === userId)
  );
