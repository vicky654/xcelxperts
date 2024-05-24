import { combineReducers, configureStore } from '@reduxjs/toolkit';
import themeConfigSlice from './themeConfigSlice';
import dataReducer from './dataSlice';

const rootReducer = combineReducers({
    themeConfig: themeConfigSlice,
    data: dataReducer,
});

const store = configureStore({
    reducer: rootReducer,
});

export type IRootState = ReturnType<typeof rootReducer>;
export default store;
