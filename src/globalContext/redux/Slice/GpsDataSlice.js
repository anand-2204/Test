import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios';



export const fetchGpsData = createAsyncThunk('gps/fetchGpsData', async (_, thunkAPI) => {
    try {
        const response = await axios.post('https://compass.transight.in/external/api/v2/get_all_vehicles_last_data/',
            {
                "apikey": import.meta.env.VITE_GPS_APIKEY,

                "split_lating": "true"
            }
        );
        console.log("response==", response.data.data);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data ?? error.message);
    }
});



const MAX_HISTORY = 100;
const gpsDataSlice = createSlice({
    name: "gpsData",
    initialState: {
        gpsData: [],
        history: {},
        loading: false,
        error: null,
    },
    reducers: {
        clearHistory: (state) => {
            state.history = {};
        },
        clearVehicleHistory: (state, action) => {
            delete state.history[action.payload];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchGpsData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGpsData.fulfilled, (state, action) => {
                state.loading = false;
                state.gpsData = action.payload; // ✅ payload is already the array

                if (action.payload && Array.isArray(action.payload)) { // ✅
                    action.payload.forEach((vehicle) => { // ✅
                        const imei = vehicle.imei;
                        if (!state.history[imei]) {
                            state.history[imei] = [];
                        }

                        if (vehicle.location) {
                            const [lat, lng] = vehicle.location.split(' ');
                            const latitude = parseFloat(lat);
                            const longitude = parseFloat(lng);

                            const lastPoint = state.history[imei].at(-1);
                            const hasChanged =
                                !lastPoint ||
                                lastPoint.latitude !== latitude ||
                                lastPoint.longitude !== longitude ||
                                lastPoint.time !== vehicle.time;

                            if (hasChanged) {
                                state.history[imei].push({
                                    latitude,
                                    longitude,
                                    speed: vehicle.speed,
                                    ignition: vehicle.ignition,
                                    time: vehicle.time,
                                });

                                if (state.history[imei].length > MAX_HISTORY) {
                                    state.history[imei].shift();
                                }
                            }
                        }
                    });
                }
            })
            .addCase(fetchGpsData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});




export const { clearHistory, clearVehicleHistory } = gpsDataSlice.actions;
export default gpsDataSlice.reducer;