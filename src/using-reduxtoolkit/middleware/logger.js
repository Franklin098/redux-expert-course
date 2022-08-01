// middleware to log every action to be dispatch

// in middelware we should use currying, and have SNA = Store, Next, Action
const logger = (param) => (store) => (next) => (action) => {
  console.log("param", param);
  return next(action);
};

export default logger;
