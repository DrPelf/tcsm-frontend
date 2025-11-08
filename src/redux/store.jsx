import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import AuthSlice from "./slices/auth.slice";
import nestingBankReducer from "./slices/nestingBank.slice"; 
import speciesReducer from "./slices/species.slice"; 
import turtleReducer from "./slices/turtle.slice"; 
import capturesReducer from "./slices/captures.slice";
import adminReducer from "./slices/admin.slice";
import analysisReducer from "./slices/analysis.slice";
import hatchlingReducer from "./slices/hatchling.slice";
import nestingEventReducer from "./slices/nestingEvent.slice";
import recaptureReducer from "./slices/recapture.slice";
import mapReducer from './slices/map.slice';

const persistConfig = {
  key: "persist",
  storage,
  whitelist: ["Auth"], 
};

const rootReducer = combineReducers({
  Auth: AuthSlice,
  nestingBank: nestingBankReducer,
  species: speciesReducer, 
  turtle: turtleReducer, 
  captures: capturesReducer, 
  admin: adminReducer, 
  analysis: analysisReducer, 
  hatchling: hatchlingReducer,
  nestingEvent: nestingEventReducer,
  recapture: recaptureReducer,
      map: mapReducer,
});

export const makeStore = () => {
  const persistedReducer = persistReducer(persistConfig, rootReducer);
  let store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });
  store.__persistor = persistStore(store);
  return store;
};
