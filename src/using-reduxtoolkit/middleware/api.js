import axios from "axios";
import * as actions from "../api";
// create our own middleware to reuse it every time we want to do an API Call an avoid repetition

/*
const action = {
  type: "apiCallBegan",
  payload: {
    url: "/bugs",
    method: "get",
    data: {},
    onSuccess: "bugsReceived", // action to call if the call is succeed
    onError: "apiRequestFailed", // action to call if the call failed
  },
};
*/

const api =
  ({ dispatch }) =>
  (next) =>
  async (action) => {
    if (action.type !== actions.apiCallBegan.type) return next(action);
    // else: it is an API Call

    const { url, method, data, onSuccess, onError, onStart } = action.payload;

    if (onStart) {
      dispatch({ type: onStart });
    }

    next(action);

    try {
      const response = await axios.request({
        baseURL: "http://localhost:9001/api",
        url,
        method,
        data,
      });
      // General use
      dispatch(actions.apiCallSuccess(response.data));
      // for specific scenarios
      if (onSuccess) {
        dispatch({ type: onSuccess, payload: response.data });
      }
    } catch (error) {
      // General error action
      dispatch(actions.apiCallFailed(error.message));
      // for Specific scenarios
      if (onError) {
        dispatch({ type: onError, payload: error.message });
      }
    }
  };

export default api;
