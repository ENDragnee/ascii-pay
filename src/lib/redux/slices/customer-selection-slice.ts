import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CustomerSelectionState {
  selectedIds: string[];
}

const initialState: CustomerSelectionState = {
  selectedIds: [],
};

const customerSelectionSlice = createSlice({
  name: "customerSelection",
  initialState,
  reducers: {
    ToggleSelection: (state, action: PayloadAction<string>) => {
      if (state.selectedIds.includes(action.payload)) {
        state.selectedIds = state.selectedIds.filter(
          (id) => id !== action.payload,
        );
      } else {
        state.selectedIds.push(action.payload);
      }
    },
    ClearSelection: (state) => {
      state.selectedIds = [];
    },
    SelectAll: (state, action: PayloadAction<string[]>) => {
      state.selectedIds = action.payload;
    },
  },
});

export const { ToggleSelection, ClearSelection, SelectAll } =
  customerSelectionSlice.actions;
export default customerSelectionSlice.reducer;
