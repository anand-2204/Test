import { configureStore } from "@reduxjs/toolkit";
import gpsDataReducer from './Slice/GpsDataSlice';


const store = configureStore({
    reducer: {
        gpsData: gpsDataReducer
    }
})

export default store;