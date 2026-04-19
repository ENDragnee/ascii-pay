import { combineReducers } from "@reduxjs/toolkit";
import customerSelectionReducer from "./slices/customer-selection-slice";

const rootReducer = combineReducers({
  customerSelection: customerSelectionReducer,
  // Add future slices here (e.g., ui: uiReducer)
});

export default rootReducer;
