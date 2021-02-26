const initialState = {
  isAuthenticated: false,
  userName: "",
};

const reducer = (state = initialState, action) => {
  if (action.type == "ON_AUTH") {
    return {
      ...state,
      isAuthenticated: true,
      userName: action.userName,
    };
  }
  return state;
};

export default reducer;
