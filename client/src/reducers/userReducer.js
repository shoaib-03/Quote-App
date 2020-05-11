export const initialState = null;

export const reducer = (state, action) => {
  if (action.type === "USER") {
    return action.payload;
  }
  if (action.type === "CLEAR") {
    return null;
  }
  if (action.type === "UPDATE") {
    return {
      ...state,
      followers: action.payload.followers,
      following: action.payload.following,
    };
  }
  if (action.type === "UPDATEPROFILE") {
    return {
      ...state,
      profileImage: action.payload.profileImage,
    };
  }
  if (action.type === "UPDATEUSERDETAIL") {
    return {
      ...state,
      name: action.payload.name,
      email: action.payload.email,
    };
  }

  return state;
};
