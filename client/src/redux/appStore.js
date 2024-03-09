import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

const rootReducer = combineReducers({ user: userReducer });

const persistConfig = {
  key: "root",
  storage,
  version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const appStore = configureStore({
  reducer: persistedReducer,
<<<<<<< HEAD
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
  //   A custom middleware that detects if any non-serializable values have been included in state or dispatched actions, modeled after redux-immutable-state-invariant. Any detected non-serializable values will be logged to the console.
});

export const persistor = persistStore(appStore);

// Redux Toolkit was specifically designed to help provide good defaults when setting up a Redux store, and as part of that, it includes checks to make sure you're not accidentally mutating your data and that you're not including non-serializable values.
=======
  //   middleware: (getDefaultMiddleware) => {
  //     getDefaultMiddleware({ serializableCheck: false });
  //   },
});

export const persistor = persistStore(appStore);
>>>>>>> ea79c335b0a2e94430b8d500fbafb0ddec3e5760
