import {combineReducers, configureStore} from "@reduxjs/toolkit";
import contactReducer from './reducers/ContactSlice.ts'

const rootReducer = combineReducers({
    contactReducer
})

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
    });
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
