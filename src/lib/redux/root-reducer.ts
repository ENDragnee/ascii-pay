import { combineReducers } from "@reduxjs/toolkit";
import customerSelectionReducer from "./slices/customer-selection-slice";
import ussdSlice from "./slices/ussd-slice";

const rootReducer = combineReducers({
  customerSelection: customerSelectionReducer,
  ussdSlice: ussdSlice,
  // Add future slices here (e.g., ui: uiReducer)
});

export default rootReducer;
