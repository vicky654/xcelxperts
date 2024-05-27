// import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
// import axios from "axios";
// // import { Slide, toast } from "react-toastify";
// // import { ErrorAlert } from "../layouts/Toaster/toastUtils";

// // Define the initial state
// interface DataState {
//     data: any[]; // Define a proper type based on the data structure you expect
//     loading: boolean;
//     error: string | null;
// }

// const initialState: DataState = {
//     data: [],
//     loading: false,
//     error: null,
// };

// // const ErrorToast = (message: string) => {
// //     toast.error(message, {
// //         position: toast.POSITION.TOP_RIGHT,
// //         hideProgressBar: true,
// //         transition: Slide,
// //         autoClose: 1000,
// //         theme: "colored",
// //     });
// // };

// // Create an asynchronous thunk to fetch the API data
// const baseUrl = import.meta.env.VITE_API_URL;
// export const fetchStoreData = createAsyncThunk(
//     "data/fetchStoreData",
//     async (_, thunkAPI) => {
//         const token = localStorage.getItem("token");

//         if (!token) {
//             throw new Error("Token not found in localStorage.");
//         }

//         try {
//             const response = await axios.get(`${baseUrl}/detail`, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });

//             const data = response.data;

//             if (data) {
//                 localStorage.setItem("superiorId", data?.data?.superiorId);
//                 localStorage.setItem("superiorRole", data?.data?.superiorRole);
//                 localStorage.setItem("role", data?.data?.role);
//                 localStorage.setItem("auto_logout", data?.data?.auto_logout);
//                 localStorage.setItem("two_factor", data?.data?.two_factor);
//                 localStorage.setItem("empDefaultView", data?.data?.empDefaultView);
//                 localStorage.setItem("menu", "horizontal");
//             }

//             return data.data;
//         } catch (error) {
//             setTimeout(() => {
//                 window.location.replace("/auth/cover-login");
//             }, 3000);

//             if (axios.isAxiosError(error)) {
//                 const { response } = error;
//                 if (response) {
//                     if (response.status === 401) {
//                         setTimeout(function () {
//                             window.location.replace("/auth/cover-login");
//                             // ErrorToast("Invalid access token");
//                             localStorage.clear();
//                         }, 2000);
//                     } else if (response.status === 403) {
//                         // Handle 403 error if needed
//                     } else if (response.data && response.data.message) {
//                         const errorMessage = Array.isArray(response.data.message)
//                             ? response.data.message.join(" ")
//                             : response.data.message;

//                         if (errorMessage) {
//                             // ErrorToast(errorMessage);
//                         }
//                     } else {
//                         // ErrorToast("An error occurred.");
//                     }
//                 } else {
//                     // ErrorToast("Failed to fetch data from API.");
//                 }
//             } else {
//                 console.error(error);
//                 window.location.replace("/under-construction");
//                 throw new Error("An error occurred.");
//             }

//             return thunkAPI.rejectWithValue("Failed to fetch data");
//         }
//     }
// );

// // Create the data slice
// const dataSlice = createSlice({
//     name: "data",
//     initialState,
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//             .addCase(fetchStoreData.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(fetchStoreData.fulfilled, (state, action: PayloadAction<any[]>) => {
//                 state.loading = false;
//                 state.data = action.payload;
//             })
//             .addCase(fetchStoreData.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message || "An error occurred";
//             });
//     },
// });

// // Export the action and reducer
// export const dataActions = dataSlice.actions;
// export default dataSlice.reducer;


import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Define the initial state
interface DataState {
    data: any; // Define a proper type based on the data structure you expect
    loading: boolean;
    error: string | null;
}

const initialState: DataState = {
    data: [],
    loading: false,
    error: null,

};

// Create an asynchronous thunk to fetch the API data
const baseUrl = import.meta.env.VITE_API_URL as string;
export const fetchStoreData = createAsyncThunk<any[], void, { rejectValue: string }>(
    "data/fetchStoreData",
    async (_, thunkAPI) => {
        const token = localStorage.getItem("token");

        if (!token) {
            return thunkAPI.rejectWithValue("Token not found in localStorage.");
        }

        try {
            const response = await axios.get(`${baseUrl}/detail`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = response.data;

            if (data) {
                localStorage.setItem("superiorId", data?.data?.superiorId);
                localStorage.setItem("superiorRole", data?.data?.superiorRole);
                localStorage.setItem("role", data?.data?.role);
                localStorage.setItem("auto_logout", data?.data?.auto_logout);
                localStorage.setItem("two_factor", data?.data?.two_factor);
                localStorage.setItem("empDefaultView", data?.data?.empDefaultView);
                localStorage.setItem("menu", "horizontal");
            }

            return data.data;
        } catch (error) {
            setTimeout(() => {
                window.location.replace("/auth/cover-login");
            }, 3000);

            if (axios.isAxiosError(error)) {
                const { response } = error;
                if (response) {
                    if (response.status === 401) {
                        setTimeout(() => {
                            window.location.replace("/auth/cover-login");
                            localStorage.clear();
                        }, 2000);
                    } else if (response.status === 403) {
                        // Handle 403 error if needed
                    } else if (response.data && response.data.message) {
                        const errorMessage = Array.isArray(response.data.message)
                            ? response.data.message.join(" ")
                            : response.data.message;

                        if (errorMessage) {
                            // ErrorToast(errorMessage);
                        }
                    } else {
                        // ErrorToast("An error occurred.");
                    }
                } else {
                    // ErrorToast("Failed to fetch data from API.");
                }
            } else {
                console.error(error);
                window.location.replace("/under-construction");
                return thunkAPI.rejectWithValue("An error occurred.");
            }

            return thunkAPI.rejectWithValue("Failed to fetch data");
        }
    }
);

// Create the data slice
const dataSlice = createSlice({
    name: "data",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchStoreData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStoreData.fulfilled, (state, action: PayloadAction<any[]>) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchStoreData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message || "An error occurred";
            });
    },
});

// Export the action and reducer
export const dataActions = dataSlice.actions;
export default dataSlice.reducer;
