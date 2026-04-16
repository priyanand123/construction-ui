import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
// import { syncHistoryWithStore, routerReducer } from "react-router-redux";
import storage from "redux-persist/lib/storage";
import logger from "redux-logger";
import {thunk} from "redux-thunk";
import userslice from "../../app/redux/slices/user/userslice";
import rawmaterialslice from "./slices/rawmaterial/rawmaterialslice.jsx";
import  unitsslice  from "./slices/units/unitslice.jsx";
import purchaseslice  from "./slices/purchase/purchaseslice.jsx";
import machinelogslice from "./slices/machinelog/machinelogslice";
import materialhistoryslice  from "./slices/materialhistory/materialhistoryslice.jsx";
import  stockslice  from "./slices/stock/stockslice.jsx";
import authslice from "./slices/auth/authslice.jsx";
 import billingslice from "./slices/billing/billingslice.jsx";
 import  CompanydetailsSlice  from "./slices/companydetails/companydetailsSlice.jsx";
 import profileSlice from "./slices/profile/profileslice.jsx";
  import  tripSlice from "./slices/triptdetails/tripdetailsSlice.jsx";
  import  dieselSlice from "./slices/diesel/dieselSlice.jsx";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // only 'auth' slice will be persisted
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
   user:userslice,
   rawmaterial:rawmaterialslice,
   units:unitsslice,
   purchase:purchaseslice,
   machinelog:machinelogslice,
   materialhistory:materialhistoryslice,
   stock:stockslice,
   auth:authslice,
   billing:billingslice,
   compancydetails:CompanydetailsSlice,
   profile: profileSlice,
   trip:tripSlice,
   
  diesel: dieselSlice,

  })
);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk,
      serializableCheck: false, // Ignore check for non-serializable values
    }).concat(logger), // Add logger middleware
});

const persistor = persistStore(store);

export { store, persistor };
