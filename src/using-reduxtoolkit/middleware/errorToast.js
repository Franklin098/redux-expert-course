// middleware to launch a toast everytime there is an error message

const errorToast = (store) => (next) => (action) => {
  if (action.type === "error") {
    console.log("Toastify: " + action.payload.message);
  } else {
    next(action);
  }
};

export default errorToast;
