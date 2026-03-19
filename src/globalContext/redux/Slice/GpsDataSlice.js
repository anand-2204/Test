import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios';
import { supabase } from '../../supabase/supabase';

// Supabase save thunk
export const saveChangedVehiclesToSupabase = createAsyncThunk(
    'gps/saveToSupabase',
    async (changedVehicles, thunkAPI) => {
        try {
            if (changedVehicles.length === 0) return;

            const { error } = await supabase
                .from('vehicle_history')
                .insert(changedVehicles);

            if (error) throw error;

            // console.log(`Saved ${changedVehicles.length} records to Supabase`);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Main GPS fetch thunk
export const fetchGpsData = createAsyncThunk('gps/fetchGpsData', async (_, thunkAPI) => {
    try {
        const response = await axios.post(
            'https://compass.transight.in/external/api/v2/get_all_vehicles_last_data/',
            {
                "apikey": import.meta.env.VITE_GPS_APIKEY,
                "split_lating": "true"
            }
        );

        // console.table(response.data.data);
        const vehicles = response.data.data;

        // Get current history from Redux state BEFORE reducer updates it
        const state = thunkAPI.getState();
        const history = state.gpsData.history;

        const changedVehicles = [];

        if (vehicles && Array.isArray(vehicles)) {
            vehicles.forEach((vehicle) => {
                const imei = vehicle.imei;
                const vehicleHistory = history[imei] || [];

                if (vehicle.location) {
                    const [lat, lng] = vehicle.location.split(' ');
                    const latitude = parseFloat(lat);
                    const longitude = parseFloat(lng);

                    const lastPoint = vehicleHistory.at(-1);
                    const hasChanged =
                        !lastPoint ||
                        lastPoint.latitude !== latitude ||
                        lastPoint.longitude !== longitude ||
                        lastPoint.time !== vehicle.time;

                    if (hasChanged) {
                        changedVehicles.push({
                            imei,
                            latitude,
                            longitude,
                            speed: vehicle.speed,
                            ignition: vehicle.ignition,
                            time: vehicle.time,
                        });
                    }
                }
            });
        }

        let lastSupabaseSave = null;
        const SAVE_INTERVAL_MS = 60 * 10 * 1000; // 10 minutes

        // Await dispatch so errors don't get silently lost
        if (changedVehicles.length > 0) {
            const now = Date.now();
            const shouldSave =
                !lastSupabaseSave || (now - lastSupabaseSave) >= SAVE_INTERVAL_MS;

            if (shouldSave) {
                await thunkAPI.dispatch(saveChangedVehiclesToSupabase(changedVehicles));
                lastSupabaseSave = now;
                console.log("saved to supabase");
            } else {
                const minutesLeft = Math.ceil((SAVE_INTERVAL_MS - (now - lastSupabaseSave)) / 60000);
                console.log(`Next Supabase save in ${minutesLeft} minutes`);
            }
        }

        return vehicles;

    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data ?? error.message);
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
                state.gpsData = action.payload;

                // Update local history
                if (action.payload && Array.isArray(action.payload)) {
                    action.payload.forEach((vehicle) => {
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
            })
            // Handle Supabase save errors
            .addCase(saveChangedVehiclesToSupabase.rejected, (state, action) => {
                console.error('Supabase save failed:', action.payload);
                state.error = action.payload;
            });
    },
});

export const { clearHistory, clearVehicleHistory } = gpsDataSlice.actions;
export default gpsDataSlice.reducer;