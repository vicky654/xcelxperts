// authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { string } from 'yup';

interface AuthState {
    token: string | null;
    superiorId: string | null;
    currency: string | null;
    superiorRole: string | null;
    role: string | null;
    autoLogout: boolean | null;
    authToken: string | null;
    isVerified: boolean | null;
    isClient: boolean;
}

const initialState: AuthState = {
    token: null,
    superiorId: null,
    superiorRole: null,
    role: null,
    autoLogout: null,
    authToken: null,
    isVerified: null,
    currency: null,
    isClient: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthData(state, action: PayloadAction<Omit<AuthState, 'isClient'>>) {
            state.token = action.payload.token;
            state.superiorId = action.payload.superiorId;
            state.superiorRole = action.payload.superiorRole;
            state.role = action.payload.role;
            state.autoLogout = action.payload.autoLogout;
            state.authToken = action.payload.authToken;
            state.isVerified = action.payload.isVerified;
            state.currency = "(₤ )";
            state.isClient = action.payload.superiorRole === 'Client';
        },
        clearAuthData(state) {
            state.token = null;
            state.superiorId = null;
            state.superiorRole = null;
            state.role = null;
            state.autoLogout = null;
            state.authToken = null;
            state.isVerified = null;
            state.isClient = false;
        },
    },
});

export const { setAuthData, clearAuthData } = authSlice.actions;
export default authSlice.reducer;
