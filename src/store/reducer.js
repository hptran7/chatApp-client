const initialState = {
  isAuthenticated: false,
  userName: "",
  chatRoomList: [],
  userAvatar: "",
};

const reducer = (state = initialState, action) => {
  if (action.type == "ON_AUTH") {
    return {
      ...state,
      isAuthenticated: true,
      userName: action.userName,
      userAvatar: action.userAvatar,
    };
  }
  return state;
};

export default reducer;
