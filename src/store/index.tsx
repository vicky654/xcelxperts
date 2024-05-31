import { combineReducers, configureStore } from '@reduxjs/toolkit';
import themeConfigSlice from './themeConfigSlice';
import dataReducer from './dataSlice';

import authReducer from './authSlice';

const rootReducer = combineReducers({
    themeConfig: themeConfigSlice,
    data: dataReducer,
    auth: authReducer,
});

const store = configureStore({
    reducer: rootReducer,
});

export type IRootState = ReturnType<typeof rootReducer>;
export default store;
