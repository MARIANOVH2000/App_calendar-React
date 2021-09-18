import { combineReducers } from "redux";
import { authReducer } from "./authReducer";
import { calendarReducer } from "./calendarsReducer";
import { uiReducers } from "./uiReducers";

export const rootReducers = combineReducers({
  ui: uiReducers,
  calendar: calendarReducer,
  auth:authReducer
  //todo: authReducer
  //todo: Calendar Reducer
});
