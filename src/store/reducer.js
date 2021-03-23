const initialState = {
  isAuthenticated: false,
  userName: "",
  chatRoomList: [],
  userAvatar: "",
  roomId: false,
  roomMembers: [],
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
  if (action.type == "ON_LOAD_ROOM") {
    return {
      ...state,
      roomId: action.roomId,
    };
  }
  if (action.type == "On_Load_Member") {
    return {
      ...state,
      roomMembers: action.roomMembers,
    };
  }
  return state;
};

export default reducer;
