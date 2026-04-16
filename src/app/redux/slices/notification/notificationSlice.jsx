import { createSlice } from "@reduxjs/toolkit";
import {
  fetchNotificationListReq,
  updateNotificationReq,
} from "../../../../api/notification/notificationReq";

export const NotificationSlice = createSlice({
  name: "Notification",
  initialState: {
    loading: false,
    error: false,
    data: {
      local: [],
      remote: [],
      count: 0,
      all: [],
      read: false,
    },
  },
  reducers: {
    startLoading: (state) => {
      state.loading = true;
    },
    addData: (state, { payload }) => {
      state.loading = false;
      state.error = false;
      state.data = {
        local: [...state.data.local],
        remote: payload,
        count: state.data.count + payload?.length,
        all: [...payload, ...state.data.local],
        read: false,
      };

      return state;
    },
    addlocalData: (state, { payload }) => {
      state.loading = false;
      state.error = false;
      state.data = {
        local: [payload],
        remote: [...state.data.remote],
        count: state.data.count + 1,
        all: [payload, ...state.data.remote],
        read: false,
      };

      return state;
    },
    clearData: (state) => {
      state.loading = false;
      state.error = false;
      state.data = {
        local: [],
        remote: [],
        all: [],
        count: 0,
        read: false,
      };
      return state;
    },
    dataRead: (state, { payload }) => {
      state.data.read = payload;
      state.data.count = 0;
      return state;
    },
    setError: (state) => {
      state.error = true;
      state.loading = false;
      return state;
    },
  },
});

export const {
  startLoading,
  addData,
  addlocalData,
  clearData,
  dataRead,
  setError,
} = NotificationSlice.actions;
export default NotificationSlice.reducer;

export const addLocalNotificationAction = (msg) => async (dispatch) => {
  try {
    msg && dispatch(addlocalData({ actionMessage: msg, actionCount: 0 }));
  } catch (error) {
    dispatch(setError());
  }
};
export const clearNotificationAction = () => async (dispatch) => {
  try {
    dispatch(clearData());
  } catch (error) {
    dispatch(setError());
  }
};
export const notificationReadAction = (status) => async (dispatch) => {
  try {
    dispatch(dataRead(true));
    const res = await updateNotificationReq();
  } catch (error) {
    dispatch(setError());
  }
};
export const fetchNotificationListAction = (userId) => async (dispatch) => {
  try {
    dispatch(startLoading());
    const res = await fetchNotificationListReq(userId);
    dispatch(addData(res?.data || []));
  } catch (error) {
    dispatch(setError());
  }
};
