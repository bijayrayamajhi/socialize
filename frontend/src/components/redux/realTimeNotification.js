import { createSlice } from "@reduxjs/toolkit";

const realTimeNotificationSlice = createSlice({
  name: "realTimeNotification",
  initialState: {
    likeDislikeNotification: [],
  },
  reducers: {
    setLikeDislikeNotification: (state, action) => {
      if (action.payload.type === "like") {
        state.likeDislikeNotification.push(action.payload);
      } else if (action.payload.type === "dislike") {
        state.likeDislikeNotification = state.likeDislikeNotification.filter(
          (singleNotification) =>
            !(
              singleNotification.targetedPostId === action.payload.targetedPostId &&
              singleNotification.userDetails?._id === action.payload.userDetails?._id
            )
        );
      } else if (
        action.payload === null ||
        (Array.isArray(action.payload) && action.payload.length === 0)
      ) {
        state.likeDislikeNotification = [];
      }
    },
  },
});

export const { setLikeDislikeNotification } = realTimeNotificationSlice.actions;
export default realTimeNotificationSlice.reducer;
